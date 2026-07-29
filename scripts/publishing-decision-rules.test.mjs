import { deepEqual, match, notEqual } from "node:assert/strict";
import test from "node:test";

import {
  perspectiveRevisionHash,
  publishedRelationFailures,
  publishingDecisionFailures,
} from "./publishing-decision-rules.mjs";

const publishId = "11111111-1111-4111-8111-111111111111";
const updateId = "22222222-2222-4222-8222-222222222222";
const assessmentId = "33333333-3333-4333-8333-333333333333";
const personId = "44444444-4444-4444-8444-444444444444";
const otherDecisionId = "66666666-6666-4666-8666-666666666666";

function publicPost() {
  return {
    slug: "example",
    title: "Example",
    modified: "2026-07-28",
    publicationState: "published",
    sections: [],
  };
}

const revisionHash = perspectiveRevisionHash(publicPost());

function decision(overrides = {}) {
  return {
    id: updateId,
    decisionStatus: "approved",
    scope: "update",
    decidedAt: "2026-07-29T01:00:00Z",
    validUntil: null,
    recordStatus: "active",
    revisionHash,
    perspective: {
      id: "55555555-5555-4555-8555-555555555555",
      slug: "example",
      status: "published",
      contentHash: revisionHash,
    },
    decidedBy: { id: personId, name: "Eddie Austin" },
    assessment: {
      id: assessmentId,
      assessedAt: "2026-07-29T00:45:00Z",
      revisionHash,
    },
    ...overrides,
  };
}

function snapshot(decisions = [decision()], overrides = {}) {
  return {
    schemaVersion: "2026-07-29.publishing-decisions.v2",
    activeBundle: "volant_base",
    interactionModelId: "34361308-87eb-4a0c-9752-89e5d59621d6",
    exportedAt: "2026-07-29T01:30:00Z",
    validUntil: "2026-07-30T01:30:00Z",
    decisions,
    ...overrides,
  };
}

function post(overrides = {}) {
  return {
    ...publicPost(),
    editorialCheck: {
      reviewer: "Eddie Austin",
      reviewedAt: "2026-07-28",
      graphAssessmentId: assessmentId,
      publishingDecisionId: updateId,
      revisionHash,
    },
    ...overrides,
  };
}

const now = new Date("2026-07-29T01:30:00Z");

test("revision hashes include graph-attributed public fields", () => {
  const post = publicPost();
  notEqual(
    perspectiveRevisionHash(post),
    perspectiveRevisionHash({
      ...post,
      subjectMatter: ["Legibility"],
    }),
  );
  notEqual(
    perspectiveRevisionHash(post),
    perspectiveRevisionHash({
      ...post,
      madeWith: [{ actorName: "Graph snapshot", roleLabel: "Context graph" }],
    }),
  );
});

test("accepts the latest approved graph decision for the matching Perspective", () => {
  deepEqual(publishingDecisionFailures(post(), snapshot(), { now }), []);
});

test("rejects a snapshot governed by a different interaction model", () => {
  const failures = publishingDecisionFailures(
    post(),
    snapshot([decision()], {
      interactionModelId: "77777777-7777-4777-8777-777777777777",
    }),
    { now },
  );
  match(
    failures.join("\n"),
    /must cite governing InteractionModel 34361308-87eb-4a0c-9752-89e5d59621d6/,
  );
});

test("rejects a fabricated decision UUID", () => {
  const failures = publishingDecisionFailures(
    post({
      editorialCheck: {
        ...post().editorialCheck,
        publishingDecisionId: otherDecisionId,
      },
    }),
    snapshot(),
    { now },
  );
  match(failures.join("\n"), /absent from the volant_base graph export/);
});

test("rejects a decision targeting another Perspective", () => {
  const failures = publishingDecisionFailures(
    post(),
    snapshot([decision({ perspective: { id: "x", slug: "other", status: "published" } })]),
    { now },
  );
  match(failures.join("\n"), /targets other/);
});

test("rejects stale approval when a later takedown governs the piece", () => {
  const publish = decision({
    id: publishId,
    scope: "publish",
    decidedAt: "2026-07-07T00:00:00Z",
  });
  const takedown = decision({
    id: updateId,
    scope: "takedown",
    decidedAt: "2026-07-10T00:00:00Z",
  });
  const failures = publishingDecisionFailures(
    post({
      editorialCheck: {
        ...post().editorialCheck,
        publishingDecisionId: publishId,
      },
    }),
    snapshot([publish, takedown]),
    { now },
  );
  match(failures.join("\n"), /is stale; latest decision/);
});

