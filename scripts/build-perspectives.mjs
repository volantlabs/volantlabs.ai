import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(siteRoot, "content", "perspectives");
const articleDir = path.join(siteRoot, "perspectives");
const assetsDir = path.join(siteRoot, "assets");
const llmsDir = path.join(siteRoot, "llms");
const llmsPerspectivesDir = path.join(llmsDir, "perspectives");
const defaultGraphAttributionPath = path.join(siteRoot, "content", "perspectives.graph-attribution.json");
const graphAttributionPath = process.env.PERSPECTIVES_ATTRIBUTION_PATH
  ? resolveSitePath(process.env.PERSPECTIVES_ATTRIBUTION_PATH)
  : defaultGraphAttributionPath;
const graphAttributionPathWasExplicit = Boolean(process.env.PERSPECTIVES_ATTRIBUTION_PATH);
const socialPreviewManifestPath = path.join(
  siteRoot,
  "assets",
  "images",
  "social",
  "manifest.json",
);
let socialPreviewByPage;
const checkOnly = process.argv.includes("--check");
const contentSourceName = process.env.PERSPECTIVES_SOURCE || "json";
let resolvedContentSourceName = contentSourceName;
const localContributorAvatarsByName = new Map([
  ["Andrew Forman", { src: "assets/images/contributors/andrew-forman.png", alt: "Andrew Forman" }],
  ["Eddie Austin", { src: "assets/images/contributors/eddie-austin.png", alt: "Eddie Austin" }],
  ["Matthew Lou-Magnuson", { src: "assets/images/contributors/matthew-lou-magnuson.png", alt: "Matthew Lou-Magnuson" }]
]);
const kindLabelsByKind = new Map([
  ["essays", "Essay"],
  ["notes", "Field note"],
  ["from_the_graph", "From the graph"],
  ["artifact", "Artifact"]
]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Human-authored kinds are the quiet default: no kind pill, the byline carries
// accountability. Pills are reserved for provenance that is actually news
// (From the graph, Artifact). Per the Provenance Display Model amendment
// (2026-07-07) to Spec 9c3d7e21.
const quietKinds = new Set(["essays", "notes"]);

function renderKindPill(post) {
  if (quietKinds.has(post.kind)) return "";
  return `<span class="lanepill ${escapeHtml(post.kind)}">${escapeHtml(post.kindLabel)}</span>`;
}

const manifest = {
  schemaVersion: "2026-07-06.perspectives.v4",
  siteUrl: "https://volantlabs.ai",
  sourceSpecs: [
    {
      id: "392e552b-5858-475e-a716-31d8f05bc5a6",
      name: "volantlabs.ai - Site Architecture"
    }
  ],
  filters: ["all", "essays", "notes"]
};
// Editorial rubric per graph Specification 7e5a2c91-4b3f-4d68-9a1c-e0f6b8d24a53
// ("volantlabs.ai — Perspectives Editorial Rubric") and DecisionRecord
// 3f8c1b6e-9a24-4e07-b5d1-6c2a8f4e9b70. Weights mirror the EditorialCriterion
// nodes in volant_base; keep the two in sync when re-versioning the rubric.
const editorialRubric = {
  rubricVersion: "2026-07-07.v1",
  specificationId: "7e5a2c91-4b3f-4d68-9a1c-e0f6b8d24a53",
  decisionRecordId: "3f8c1b6e-9a24-4e07-b5d1-6c2a8f4e9b70",
  publishThreshold: 0.7,
  ideaThreshold: 0.5,
  maxPoints: 3,
  stages: ["idea", "draft", "pre_publish", "post_publish_review"],
  criteria: {
    mission_alignment: { weight: 0.14, graphId: "3a1f5e70-2c4b-4d8e-9f1a-6b2c8d4e0a17" },
    vellis_relevance: { weight: 0.14, graphId: "4b2e6f81-3d5c-4e9f-8a2b-7c3d9e5f1b28" },
    audience_fit: { weight: 0.09, graphId: "5c3f7a92-4e6d-4f10-9b3c-8d4e0f6a2c39" },
    product_truthfulness: { weight: 0.18, graphId: "6d4a8b03-5f7e-4a21-8c4d-9e5f1a7b3d40" },
    evidence_provenance_quality: { weight: 0.18, graphId: "7e5b9c14-6a8f-4b32-9d5e-0f6a2b8c4e51" },
    specificity: { weight: 0.09, graphId: "8f6c0d25-7b9a-4c43-8e6f-1a7b3c9d5f62" },
    open_posture: { weight: 0.09, graphId: "9a7d1e36-8c0b-4d54-9f7a-2b8c4d0e6a73" },
    external_readability: { weight: 0.09, graphId: "0b8e2f47-9d1c-4e65-8a8b-3c9d5e1f7b84" }
  }
};

const defaultSocialImage = "assets/images/graph-theory-thesis.webp";
const defaultSocialImageAlt =
  "Radial graph theory diagram with one orange thesis node connecting memory, schema, and governance clusters.";
const summaryPages = [
  {
    title: "Home",
    path: "",
    summaryPath: "llms/pages/home.md",
    description: "Volant Labs publishes Vellis, an Apache-licensed typed graph engine for shared agent memory."
  },
  {
    title: "Vellis Engine",
    path: "engine.html",
    summaryPath: "llms/pages/engine.md",
    description: "The product overview and verified local quickstart for Vellis as an open-source graph engine, RTG knowledge system, and reusable component library."
  },
  {
    title: "Thesis",
    path: "thesis.html",
    summaryPath: "llms/pages/thesis.md",
    description: "The narrative point of view behind Vellis: graph memory, model reasoning, and human review."
  },
  {
    title: "Perspectives",
    path: "perspectives.html",
    summaryPath: "llms/pages/perspectives.md",
    description: "The library of essays and field notes behind Vellis."
  },
  {
    title: "Community",
    path: "community.html",
    summaryPath: "llms/pages/community.md",
    description: "The lightweight builder path for running Vellis, following releases, sharing examples, and asking questions."
  },
  {
    title: "Platform",
    path: "platform.html",
    summaryPath: "llms/pages/platform.md",
    description: "The Volant Partners path from open Vellis patterns to governed production operations."
  }
];
const sitemapPages = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "engine.html", changefreq: "monthly", priority: "0.9" },
  { path: "thesis.html", changefreq: "monthly", priority: "0.8" },
  { path: "perspectives.html", changefreq: "weekly", priority: "0.8" },
  { path: "community.html", changefreq: "monthly", priority: "0.6" },
  { path: "platform.html", changefreq: "monthly", priority: "0.5" }
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeXml(value = "") {
  return escapeHtml(value).replaceAll("'", "&apos;");
}

function resolveSitePath(value) {
  return path.isAbsolute(value) ? value : path.resolve(siteRoot, value);
}

function absoluteUrl(relativePath) {
  return `${manifest.siteUrl}/${relativePath}`;
}

function absoluteSocialImageUrl(preview) {
  return `${manifest.siteUrl}/${preview.image}`;
}

function normalizeSocialPage(page) {
  if (page === "/" || page === "") return "/";
  return page.startsWith("/") ? page : `/${page}`;
}

