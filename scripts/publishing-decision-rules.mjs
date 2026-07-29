import { createHash } from "node:crypto";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const publishabilityScopes = new Set(["publish", "update", "takedown"]);
const approvingScopes = new Set(["publish", "update"]);
const publishablePieceStatuses = new Set(["approved", "published"]);
const snapshotSchemaVersion = "2026-07-29.publishing-decisions.v2";
const governingInteractionModelId = "34361308-87eb-4a0c-9752-89e5d59621d6";
const snapshotLifetimeMs = 24 * 60 * 60 * 1000;
const futureClockSkewMs = 5 * 60 * 1000;

function timestamp(value) {
  const parsed = Date.parse(value ?? "");
  return Number.isFinite(parsed) ? parsed : null;
}

function isNonExpired(decision, nowMs) {
  if (!decision.validUntil) return true;
  const validUntil = timestamp(decision.validUntil);
  return validUntil !== null && validUntil > nowMs;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function perspectiveRevisionHash(post) {
  const {
    editorialCheck: _editorialCheck,
    sourceRevisionHash: _sourceRevisionHash,
    ...publicRevision
  } = post;
  return `sha256:${createHash("sha256").update(canonicalJson(publicRevision)).digest("hex")}`;
}

export function publishedRelationFailures(posts) {
  const publicationStateBySlug = new Map(
    posts.map((post) => [post.slug, post.publicationState]),
  );
  const failures = [];
  for (const post of posts) {
    if (post.publicationState !== "published") continue;
    for (const relatedSlug of post.related ?? []) {
      if (publicationStateBySlug.get(relatedSlug) !== "published") {
        failures.push(
          `${post.slug}: published perspective cannot relate to non-published perspective ${relatedSlug}`,
        );
      }
    }
  }
  return failures;
}

export function publishingDecisionSnapshotFailures(snapshot, { now = new Date() } = {}) {
  const failures = [];
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return ["publishing-decision graph export must be an object"];
  }
  if (snapshot.schemaVersion !== snapshotSchemaVersion) {
    failures.push("publishing-decision graph export has an unsupported schemaVersion");
  }
  if (snapshot.activeBundle !== "volant_base") {
    failures.push("publishing-decision graph export must come from volant_base");
  }
  if (snapshot.interactionModelId !== governingInteractionModelId) {
    failures.push(
      `publishing-decision graph export must cite governing InteractionModel ${governingInteractionModelId}`,
    );
  }
  const nowMs = now instanceof Date ? now.getTime() : timestamp(now);
  const exportedAt = timestamp(snapshot.exportedAt);
  const validUntil = timestamp(snapshot.validUntil);
  if (!Number.isFinite(nowMs)) {
    failures.push("publishing-decision validation received an invalid current time");
  }
  if (exportedAt === null) {
    failures.push("publishing-decision graph export requires a valid exportedAt timestamp");
  }
  if (validUntil === null) {
    failures.push("publishing-decision graph export requires a valid validUntil timestamp");
  }
  if (Number.isFinite(nowMs) && exportedAt !== null && exportedAt > nowMs + futureClockSkewMs) {
    failures.push("publishing-decision graph export is dated in the future");
  }
  if (
    Number.isFinite(nowMs) &&
    exportedAt !== null &&
    validUntil !== null &&
    (validUntil <= nowMs || validUntil <= exportedAt || validUntil - exportedAt > snapshotLifetimeMs)
  ) {
    failures.push("publishing-decision graph export is stale or has an excessive validity window");
  }
  if (!Array.isArray(snapshot.decisions)) {
    failures.push("publishing-decision graph export requires a decisions array");
  }
  return failures;
}