test("ignores rejected or inactive later decisions when selecting the latest governing decision", () => {
  const approved = decision({
    id: updateId,
    decidedAt: "2026-07-29T01:00:00Z",
  });
  const rejected = decision({
    id: publishId,
    decisionStatus: "rejected",
    scope: "takedown",
    decidedAt: "2026-07-29T01:10:00Z",
  });
  const superseded = decision({
    id: otherDecisionId,
    recordStatus: "superseded",
    scope: "takedown",
    decidedAt: "2026-07-29T01:20:00Z",
  });
  deepEqual(
    publishingDecisionFailures(
      post(),
      snapshot([approved, rejected, superseded]),
      { now },
    ),
    [],
  );
});

test("rejects an expired decision", () => {
  const failures = publishingDecisionFailures(
    post(),
    snapshot([decision({ validUntil: "2026-07-20T00:00:00Z" })]),
    { now },
  );
  match(failures.join("\n"), /is expired/);
});

test("rejects an expired graph export", () => {
  const failures = publishingDecisionFailures(post(), snapshot(), {
    now: new Date("2026-07-30T01:31:00Z"),
  });
  match(failures.join("\n"), /graph export is stale/);
});

test("rejects approval that predates the current source revision", () => {
  const failures = publishingDecisionFailures(
    post(),
    snapshot([
      decision({
        decidedAt: "2026-07-27T23:00:00Z",
        assessment: {
          id: assessmentId,
          assessedAt: "2026-07-27T22:00:00Z",
          revisionHash,
        },
      }),
    ]),
    { now },
  );
  match(failures.join("\n"), /graph editorial assessment predates/);
  match(failures.join("\n"), /publishing decision predates/);
});

test("rejects future-dated and out-of-order approval timestamps", () => {
  const futureFailures = publishingDecisionFailures(
    post(),
    snapshot([
      decision({
        decidedAt: "2026-07-29T01:37:00Z",
        assessment: {
          id: assessmentId,
          assessedAt: "2026-07-29T01:36:00Z",
          revisionHash,
        },
      }),
    ]),
    { now },
  );
  match(futureFailures.join("\n"), /assessment is dated after the validation time/);
  match(futureFailures.join("\n"), /decision is dated after the validation time/);

  const orderingFailures = publishingDecisionFailures(
    post(),
    snapshot([
      decision({
        decidedAt: "2026-07-29T01:00:00Z",
        assessment: {
          id: assessmentId,
          assessedAt: "2026-07-29T01:15:00Z",
          revisionHash,
        },
      }),
    ]),
    { now },
  );
  match(orderingFailures.join("\n"), /decision predates its editorial assessment/);
});

test("accepts assessment and decision timestamps within the allowed clock skew", () => {
  deepEqual(
    publishingDecisionFailures(
      post(),
      snapshot(
        [
          decision({
            decidedAt: "2026-07-29T01:33:00Z",
            assessment: {
              id: assessmentId,
              assessedAt: "2026-07-29T01:32:00Z",
              revisionHash,
            },
          }),
        ],
        { exportedAt: "2026-07-29T01:34:00Z" },
      ),
      { now },
    ),
    [],
  );
});

test("rejects approval for a different content hash", () => {
  const differentHash = `sha256:${"0".repeat(64)}`;
  const failures = publishingDecisionFailures(
    post(),
    snapshot([
      decision({
        revisionHash: differentHash,
        perspective: {
          id: "55555555-5555-4555-8555-555555555555",
          slug: "example",
          status: "published",
          contentHash: differentHash,
        },
        assessment: {
          id: assessmentId,
          assessedAt: "2026-07-29T00:45:00Z",
          revisionHash: differentHash,
        },
      }),
    ]),
    { now },
  );
  match(failures.join("\n"), /content hash does not match/);
  match(failures.join("\n"), /does not authorize the current source revision/);
  match(failures.join("\n"), /assessment does not cover the current source revision/);
});

test("rejects a non-active or rejected decision", () => {
  const failures = publishingDecisionFailures(
    post(),
    snapshot([decision({ decisionStatus: "rejected", recordStatus: "superseded" })]),
    { now },
  );
  match(failures.join("\n"), /is rejected/);
  match(failures.join("\n"), /has non-active record status superseded/);
});

test("rejects a non-authorized decision-maker and unrelated assessment", () => {
  const failures = publishingDecisionFailures(
    post(),
    snapshot([
      decision({
        decidedBy: { id: personId, name: "Another Reviewer" },
        assessment: { id: "77777777-7777-4777-8777-777777777777" },
      }),
    ]),
    { now },
  );
  match(failures.join("\n"), /does not match editorial reviewer/);
  match(failures.join("\n"), /is not evidenced by editorial assessment/);
});

test("rejects published relations to preview perspectives", () => {
  deepEqual(
    publishedRelationFailures([
      { slug: "published", publicationState: "published", related: ["preview"] },
      { slug: "preview", publicationState: "preview", related: [] },
    ]),
    ["published: published perspective cannot relate to non-published perspective preview"],
  );
});