async function readSocialPreviewManifest() {
  const raw = JSON.parse(await readFile(socialPreviewManifestPath, "utf8"));
  if (!Array.isArray(raw) || !raw.length) {
    throw new Error("assets/images/social/manifest.json must contain preview records");
  }

  const byPage = new Map();
  for (const [index, preview] of raw.entries()) {
    const sourceRef = `assets/images/social/manifest.json[${index}]`;
    for (const field of [
      "page",
      "title",
      "description",
      "twitterTitle",
      "twitterDescription",
      "image",
      "width",
      "height",
      "alt",
    ]) {
      if (preview[field] === undefined || preview[field] === null || preview[field] === "") {
        throw new Error(`${sourceRef} missing required field ${field}`);
      }
    }
    if (!Number.isInteger(preview.width) || preview.width !== 1200) {
      throw new Error(`${sourceRef} width must be 1200`);
    }
    if (!Number.isInteger(preview.height) || preview.height !== 630) {
      throw new Error(`${sourceRef} height must be 630`);
    }
    if (!preview.image.startsWith("assets/images/social/") || !preview.image.endsWith(".png")) {
      throw new Error(`${sourceRef} image must be a PNG under assets/images/social/`);
    }
    const imagePath = path.resolve(siteRoot, preview.image);
    const relativeImagePath = path.relative(siteRoot, imagePath);
    if (relativeImagePath.startsWith("..") || path.isAbsolute(relativeImagePath)) {
      throw new Error(`${sourceRef} image must stay inside the site root`);
    }
    if (!existsSync(imagePath)) throw new Error(`${sourceRef} image does not exist: ${preview.image}`);
    const page = normalizeSocialPage(preview.page);
    if (byPage.has(page)) throw new Error(`duplicate social preview page ${page}`);
    byPage.set(page, { ...preview, page });
  }
  return byPage;
}

function socialPreviewFor(page) {
  const key = normalizeSocialPage(page);
  const preview = socialPreviewByPage.get(key);
  if (!preview) throw new Error(`missing social preview manifest record for ${key}`);
  return preview;
}

function markdownUrl(relativePath) {
  return `${manifest.siteUrl}/${relativePath}`;
}

function jsonScript(value) {
  return JSON.stringify(value, null, 2).replaceAll("<", "\\u003c");
}

function toRssDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 13, 0, 0));
  return date.toUTCString();
}

function toShortDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!year || !month || !day || !monthNames[month - 1]) throw new Error(`invalid date ${isoDate}`);
  return `${monthNames[month - 1]} ${day}`;
}

function requireValue(rawPost, field, sourceRef) {
  const value = rawPost[field];
  if (value === undefined || value === null || value === "") {
    throw new Error(`${sourceRef} missing required field ${field}`);
  }
  return value;
}

function requireString(rawPost, field, sourceRef) {
  const value = requireValue(rawPost, field, sourceRef);
  if (typeof value !== "string") throw new Error(`${sourceRef} field ${field} must be a string`);
  return value;
}

function requireStringArray(rawPost, field, sourceRef) {
  const value = requireValue(rawPost, field, sourceRef);
  if (!Array.isArray(value) || !value.length || value.some((item) => typeof item !== "string" || !item)) {
    throw new Error(`${sourceRef} field ${field} must be a non-empty string array`);
  }
  return value;
}

function normalizeOptionalStringArray(value, field, sourceRef) {
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${sourceRef} field ${field} must be an array`);
  const seen = new Set();
  const normalized = [];
  for (const [index, item] of value.entries()) {
    if (typeof item !== "string" || !item) throw new Error(`${sourceRef} field ${field}[${index}] must be a non-empty string`);
    if (!seen.has(item)) {
      seen.add(item);
      normalized.push(item);
    }
  }
  return normalized;
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function initialsFor(label, kind) {
  if (kind === "graph") return "KG";
  if (kind === "model" || kind === "system") return "AI";
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || label.slice(0, 2).toUpperCase();
}

function normalizeMadeWithKind(kind, sourceRef) {
  if (kind === "graph_context") return "graph";
  if (["person", "model", "system", "artifact", "graph"].includes(kind)) return kind;
  throw new Error(`${sourceRef} contribution kind must be person, model, graph_context, system, or artifact`);
}

function normalizeGraphSnapshot(raw, sourceRef) {
  if (raw === null || raw === undefined) return null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${sourceRef}.graphSnapshot must be an object`);
  const optionalString = (field) => {
    const value = raw[field] ?? null;
    if (value !== null && typeof value !== "string") throw new Error(`${sourceRef}.graphSnapshot.${field} must be a string`);
    return value;
  };
  const optionalInteger = (field) => {
    const value = raw[field] ?? null;
    if (value === null) return null;
    if (!Number.isInteger(value) || value < 0) throw new Error(`${sourceRef}.graphSnapshot.${field} must be a non-negative integer`);
    return value;
  };
  return {
    timestamp: optionalString("timestamp"),
    nodeCount: optionalInteger("nodeCount"),
    linkCount: optionalInteger("linkCount"),
    nodeTypeCount: optionalInteger("nodeTypeCount"),
    linkTypeCount: optionalInteger("linkTypeCount"),
    activeBundle: optionalString("activeBundle"),
    schemaTag: optionalString("schemaTag"),
    compiledHash: optionalString("compiledHash")
  };
}

function graphSummary(summary, snapshot) {
  if (snapshot && snapshot.nodeCount !== null && snapshot.linkCount !== null) {
    return `${formatCount(snapshot.nodeCount)} nodes / ${formatCount(snapshot.linkCount)} links`;
  }
  return summary;
}