export function publishingDecisionFailures(post, snapshot, { now = new Date() } = {}) {
  if (post.publicationState !== "published") return [];

  const nowMs = now instanceof Date ? now.getTime() : timestamp(now);
  if (!Number.isFinite(nowMs)) {
    return [`${post.slug}: publishing-decision validation received an invalid current time`];
  }

  const failures = publishingDecisionSnapshotFailures(snapshot, { now });
  if (failures.length) return failures.map((failure) => `${post.slug}: ${failure}`);

  const check = post.editorialCheck;
  const decisionId = check?.publishingDecisionId;
  if (!decisionId) return [`${post.slug}: published perspectives require a publishingDecisionId`];
  const revisionHash = post.sourceRevisionHash ?? perspectiveRevisionHash(post);
  if (check?.revisionHash !== revisionHash) {
    failures.push(`${post.slug}: editorial revisionHash does not match the current source revision`);
  }

  const referencedDecision = snapshot.decisions.find((decision) => decision.id === decisionId);
  if (!referencedDecision) {
    return [
      `${post.slug}: publishingDecisionId ${decisionId} is absent from the volant_base graph export`,
    ];
  }

  if (referencedDecision.perspective?.slug !== post.slug) {
    failures.push(
      `${post.slug}: publishingDecisionId ${decisionId} targets ${referencedDecision.perspective?.slug ?? "no Perspective"}`,
    );
  }

  if (referencedDecision.perspective?.contentHash !== revisionHash) {
    failures.push(
      `${post.slug}: graph Perspective content hash does not match the current source revision`,
    );
  }
  if (referencedDecision.revisionHash !== revisionHash) {
    failures.push(
      `${post.slug}: publishingDecisionId ${decisionId} does not authorize the current source revision`,
    );
  }
  if (referencedDecision.assessment?.revisionHash !== revisionHash) {
    failures.push(
      `${post.slug}: editorial assessment does not cover the current source revision`,
    );
  }
  if (!isNonExpired(referencedDecision, nowMs)) {
    failures.push(`${post.slug}: publishingDecisionId ${decisionId} is expired`);
  }

  const modifiedAt = timestamp(`${post.modified ?? ""}T00:00:00Z`);
  const reviewedAt = timestamp(`${check?.reviewedAt ?? ""}T00:00:00Z`);
  const assessedAt = timestamp(referencedDecision.assessment?.assessedAt);
  const decidedAt = timestamp(referencedDecision.decidedAt);
  const exportedAt = timestamp(snapshot.exportedAt);
  if (modifiedAt === null) {
    failures.push(`${post.slug}: published perspectives require a valid modified date`);
  } else {
    if (reviewedAt === null || reviewedAt < modifiedAt) {
      failures.push(`${post.slug}: editorial review predates the current source revision`);
    }
    if (assessedAt === null || assessedAt < modifiedAt) {
      failures.push(`${post.slug}: graph editorial assessment predates the current source revision`);
    }
    if (decidedAt === null || decidedAt < modifiedAt) {
      failures.push(`${post.slug}: publishing decision predates the current source revision`);
    }
  }
  if (reviewedAt !== null && reviewedAt > nowMs + futureClockSkewMs) {
    failures.push(`${post.slug}: editorial review is dated after the validation time`);
  }
  if (assessedAt !== null && assessedAt > nowMs + futureClockSkewMs) {
    failures.push(`${post.slug}: graph editorial assessment is dated after the validation time`);
  }
  if (decidedAt !== null && decidedAt > nowMs + futureClockSkewMs) {
    failures.push(`${post.slug}: publishing decision is dated after the validation time`);
  }
  if (reviewedAt !== null && assessedAt !== null && reviewedAt > assessedAt) {
    failures.push(`${post.slug}: graph editorial assessment predates the editorial review`);
  }
  if (assessedAt !== null && decidedAt !== null && assessedAt > decidedAt) {
    failures.push(`${post.slug}: publishing decision predates its editorial assessment`);
  }
  if (exportedAt !== null && decidedAt !== null && decidedAt > exportedAt) {
    failures.push(`${post.slug}: publishing decision postdates the graph export`);
  }

  const currentDecisions = snapshot.decisions
    .filter((decision) => decision.perspective?.slug === post.slug)
    .filter((decision) => publishabilityScopes.has(decision.scope))
    .filter((decision) => decision.decisionStatus === "approved")
    .filter((decision) => decision.recordStatus === "active")
    .filter((decision) => isNonExpired(decision, nowMs))
    .map((decision) => ({ decision, decidedAt: timestamp(decision.decidedAt) }))
    .filter(({ decidedAt }) => decidedAt !== null)
    .filter(({ decidedAt }) => decidedAt <= nowMs + futureClockSkewMs)
    .sort((left, right) => right.decidedAt - left.decidedAt);

  if (!currentDecisions.length) {
    failures.push(`${post.slug}: graph export has no active approved non-expired publishability decision`);
  } else {
    const latestTime = currentDecisions[0].decidedAt;
    const latest = currentDecisions.filter(({ decidedAt }) => decidedAt === latestTime);
    if (latest.length !== 1) {
      failures.push(`${post.slug}: latest publishability decision is ambiguous`);
    } else if (latest[0].decision.id !== decisionId) {
      failures.push(
        `${post.slug}: publishingDecisionId ${decisionId} is stale; latest decision is ${latest[0].decision.id}`,
      );
    }
  }

  if (referencedDecision.decisionStatus !== "approved") {
    failures.push(
      `${post.slug}: publishingDecisionId ${decisionId} is ${referencedDecision.decisionStatus ?? "missing a decision status"}`,
    );
  }
  if (!approvingScopes.has(referencedDecision.scope)) {
    failures.push(
      `${post.slug}: publishingDecisionId ${decisionId} has non-publishing scope ${referencedDecision.scope ?? "missing"}`,
    );
  }
  if (referencedDecision.recordStatus !== "active") {
    failures.push(
      `${post.slug}: publishingDecisionId ${decisionId} has non-active record status ${referencedDecision.recordStatus ?? "missing"}`,
    );
  }
  if (!publishablePieceStatuses.has(referencedDecision.perspective?.status)) {
    failures.push(
      `${post.slug}: graph Perspective status ${referencedDecision.perspective?.status ?? "missing"} is not publishable`,
    );
  }
  if (!uuidPattern.test(referencedDecision.decidedBy?.id ?? "")) {
    failures.push(`${post.slug}: publishingDecisionId ${decisionId} has no named human decision-maker`);
  }
  if (referencedDecision.decidedBy?.name !== check?.reviewer) {
    failures.push(
      `${post.slug}: publishing decision-maker ${referencedDecision.decidedBy?.name ?? "missing"} does not match editorial reviewer ${check?.reviewer ?? "missing"}`,
    );
  }
  if (!check?.graphAssessmentId || referencedDecision.assessment?.id !== check.graphAssessmentId) {
    failures.push(
      `${post.slug}: publishingDecisionId ${decisionId} is not evidenced by editorial assessment ${check?.graphAssessmentId ?? "missing"}`,
    );
  }

  return failures;
}