function graphDetail(detail, snapshot) {
  if (!snapshot) return detail;
  const shape = [];
  if (snapshot.nodeCount !== null) shape.push(`${formatCount(snapshot.nodeCount)} nodes`);
  if (snapshot.linkCount !== null) shape.push(`${formatCount(snapshot.linkCount)} links`);
  if (snapshot.nodeTypeCount !== null) shape.push(`${formatCount(snapshot.nodeTypeCount)} node types`);
  if (snapshot.linkTypeCount !== null) shape.push(`${formatCount(snapshot.linkTypeCount)} link rules`);

  const context = [];
  if (snapshot.activeBundle) context.push(snapshot.activeBundle);
  if (snapshot.schemaTag) context.push(`schema tag ${snapshot.schemaTag}`);
  if (snapshot.timestamp) context.push(`captured ${snapshot.timestamp}`);

  return [
    detail,
    shape.length ? `Snapshot shape: ${shape.join(", ")}.` : "",
    context.length ? `Context: ${context.join("; ")}.` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function graphMetrics(snapshot) {
  if (!snapshot) return [];
  return [
    ["nodeCount", "nodes"],
    ["linkCount", "links"],
    ["nodeTypeCount", "node types"],
    ["linkTypeCount", "link rules"]
  ]
    .filter(([field]) => snapshot[field] !== null)
    .map(([field, label]) => ({ value: formatCount(snapshot[field]), label }));
}

function localAvatarFor(label) {
  const avatar = localContributorAvatarsByName.get(label) ?? null;
  if (!avatar) return null;
  return existsSync(path.resolve(siteRoot, avatar.src)) ? avatar : null;
}

function normalizeMadeWith(raw, sourceRef) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${sourceRef} madeWith must be an object`);
  if (typeof raw.label !== "string" || !raw.label) throw new Error(`${sourceRef} madeWith.label is required`);
  if (typeof raw.explanation !== "string" || !raw.explanation) throw new Error(`${sourceRef} madeWith.explanation is required`);
  if (!Array.isArray(raw.items) || !raw.items.length) throw new Error(`${sourceRef} madeWith.items must be a non-empty array`);

  const items = raw.items.map((item, index) => {
    const itemRef = `${sourceRef} madeWith.items[${index}]`;
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`${itemRef} must be an object`);
    for (const field of ["label", "role", "kind", "summary", "detail"]) {
      if (typeof item[field] !== "string" || !item[field]) throw new Error(`${itemRef}.${field} is required`);
    }
    if (!["person", "model", "graph", "system", "artifact"].includes(item.kind)) {
      throw new Error(`${itemRef}.kind must be person, model, graph, system, or artifact`);
    }

    let avatar = null;
    if (item.avatar !== null && item.avatar !== undefined) {
      if (!item.avatar || typeof item.avatar !== "object" || Array.isArray(item.avatar)) throw new Error(`${itemRef}.avatar must be an object`);
      if (typeof item.avatar.src !== "string" || !item.avatar.src) throw new Error(`${itemRef}.avatar.src is required`);
      if (typeof item.avatar.alt !== "string" || !item.avatar.alt) throw new Error(`${itemRef}.avatar.alt is required`);
      const avatarPath = path.resolve(siteRoot, item.avatar.src);
      const relativeAvatarPath = path.relative(siteRoot, avatarPath);
      if (relativeAvatarPath.startsWith("..") || path.isAbsolute(relativeAvatarPath)) {
        throw new Error(`${itemRef}.avatar.src must stay inside the site root`);
      }
      if (!existsSync(avatarPath)) throw new Error(`${itemRef}.avatar.src does not exist: ${item.avatar.src}`);
      avatar = { src: item.avatar.src, alt: item.avatar.alt };
    }

    const initials = item.initials ?? item.label.slice(0, 2).toUpperCase();
    if (typeof initials !== "string" || !initials) throw new Error(`${itemRef}.initials must be a string`);

    const metrics = item.metrics ?? [];
    if (!Array.isArray(metrics)) throw new Error(`${itemRef}.metrics must be an array`);
    const normalizedMetrics = metrics.map((metric, metricIndex) => {
      const metricRef = `${itemRef}.metrics[${metricIndex}]`;
      if (!metric || typeof metric !== "object" || Array.isArray(metric)) throw new Error(`${metricRef} must be an object`);
      if (typeof metric.value !== "string" || !metric.value) throw new Error(`${metricRef}.value is required`);
      if (typeof metric.label !== "string" || !metric.label) throw new Error(`${metricRef}.label is required`);
      return { value: metric.value, label: metric.label };
    });

    return {
      label: item.label,
      role: item.role,
      kind: item.kind,
      summary: item.summary,
      detail: item.detail,
      initials,
      avatar,
      metrics: normalizedMetrics
    };
  });

  return {
    label: raw.label,
    explanation: raw.explanation,
    items
  };
}

function normalizeGraphContribution(raw, sourceRef) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${sourceRef} must be an object`);
  const actorName = raw.actorName ?? raw.name ?? null;
  const actorKind = raw.actorKind ?? raw.contributionKind ?? null;
  const contributionKind = raw.contributionKind ?? actorKind;
  if (typeof contributionKind !== "string" || !contributionKind) throw new Error(`${sourceRef}.contributionKind is required`);
  const kind = normalizeMadeWithKind(contributionKind, sourceRef);
  const label = actorName || (kind === "graph" ? "Graph snapshot" : null);
  if (typeof label !== "string" || !label) throw new Error(`${sourceRef}.actorName is required`);

  for (const field of ["roleLabel", "summary", "detail"]) {
    if (typeof raw[field] !== "string" || !raw[field]) throw new Error(`${sourceRef}.${field} is required`);
  }

  const displayOrder = raw.displayOrder ?? 1000;
  if (!Number.isInteger(displayOrder)) throw new Error(`${sourceRef}.displayOrder must be an integer`);

  const snapshot = normalizeGraphSnapshot(raw.graphSnapshot ?? null, sourceRef);
  const summary = kind === "graph" ? graphSummary(raw.summary, snapshot) : raw.summary;
  const detail = kind === "graph" ? graphDetail(raw.detail, snapshot) : raw.detail;
  const avatar = kind === "person" ? localAvatarFor(label) : null;

  return {
    displayOrder,
    label,
    role: raw.roleLabel,
    kind,
    summary,
    detail,
    initials: initialsFor(label, kind),
    avatar,
    metrics: kind === "graph" ? graphMetrics(snapshot) : []
  };
}

function normalizeGraphAttributionRecord(raw, sourceRef) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${sourceRef} must be an object`);
  if (typeof raw.slug !== "string" || !raw.slug) throw new Error(`${sourceRef}.slug is required`);
  const subjectMatter = normalizeOptionalStringArray(raw.subjectMatter ?? [], "subjectMatter", sourceRef);
  const contributions = raw.contributions ?? [];
  if (!Array.isArray(contributions)) throw new Error(`${sourceRef}.contributions must be an array`);
  const items = contributions
    .map((contribution, index) => normalizeGraphContribution(contribution, `${sourceRef}.contributions[${index}]`))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(({ displayOrder, ...item }) => item);

  return {
    slug: raw.slug,
    subjectMatter,
    madeWith: items.length
      ? normalizeMadeWith(
          {
            label: "Made with",
            explanation:
              "Made with separates accountability from assistance. The human author owns the argument and final judgment; models and graph context are named when they materially shaped the published piece.",
            items
          },
          sourceRef
        )
      : null
  };
}

function normalizeGraphAttributionExport(raw, sourceRef) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${sourceRef} must be an object`);
  if (typeof raw.schemaVersion !== "string" || !raw.schemaVersion) throw new Error(`${sourceRef}.schemaVersion is required`);
  if (!Array.isArray(raw.perspectives)) throw new Error(`${sourceRef}.perspectives must be an array`);

  const recordsBySlug = new Map();
  for (const [index, record] of raw.perspectives.entries()) {
    const normalized = normalizeGraphAttributionRecord(record, `${sourceRef}.perspectives[${index}]`);
    if (recordsBySlug.has(normalized.slug)) throw new Error(`${sourceRef} has duplicate slug ${normalized.slug}`);
    recordsBySlug.set(normalized.slug, normalized);
  }
  return recordsBySlug;
}

async function readGraphAttributionExport() {
  if (!existsSync(graphAttributionPath)) {
    if (graphAttributionPathWasExplicit) throw new Error(`Perspectives attribution export not found: ${graphAttributionPath}`);
    return null;
  }
  const sourceRef = path.relative(siteRoot, graphAttributionPath) || graphAttributionPath;
  const raw = JSON.parse(await readFile(graphAttributionPath, "utf8"));
  return normalizeGraphAttributionExport(raw, sourceRef);
}

function applyGraphAttribution(post, attribution) {
  if (!attribution) return post;
  return {
    ...post,
    subjectMatter: attribution.subjectMatter,
    ...(attribution.madeWith ? { madeWith: attribution.madeWith } : {})
  };
}

function normalizeEditorialCheck(raw, sourceRef) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${sourceRef} editorialCheck must be an object`);
  if (typeof raw.rubricVersion !== "string" || !raw.rubricVersion) {
    throw new Error(`${sourceRef} editorialCheck.rubricVersion is required`);
  }
  if (!editorialRubric.stages.includes(raw.stage)) {
    throw new Error(`${sourceRef} editorialCheck.stage must be one of ${editorialRubric.stages.join(", ")}`);
  }
  if (typeof raw.reviewer !== "string" || !raw.reviewer) throw new Error(`${sourceRef} editorialCheck.reviewer is required`);
  if (typeof raw.reviewedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw.reviewedAt)) {
    throw new Error(`${sourceRef} editorialCheck.reviewedAt must be YYYY-MM-DD`);
  }
  const scores = raw.scores;
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) {
    throw new Error(`${sourceRef} editorialCheck.scores must be an object`);
  }
  const expectedKeys = Object.keys(editorialRubric.criteria);
  for (const key of expectedKeys) {
    const score = scores[key];
    if (!Number.isInteger(score) || score < 0 || score > editorialRubric.maxPoints) {
      throw new Error(`${sourceRef} editorialCheck.scores.${key} must be an integer 0-${editorialRubric.maxPoints}`);
    }
  }
  for (const key of Object.keys(scores)) {
    if (!expectedKeys.includes(key)) throw new Error(`${sourceRef} editorialCheck.scores has unknown criterion ${key}`);
  }
  const notes = raw.notes ?? null;
  if (notes !== null && typeof notes !== "string") throw new Error(`${sourceRef} editorialCheck.notes must be a string`);
  const graphAssessmentId = raw.graphAssessmentId ?? null;
  if (graphAssessmentId !== null && typeof graphAssessmentId !== "string") {
    throw new Error(`${sourceRef} editorialCheck.graphAssessmentId must be a string`);
  }
  const publishingDecisionId = raw.publishingDecisionId ?? null;
  if (publishingDecisionId !== null && typeof publishingDecisionId !== "string") {
    throw new Error(`${sourceRef} editorialCheck.publishingDecisionId must be a string`);
  }
  if (publishingDecisionId !== null && !uuidPattern.test(publishingDecisionId)) {
    throw new Error(`${sourceRef} editorialCheck.publishingDecisionId must be a UUID`);
  }
  return {
    rubricVersion: raw.rubricVersion,
    stage: raw.stage,
    reviewer: raw.reviewer,
    reviewedAt: raw.reviewedAt,
    scores: Object.fromEntries(expectedKeys.map((key) => [key, scores[key]])),
    notes,
    graphAssessmentId,
    publishingDecisionId
  };
}

function normalizePerspectivePost(rawPost, sourceRef) {
  const requiredPostFields = new Set([
    "slug",
    "url",
    "kind",
    "kindLabel",
    "title",
    "shortTitle",
    "dek",
    "published",
    "displayDate",
    "readingTime",
    "provenanceLine",
    "statusLabel",
    "tags",
    "body",
    "provenance",
    "related"
  ]);
  for (const field of requiredPostFields) requireValue(rawPost, field, sourceRef);

  const body = rawPost.body;
  if (!Array.isArray(body) || !body.length) throw new Error(`${sourceRef} requires body sections`);
  const normalizedBody = body.map((section, index) => {
    if (!section || typeof section !== "object") throw new Error(`${sourceRef} body section ${index + 1} must be an object`);
    if (typeof section.heading !== "string" || !section.heading) {
      throw new Error(`${sourceRef} body section ${index + 1} requires heading`);
    }
    if (
      !Array.isArray(section.paragraphs) ||
      !section.paragraphs.length ||
      section.paragraphs.some((paragraph) => typeof paragraph !== "string" || !paragraph)
    ) {
      throw new Error(`${sourceRef} body section ${section.heading} requires paragraphs`);
    }
    return {
      heading: section.heading,
      paragraphs: [...section.paragraphs]
    };
  });

  const provenance = rawPost.provenance;
  if (!provenance || typeof provenance !== "object") throw new Error(`${sourceRef} requires provenance`);
  const requiredProvenanceFields = [
    "source",
    "reasoningLayer",
    "humanRatifier",
    "status",
    "knownUncertainty",
    "dissent",
    "nextFalsifier"
  ];
  const normalizedProvenance = {};
  for (const field of requiredProvenanceFields) {
    if (typeof provenance[field] !== "string" || !provenance[field]) {
      throw new Error(`${sourceRef} provenance missing ${field}`);
    }
    normalizedProvenance[field] = provenance[field];
  }
  const author = rawPost.author ?? null;
  if (author !== null && typeof author !== "string") {
    throw new Error(`${sourceRef} author must be a string or null`);
  }
  const image = rawPost.image ?? null;
  if (image !== null) {
    if (!image || typeof image !== "object") throw new Error(`${sourceRef} image must be an object`);
    if (typeof image.src !== "string" || !image.src) throw new Error(`${sourceRef} image.src is required`);
    if (typeof image.alt !== "string" || !image.alt) throw new Error(`${sourceRef} image.alt is required`);
    if (!Number.isInteger(image.width) || image.width < 1) throw new Error(`${sourceRef} image.width must be a positive integer`);
    if (!Number.isInteger(image.height) || image.height < 1) throw new Error(`${sourceRef} image.height must be a positive integer`);
    const imagePath = path.resolve(siteRoot, image.src);
    const relativeImagePath = path.relative(siteRoot, imagePath);
    if (relativeImagePath.startsWith("..") || path.isAbsolute(relativeImagePath)) {
      throw new Error(`${sourceRef} image.src must stay inside the site root`);
    }
    if (!existsSync(imagePath)) throw new Error(`${sourceRef} image.src does not exist: ${image.src}`);
  }
  return {
    slug: requireString(rawPost, "slug", sourceRef),
    url: requireString(rawPost, "url", sourceRef),
    kind: requireString(rawPost, "kind", sourceRef),
    kindLabel: requireString(rawPost, "kindLabel", sourceRef),
    title: requireString(rawPost, "title", sourceRef),
    shortTitle: requireString(rawPost, "shortTitle", sourceRef),
    dek: requireString(rawPost, "dek", sourceRef),
    published: requireString(rawPost, "published", sourceRef),
    displayDate: requireString(rawPost, "displayDate", sourceRef),
    readingTime: requireString(rawPost, "readingTime", sourceRef),
    image,
    author,
    subjectMatter: [],
    provenanceLine: requireString(rawPost, "provenanceLine", sourceRef),
    statusLabel: requireString(rawPost, "statusLabel", sourceRef),
    tags: requireStringArray(rawPost, "tags", sourceRef),
    body: normalizedBody,
    provenance: normalizedProvenance,
    related: requireStringArray(rawPost, "related", sourceRef),
    editorialCheck: normalizeEditorialCheck(rawPost.editorialCheck ?? null, sourceRef)
  };
}

class JsonFilePerspectiveSource {
  constructor(directory) {
    this.name = "json";
    this.directory = directory;
  }

  async loadPosts() {
    const files = (await readdir(this.directory))
      .filter((file) => file.endsWith(".json") && file !== "schema.json")
      .sort();
    const posts = await Promise.all(
      files.map(async (file) => {
        const sourceRef = `content/perspectives/${file}`;
        const rawPost = JSON.parse(await readFile(path.join(this.directory, file), "utf8"));
        return normalizePerspectivePost(rawPost, sourceRef);
      })
    );
    const graphAttribution = await readGraphAttributionExport();
    if (!graphAttribution) return posts;
    this.name = "json+graph-attribution";
    return posts.map((post) => applyGraphAttribution(post, graphAttribution.get(post.slug)));
  }
}

function createPerspectiveSource(name) {
  if (name === "json") return new JsonFilePerspectiveSource(sourceDir);
  throw new Error(`unsupported Perspectives content source ${name}; add an adapter that returns normalized Perspective posts`);
}

async function readPosts() {
  const source = createPerspectiveSource(contentSourceName);
  const posts = await source.loadPosts();
  resolvedContentSourceName = source.name;
  posts.sort((a, b) => b.published.localeCompare(a.published));
  validatePosts(posts, source.name);
  return posts;
}

function validatePosts(posts, sourceName) {
  const slugs = new Set();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`duplicate perspective slug ${post.slug}`);
    slugs.add(post.slug);
    if (post.url !== `perspectives/${post.slug}.html`) {
      throw new Error(`${post.slug} url must be perspectives/${post.slug}.html`);
    }
    const expectedKindLabel = kindLabelsByKind.get(post.kind);
    if (!expectedKindLabel) {
      throw new Error(`${post.slug} has unsupported kind ${post.kind}`);
    }
    if (post.kindLabel !== expectedKindLabel) {
      throw new Error(`${post.slug} kind ${post.kind} must use label ${expectedKindLabel}`);
    }
  }

  for (const post of posts) {
    for (const related of post.related) {
      if (!slugs.has(related)) throw new Error(`${post.slug} related post ${related} not found in ${sourceName} source`);
    }
  }
}

function evaluateEditorialCheck(post) {
  const check = post.editorialCheck;
  if (!check) return { slug: post.slug, editorial: null };
  const blockers = [];
  if (check.scores.mission_alignment === 0) blockers.push("mission_alignment scored 0");
  if (check.scores.product_truthfulness < 2) blockers.push("product_truthfulness below 2");
  const graphDrafted = post.kind === "from_the_graph";
  if (graphDrafted && check.scores.evidence_provenance_quality === 0) {
    blockers.push("evidence_provenance_quality scored 0 on a graph-drafted piece");
  }
  let weightedPoints = 0;
  let weightedMax = 0;
  for (const [key, criterion] of Object.entries(editorialRubric.criteria)) {
    weightedPoints += criterion.weight * check.scores[key];
    weightedMax += criterion.weight * editorialRubric.maxPoints;
  }
  const composite = Number((weightedPoints / weightedMax).toFixed(4));
  const passed = blockers.length === 0 && composite >= editorialRubric.publishThreshold;
  return {
    slug: post.slug,
    editorial: {
      rubricVersion: check.rubricVersion,
      stage: check.stage,
      reviewedAt: check.reviewedAt,
      composite,
      blockers,
      passed,
      publishingDecisionId: check.publishingDecisionId
    }
  };
}

function evaluateEditorial(posts) {
  const errors = [];
  const warnings = [];
  const report = [];
  for (const post of posts) {
    const result = evaluateEditorialCheck(post);
    report.push(result);
    if (!result.editorial) {
      warnings.push(`${post.slug}: no editorialCheck (soft-enforcement transition; add rubric ${editorialRubric.rubricVersion} scores)`);
      continue;
    }
    const check = post.editorialCheck;
    if (check.rubricVersion !== editorialRubric.rubricVersion) {
      errors.push(`${post.slug}: editorialCheck.rubricVersion ${check.rubricVersion} does not match current rubric ${editorialRubric.rubricVersion}; re-assess`);
      continue;
    }
    const { composite, blockers } = result.editorial;
    if (check.stage === "pre_publish" || check.stage === "post_publish_review") {
      for (const blocker of blockers) errors.push(`${post.slug}: hard blocker — ${blocker}`);
      if (composite < editorialRubric.publishThreshold) {
        errors.push(`${post.slug}: composite ${composite} below publish threshold ${editorialRubric.publishThreshold}`);
      }
      if (!check.publishingDecisionId) {
        warnings.push(`${post.slug}: no publishingDecisionId (soft policy; required for publish once the gate promotes to hard)`);
      }
    } else if (composite < editorialRubric.ideaThreshold) {
      warnings.push(`${post.slug}: ${check.stage}-stage composite ${composite} below advisory threshold ${editorialRubric.ideaThreshold}`);
    }
  }
  for (const warning of warnings) console.warn(`editorial: ${warning}`);
  if (errors.length) {
    throw new Error(`editorial checkdown failed:\n  - ${errors.join("\n  - ")}`);
  }
  return report;
}

function renderExportManifest(posts, editorialReport) {
  const contentHash = createHash("sha256")
    .update(JSON.stringify(posts.map((post) => ({ ...post, editorialCheck: post.editorialCheck ?? null }))))
    .digest("hex");
  const payload = {
    schemaVersion: "2026-07-07.export-manifest.v1",
    source: "graph",
    sourcePath: "client_packs/volant/published_apps/volantlabs.ai",
    siteUrl: manifest.siteUrl,
    generator: "scripts/build-perspectives.mjs",
    generatorSchemaVersion: manifest.schemaVersion,
    sourceCommit: process.env.EXPORT_SOURCE_COMMIT ?? null,
    contentHash: `sha256:${contentHash}`,
    sourceSpecs: [
      ...manifest.sourceSpecs,
      { id: editorialRubric.specificationId, name: "volantlabs.ai - Perspectives Editorial Rubric" }
    ],
    editorial: {
      rubricVersion: editorialRubric.rubricVersion,
      publishThreshold: editorialRubric.publishThreshold,
      posts: editorialReport
    },
    counts: { posts: posts.length }
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function renderLogo({ footer = false } = {}) {
  const filename = "volant-labs-flask-mark.svg";
  const className = footer ? "footer-logo" : "labs-logo";
  return `<img class="${className}" src="../assets/logos/${filename}" alt="Volant Labs" width="50" height="50">`;
}

function renderHeader() {
  return `<header>
  <div class="wrap">
    <nav>
      <a class="brand" href="../index.html" aria-label="Volant Labs home">
        ${renderLogo()}
        Volant Labs
      </a>
      <div class="navlinks">
        <a href="../engine.html">Engine</a><a href="../thesis.html">Thesis</a><a href="../perspectives.html" class="active" aria-current="page">Perspectives</a><a href="../community.html">Community</a>
      </div>
      <div class="navright">
        <a class="btn btn-ghost btn-sm" href="https://www.volantpartners.com/contact" aria-label="Contact Volant Partners — opens volantpartners.com">Contact</a>
        <a class="btn btn-quiet" href="../platform.html">Platform</a>
      </div>
    </nav>
  </div>
</header>`;
}

function renderFooter() {
  return `<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="footer-brand-grid">
        <div class="footer-brand">
          <div class="brand" style="font-size:20px">${renderLogo({ footer: true })}Volant Labs</div>
          <p>Open tools and research for graph-native AI work.</p>
        </div>
        <div class="footer-brand">
          <div class="brand" style="font-size:20px"><img class="footer-logo" src="../assets/logos/volant-partners-bug-orange.png" alt="Volant Partners" width="50" height="50" loading="lazy" decoding="async"><a class="volant-partners-link" href="https://www.volantpartners.com/" target="_blank" rel="noopener noreferrer">Volant Partners</a></div>
          <p><a class="volant-partners-link" href="https://www.volantpartners.com/" target="_blank" rel="noopener noreferrer">Volant Partners</a> helps teams turn complex technical work into reliable products, operations, and decisions.</p>
        </div>
      </div>
      <div class="foot-cols">
        <div class="foot-col"><h5>Project</h5><a href="../engine.html">Engine</a><a href="../thesis.html">Thesis</a><a href="../perspectives.html">Perspectives</a><a href="../community.html">Community</a></div>
        <div class="foot-col"><h5>Open</h5><a href="../engine.html#quickstart">Quickstart</a><a href="../thesis.html">Open by Design</a><a href="../engine.html">Engine overview</a><a href="../platform.html">Path to Production</a></div>
        <div class="foot-col"><h5>Stay close</h5><a href="../feed.xml">RSS feed</a><a href="../perspectives.html#subscribe">Subscribe</a><a href="https://www.volantpartners.com/contact" aria-label="Contact Volant Partners — opens volantpartners.com">Contact</a><a href="../platform.html">Platform</a></div>
      </div>
    </div>
    <div class="foot-bottom"><span>&copy; 2026 <a class="volant-partners-link" href="https://www.volantpartners.com/" target="_blank" rel="noopener noreferrer">Volant Partners</a></span><span class="nrp">No rug-pull: Vellis stays runnable.</span></div>
  </div>
</footer>`;
}

function renderGa4Tracking() {
  return `<script>
(function () {
  var productionHosts = new Set(["volantlabs.ai", "www.volantlabs.ai"]);
  if (!productionHosts.has(window.location.hostname)) return;

  var gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VNXWVPERBQ";
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){window.dataLayer.push(arguments);}
  window.gtag('js', new Date());
  window.gtag('config', 'G-VNXWVPERBQ');
})();
</script>`;
}

function madeWithJsonLdType(kind) {
  if (kind === "person") return "Person";
  if (kind === "model" || kind === "system") return "SoftwareApplication";
  if (kind === "graph") return "Dataset";
  return "CreativeWork";
}

function renderMadeWith(post) {
  if (!post.madeWith) return "";
  const baseId = `madewith-${post.slug}`;
  const items = post.madeWith.items
    .map((item, index) => {
      const tooltipId = `${baseId}-item-${index}`;
      const avatar = item.avatar
        ? `<img src="../${escapeHtml(item.avatar.src)}" alt="${escapeHtml(item.avatar.alt)}" width="40" height="40" loading="eager" decoding="async">`
        : `<span>${escapeHtml(item.initials)}</span>`;
      const metrics = item.metrics.length
        ? `<div class="madewith-metrics">
              ${item.metrics.map((metric) => `<span><strong>${escapeHtml(metric.value)}</strong>${escapeHtml(metric.label)}</span>`).join("")}
            </div>`
        : "";
      const metricsBlock = metrics ? `\n              ${metrics}` : "";
      return `<div class="madewith-chip madewith-${escapeHtml(item.kind)}" role="listitem" tabindex="0" aria-describedby="${escapeHtml(tooltipId)}">
            <span class="madewith-avatar">${avatar}</span>
            <span class="madewith-copy">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(item.summary)}</span>
            </span>
            <span class="madewith-tooltip" id="${escapeHtml(tooltipId)}" role="tooltip">
              <strong>${escapeHtml(item.role)}</strong>
              ${escapeHtml(item.detail)}${metricsBlock}
            </span>
          </div>`;
    })
    .join("\n          ");

  return `<section class="madewith" aria-label="${escapeHtml(post.madeWith.label)}">
          <div class="madewith-head">
            <span>${escapeHtml(post.madeWith.label)}</span>
            <span class="madewith-help">
              <button type="button" aria-describedby="${escapeHtml(baseId)}-help">?</button>
              <span class="madewith-tooltip" id="${escapeHtml(baseId)}-help" role="tooltip">${escapeHtml(post.madeWith.explanation)}</span>
            </span>
          </div>
          <div class="madewith-list" role="list">
          ${items}
          </div>
        </section>`;
}

function displaySubjectMatter(post) {
  return post.subjectMatter?.length ? post.subjectMatter : post.tags;
}

function renderArticle(post, posts) {
  const relatedCards = post.related
    .map((slug) => posts.find((candidate) => candidate.slug === slug))
    .filter(Boolean)
    .map((item) => `<a class="related-card" href="../${escapeHtml(item.url)}">
          ${renderKindPill(item)}<h3>${escapeHtml(item.shortTitle)}</h3>
          <p>${escapeHtml(item.dek)}</p>
          <span class="read">Read next -&gt;</span>
        </a>`)
    .join("\n        ");

  const body = post.body
    .map((section) => `<h2>${escapeHtml(section.heading)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ")}`)
    .join("\n        ");

  const editorialRows = [
    ["Source", post.provenance.source],
    ["Editorial layer", post.provenance.reasoningLayer],
    ["Owner", post.provenance.humanRatifier],
    ["Status", post.provenance.status],
    ["Open question", post.provenance.knownUncertainty],
    ["Counterpoint", post.provenance.dissent],
    ["What would change this", post.provenance.nextFalsifier]
  ]
    .map(([term, definition]) => `<dt>${escapeHtml(term)}</dt>
          <dd>${escapeHtml(definition)}</dd>`)
    .join("\n          ");

  const subjectMatter = displaySubjectMatter(post)
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join('<span class="subject-sep">/</span>');
  const madeWith = renderMadeWith(post);
  const madeWithFallback = madeWith
    ? madeWith
    : `<div class="summary-section summary-made-simple">
          <span class="summary-label">Made with</span>
          <p>${escapeHtml(post.provenanceLine)}</p>
        </div>`;
  const canonical = absoluteUrl(post.url);
  const socialPreview = socialPreviewFor(post.url);
  const socialImage = absoluteSocialImageUrl(socialPreview);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: socialPreview.description,
    datePublished: post.published,
    mainEntityOfPage: canonical,
    image: socialImage,
    inLanguage: "en",
    author: post.author
      ? {
          "@type": "Person",
          name: post.author
        }
      : {
          "@type": "Organization",
          name: "Volant Labs",
          url: manifest.siteUrl
        },
    publisher: {
      "@type": "Organization",
      name: "Volant Labs",
      url: manifest.siteUrl
    }
  };
  if (post.madeWith) {
    articleJsonLd.contributor = post.madeWith.items.map((item) => ({
      "@type": madeWithJsonLdType(item.kind),
      name: item.label,
      description: `${item.role}: ${item.detail}`
    }));
  }
  const articleVisual = post.image
    ? `<figure class="article-visual">
        <img src="../${escapeHtml(post.image.src)}" alt="${escapeHtml(post.image.alt)}" width="${escapeHtml(post.image.width)}" height="${escapeHtml(post.image.height)}" loading="eager" decoding="async">
      </figure>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${escapeHtml(post.dek)}">
<meta property="og:site_name" content="Volant Labs">
<meta property="og:title" content="${escapeHtml(socialPreview.title)}">
<meta property="og:description" content="${escapeHtml(socialPreview.description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(socialImage)}">
<meta property="og:image:width" content="${escapeHtml(socialPreview.width)}">
<meta property="og:image:height" content="${escapeHtml(socialPreview.height)}">
<meta property="og:image:alt" content="${escapeHtml(socialPreview.alt)}">
<meta property="article:published_time" content="${escapeHtml(post.published)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(socialPreview.twitterTitle)}">
<meta name="twitter:description" content="${escapeHtml(socialPreview.twitterDescription)}">
<meta name="twitter:image" content="${escapeHtml(socialImage)}">
<meta name="twitter:image:alt" content="${escapeHtml(socialPreview.alt)}">
<meta name="theme-color" content="#041026">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="alternate" type="application/rss+xml" title="volantlabs.ai Perspectives" href="../feed.xml">
<link rel="alternate" type="application/json" title="Perspectives index" href="../perspectives/index.json">
<link rel="alternate" type="text/markdown" title="LLM summary" href="../llms/perspectives/${escapeHtml(post.slug)}.md">
<title>${escapeHtml(post.title)} - Perspectives - volantlabs.ai</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/site.css">
<link rel="stylesheet" href="../assets/perspective-article.css">
<script type="application/ld+json">
${jsonScript(articleJsonLd)}
</script>
${renderGa4Tracking()}
</head>
<body data-perspective-slug="${escapeHtml(post.slug)}">
<a class="skip" href="#main">Skip to content</a>
${renderHeader()}
<main id="main">
  <section class="article-hero">
    <div class="wrap article-hero-grid">
      <div>
        <a class="backlink" href="../perspectives.html">Back to Perspectives</a>
        ${renderKindPill(post)}
        <h1>${escapeHtml(post.title)}</h1>
        <p class="dek">${escapeHtml(post.dek)}</p>
        <div class="article-meta">
          <span>${escapeHtml(post.displayDate)}</span>
          <span>${escapeHtml(post.readingTime)}</span>
          <span>${escapeHtml(post.provenanceLine)}</span>
        </div>
      </div>
      <aside class="article-summary" aria-label="Perspective details">
        <div class="summary-section">
          <span class="summary-label">Subject matter</span>
          <p class="subject-line">${subjectMatter}</p>
        </div>
        ${madeWithFallback}
      </aside>
      ${articleVisual}
    </div>
  </section>
  <section class="article-main wrap">
    <article class="article-body">
        ${body}
    </article>
    <section class="provenance-panel" aria-labelledby="provenance-title">
      <div class="provenance-head">
        <p class="article-kicker">Editorial context</p>
        <h2 id="provenance-title">How this piece should be read</h2>
      </div>
      <dl>
          ${editorialRows}
      </dl>
    </section>
    <section class="related-block">
      <div class="related-head">
        <p class="article-kicker">Keep reading</p>
        <h2>Related perspectives</h2>
      </div>
      <div class="related-grid">
        ${relatedCards}
      </div>
    </section>
  </section>
  <section class="band article-subscribe">
    <div class="wrap subscribe-panel">
      <div>
        <h2>Stay close to the thinking</h2>
        <p>New essays and field notes as they land.</p>
      </div>
      <div class="article-actions">
        <a class="btn btn-primary" href="mailto:labs@volantpartners.com?subject=Subscribe%20to%20volantlabs.ai%20Perspectives">Request updates</a>
        <a class="btn btn-ghost" href="../feed.xml">RSS feed</a>
      </div>
    </div>
  </section>
</main>
${renderFooter()}
</body>
</html>
`;
}

function renderDataBundle(posts) {
  return `window.PERSPECTIVE_POSTS = ${JSON.stringify(posts, null, 2)};\n\nwindow.PERSPECTIVE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;
}

function renderPerspectiveIndexJson(posts) {
  const payload = {
    schemaVersion: "2026-06-27.perspectives.index.v1",
    siteUrl: manifest.siteUrl,
    generatedFrom: resolvedContentSourceName,
    collection: {
      title: "volantlabs.ai Perspectives",
      url: absoluteUrl("perspectives.html"),
      feedUrl: absoluteUrl("feed.xml"),
      description: "Essays and field notes behind Vellis."
    },
    posts: posts.map((post) => ({
      slug: post.slug,
      url: absoluteUrl(post.url),
      htmlPath: post.url,
      markdownSummaryPath: `llms/perspectives/${post.slug}.md`,
      markdownSummaryUrl: absoluteUrl(`llms/perspectives/${post.slug}.md`),
      kind: post.kind,
      kindLabel: post.kindLabel,
      title: post.title,
      shortTitle: post.shortTitle,
      dek: post.dek,
      published: post.published,
      displayDate: post.displayDate,
      readingTime: post.readingTime,
      author: post.author,
      subjectMatter: post.subjectMatter,
      ...(post.madeWith ? { madeWith: post.madeWith } : {}),
      provenanceLine: post.provenanceLine,
      statusLabel: post.statusLabel,
      tags: post.tags,
      related: post.related.map((slug) => ({
        slug,
        url: absoluteUrl(`perspectives/${slug}.html`),
        markdownSummaryUrl: absoluteUrl(`llms/perspectives/${slug}.md`)
      }))
    }))
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}

function renderPerspectiveCount(posts) {
  const label = posts.length === 1 ? "published perspective" : "published perspectives";
  return `        <span class="lane">${posts.length} ${label}</span>`;
}

function renderPerspectiveIndexFeed(posts) {
  return posts
    .map((post) => {
      const thumbnail = post.image
        ? `<span class="post-thumb" aria-hidden="true">
              <img src="${escapeHtml(post.image.src)}" alt="" width="${escapeHtml(post.image.width)}" height="${escapeHtml(post.image.height)}" loading="lazy" decoding="async">
            </span>`
        : "";
      return `        <a class="post" id="${escapeHtml(post.slug)}" data-lane="${escapeHtml(post.kind)}" href="${escapeHtml(post.url)}" aria-label="Open perspective: ${escapeHtml(post.title)}">
          <div class="post-media">${thumbnail}${renderKindPill(post)}</div>
          <div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.dek)}</p>
            <div class="meta">
              <span>${escapeHtml(post.displayDate)}</span>
              <span class="prov">${escapeHtml(post.provenanceLine)}</span>
            </div>
          </div>
          <span class="read">Open note <span class="arr">-&gt;</span></span>
        </a>`;
    })
    .join("\n\n");
}

function renderHomeLatestRows(posts) {
  return posts
    .slice(0, 3)
    .map((post) => `      <a class="row" href="${escapeHtml(post.url)}">
        <span class="pill">${escapeHtml(toShortDate(post.published))} · <span class="lane">${escapeHtml(post.tags[0])}</span></span>
        <span class="ftitle">${escapeHtml(post.title)}</span>
        <span class="read">Read -&gt;</span>
      </a>`)
    .join("\n");
}

function renderFeed(posts) {
  const items = posts
    .map((post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(absoluteUrl(post.url))}</link>
      <guid isPermaLink="true">${escapeXml(absoluteUrl(post.url))}</guid>
      <pubDate>${escapeXml(toRssDate(post.published))}</pubDate>
      <description>${escapeXml(post.dek)}</description>
    </item>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>volantlabs.ai Perspectives</title>
    <link>${manifest.siteUrl}/perspectives.html</link>
    <atom:link href="${manifest.siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Essays and field notes behind Vellis.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
}

function renderSitemap(posts) {
  const urls = [
    ...sitemapPages,
    ...posts.map((post) => ({
      path: post.url,
      changefreq: "monthly",
      priority: "0.7"
    }))
  ];

  const entries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(absoluteUrl(url.path))}</loc>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function renderPerspectiveMarkdownSummary(post, posts) {
  const related = post.related
    .map((slug) => posts.find((candidate) => candidate.slug === slug))
    .filter(Boolean)
    .map((item) => `- [${item.title}](${markdownUrl(item.url)})`)
    .join("\n");
  const sectionList = post.body.map((section) => `- ${section.heading}`).join("\n");
  const subjectMatter = post.subjectMatter?.length ? post.subjectMatter.join(", ") : "Not yet classified in the graph";
  const madeWithSection = post.madeWith
    ? `## Made With

${post.madeWith.items
        .map((item) => {
          const metrics = item.metrics.length
            ? ` (${item.metrics.map((metric) => `${metric.value} ${metric.label}`).join("; ")})`
            : "";
          return `- ${item.label}: ${item.role}; ${item.detail}${metrics}`;
        })
        .join("\n")}

`
    : "";
  const editorialRows = [
    ["Source", post.provenance.source],
    ["Editorial layer", post.provenance.reasoningLayer],
    ["Owner", post.provenance.humanRatifier],
    ["Status", post.provenance.status],
    ["Open question", post.provenance.knownUncertainty],
    ["Counterpoint", post.provenance.dissent],
    ["What would change this", post.provenance.nextFalsifier]
  ]
    .map(([label, value]) => `- ${label}: ${value}`)
    .join("\n");

  return `# ${post.title}

Canonical URL: ${markdownUrl(post.url)}
HTML path: /${post.url}
Collection: Perspectives
Kind: ${post.kindLabel}
Status: ${post.statusLabel}
Published: ${post.published}
Reading time: ${post.readingTime}
Author: ${post.author || "Volant Labs"}
Tags: ${post.tags.join(", ")}
Subject matter: ${subjectMatter}

${madeWithSection}## Summary

${post.dek}

## What This Page Is For

This page is part of the Volant Labs Perspectives library. It should be used as context for Vellis, graph-native AI infrastructure, provenance, governance, and operational adoption.

## Main Sections

${sectionList}

## Editorial Context

${editorialRows}

## Related Pages

${related || "- None listed"}
`;
}

function renderLlmsTxt(posts) {
  const pageLinks = summaryPages
    .map((page) => `- [${page.title}](${markdownUrl(page.summaryPath)}): ${page.description}`)
    .join("\n");
  const perspectiveLinks = posts
    .map((post) => `- [${post.title}](${markdownUrl(`llms/perspectives/${post.slug}.md`)}): ${post.dek}`)
    .join("\n");

  return `# Volant Labs

> Volant Labs publishes Vellis, an Apache-licensed typed graph engine for shared agent memory, schema-enforced writes, MCP-capable tooling, and portable, recoverable state.

Use these Markdown summaries for fast retrieval and routing. Use the canonical HTML pages for the public presentation, visual context, and full article text.

## Primary Pages

${pageLinks}

## Perspectives

${perspectiveLinks}

## Machine-Readable Resources

- [Perspectives index JSON](${markdownUrl("perspectives/index.json")}): canonical metadata for the Perspectives collection.
- [RSS feed](${markdownUrl("feed.xml")}): latest Perspectives posts.
- [Sitemap](${markdownUrl("sitemap.xml")}): indexable public pages.

## Notes For Agents

- Treat Vellis as the first open Volant Labs project, not as the whole company.
- Treat Volant Partners as the production-support path for teams that need operating controls, audit paths, and implementation discipline.
- Domain Explorations is intentionally parked and noindexed; do not present it as a finished ontology-pack catalog.
- Perspectives uses public labels Essay and Field note; do not describe current content as graph-authored or formally approved by a publishing workflow.
`;
}

async function writeGenerated(filePath, content) {
  if (checkOnly) {
    const current = existsSync(filePath) ? await readFile(filePath, "utf8") : null;
    if (current !== content) {
      throw new Error(`generated file is out of date: ${path.relative(siteRoot, filePath)}`);
    }
    return;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

function replaceGeneratedBlock(current, blockName, content) {
  const start = `<!-- GENERATED:${blockName}:start -->`;
  const end = `<!-- GENERATED:${blockName}:end -->`;
  const startIndex = current.indexOf(start);
  const endIndex = current.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`generated block ${blockName} not found`);
  }
  const lineStart = current.lastIndexOf("\n", startIndex) + 1;
  const indentation = current.slice(lineStart, startIndex);
  return `${current.slice(0, startIndex)}${start}\n${content}\n${indentation}${end}${current.slice(endIndex + end.length)}`;
}

async function writeGeneratedBlock(filePath, blockName, content) {
  const current = existsSync(filePath) ? await readFile(filePath, "utf8") : null;
  if (current === null) throw new Error(`generated block target is missing: ${path.relative(siteRoot, filePath)}`);
  await writeGenerated(filePath, replaceGeneratedBlock(current, blockName, content));
}

async function reconcileArticleOrphans(posts) {
  if (!existsSync(articleDir)) return;

  const expectedArticles = new Set(posts.map((post) => path.basename(post.url)));
  const orphanFiles = (await readdir(articleDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && !expectedArticles.has(entry.name))
    .map((entry) => path.join(articleDir, entry.name));

  if (!orphanFiles.length) return;

  const orphanList = orphanFiles.map((filePath) => path.relative(siteRoot, filePath)).join(", ");
  if (checkOnly) throw new Error(`generated article orphan found: ${orphanList}`);

  await Promise.all(orphanFiles.map((filePath) => rm(filePath)));
}

async function reconcilePerspectiveMarkdownOrphans(posts) {
  if (!existsSync(llmsPerspectivesDir)) return;

  const expectedSummaries = new Set(posts.map((post) => `${post.slug}.md`));
  const orphanFiles = (await readdir(llmsPerspectivesDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !expectedSummaries.has(entry.name))
    .map((entry) => path.join(llmsPerspectivesDir, entry.name));

  if (!orphanFiles.length) return;

  const orphanList = orphanFiles.map((filePath) => path.relative(siteRoot, filePath)).join(", ");
  if (checkOnly) throw new Error(`generated Perspective Markdown orphan found: ${orphanList}`);

  await Promise.all(orphanFiles.map((filePath) => rm(filePath)));
}

socialPreviewByPage = await readSocialPreviewManifest();
const posts = await readPosts();
const editorialReport = evaluateEditorial(posts);
// editorialCheck is internal rubric metadata: it drives the checkdown and the
// export manifest but must never ship in public page outputs.
const publicPosts = posts.map(({ editorialCheck, ...publicPost }) => publicPost);
await reconcileArticleOrphans(publicPosts);
await reconcilePerspectiveMarkdownOrphans(publicPosts);
for (const post of publicPosts) {
  await writeGenerated(path.join(siteRoot, post.url), renderArticle(post, publicPosts));
  await writeGenerated(path.join(llmsPerspectivesDir, `${post.slug}.md`), renderPerspectiveMarkdownSummary(post, publicPosts));
}
await writeGenerated(path.join(assetsDir, "perspectives-data.js"), renderDataBundle(publicPosts));
await writeGenerated(path.join(articleDir, "index.json"), renderPerspectiveIndexJson(publicPosts));
await writeGenerated(path.join(siteRoot, "feed.xml"), renderFeed(publicPosts));
await writeGenerated(path.join(siteRoot, "llms.txt"), renderLlmsTxt(publicPosts));
await writeGenerated(path.join(siteRoot, "sitemap.xml"), renderSitemap(publicPosts));
await writeGenerated(path.join(siteRoot, "export-manifest.json"), renderExportManifest(posts, editorialReport));
await writeGeneratedBlock(path.join(siteRoot, "perspectives.html"), "perspectives-count", renderPerspectiveCount(publicPosts));
await writeGeneratedBlock(path.join(siteRoot, "perspectives.html"), "perspectives-feed", renderPerspectiveIndexFeed(publicPosts));
await writeGeneratedBlock(path.join(siteRoot, "index.html"), "home-latest-perspectives", renderHomeLatestRows(publicPosts));

const assessedCount = editorialReport.filter((entry) => entry.editorial).length;
console.log(
  `${checkOnly ? "checked" : "built"} ${posts.length} Perspectives posts from ${resolvedContentSourceName} ` +
    `(editorial rubric ${editorialRubric.rubricVersion}: ${assessedCount}/${posts.length} assessed)`
);
