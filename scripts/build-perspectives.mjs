import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(siteRoot, "content", "perspectives");
const articleDir = path.join(siteRoot, "perspectives");
const assetsDir = path.join(siteRoot, "assets");
const checkOnly = process.argv.includes("--check");

const manifest = {
  schemaVersion: "2026-06-22.perspectives.v2",
  siteUrl: "https://volantlabs.ai",
  sourceSpecs: [
    {
      id: "392e552b-5858-475e-a716-31d8f05bc5a6",
      name: "volantlabs.ai - Site Architecture"
    },
    {
      id: "9c3d7e21-5b4a-4f86-a1d9-2e7c6b8f0a34",
      name: "volantlabs.ai Provenance Display Model (Kind x Status)"
    }
  ],
  filters: ["all", "essays", "graph"]
};

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

function absoluteUrl(relativePath) {
  return `${manifest.siteUrl}/${relativePath}`;
}

function toRssDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 13, 0, 0));
  return date.toUTCString();
}

async function readPosts() {
  const files = (await readdir(sourceDir))
    .filter((file) => file.endsWith(".json") && file !== "schema.json")
    .sort();
  const posts = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(path.join(sourceDir, file), "utf8")))
  );
  posts.sort((a, b) => b.published.localeCompare(a.published));
  validatePosts(posts);
  return posts;
}

function validatePosts(posts) {
  const slugs = new Set();
  const requiredPostFields = [
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
  ];
  const requiredProvenanceFields = [
    "source",
    "reasoningLayer",
    "humanRatifier",
    "status",
    "knownUncertainty",
    "dissent",
    "nextFalsifier"
  ];

  for (const post of posts) {
    for (const field of requiredPostFields) {
      if (post[field] === undefined || post[field] === null || post[field] === "") {
        throw new Error(`${post.slug || "post"} missing required field ${field}`);
      }
    }
    if (slugs.has(post.slug)) throw new Error(`duplicate perspective slug ${post.slug}`);
    slugs.add(post.slug);
    if (post.url !== `perspectives/${post.slug}.html`) {
      throw new Error(`${post.slug} url must be perspectives/${post.slug}.html`);
    }
    if (!Array.isArray(post.tags) || !post.tags.length) throw new Error(`${post.slug} requires tags`);
    if (!Array.isArray(post.body) || !post.body.length) throw new Error(`${post.slug} requires body sections`);
    for (const section of post.body) {
      if (!section.heading) throw new Error(`${post.slug} has body section without heading`);
      if (!Array.isArray(section.paragraphs) || !section.paragraphs.length) {
        throw new Error(`${post.slug} section ${section.heading} requires paragraphs`);
      }
    }
    for (const field of requiredProvenanceFields) {
      if (!post.provenance[field]) throw new Error(`${post.slug} provenance missing ${field}`);
    }
  }

  for (const post of posts) {
    for (const related of post.related) {
      if (!slugs.has(related)) throw new Error(`${post.slug} related post ${related} not found`);
    }
  }
}

function renderLogo() {
  return `<svg class="glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18" stroke="#001E50" stroke-width="1.6"/><line x1="6" y1="6" x2="6" y2="18" stroke="#001E50" stroke-width="1.6"/><line x1="6" y1="18" x2="18" y2="18" stroke="#001E50" stroke-width="1.6"/>
          <circle cx="6" cy="6" r="3" fill="#001E50"/><circle cx="18" cy="18" r="3" fill="#001E50"/><circle cx="6" cy="18" r="2.4" fill="#D15B21"/>
        </svg>`;
}

function renderHeader() {
  return `<header>
  <div class="wrap">
    <nav>
      <a class="brand" href="../index.html" aria-label="volantlabs.ai home">
        ${renderLogo()}
        volantlabs.ai
      </a>
      <div class="navlinks">
        <a href="../engine.html">Engine</a><a href="../domain-explorations.html">Domain Explorations</a><a href="../thesis.html">Thesis</a><a href="../perspectives.html" class="active" aria-current="page">Perspectives</a><a href="../community.html">Community</a>
      </div>
      <div class="navright">
        <a class="btn btn-ghost btn-sm" href="mailto:hello@volantpartners.com?subject=volantlabs.ai%20access" aria-label="Contact Volant">Contact</a>
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
      <div><div class="brand" style="font-size:20px">volantlabs.ai</div><p style="max-width:34ch;margin-top:12px;font-size:14px;color:#9aa0ab">Open by design. The coordination and integrity substrate for the agentic era.</p></div>
      <div class="foot-cols">
        <div class="foot-col"><h5>Project</h5><a href="../engine.html">Engine</a><a href="../domain-explorations.html">Explorations</a><a href="../thesis.html">Thesis</a><a href="../perspectives.html">Perspectives</a><a href="../community.html">Community</a></div>
        <div class="foot-col"><h5>Open</h5><a href="../thesis.html">Open by Design</a><a href="../engine.html#open-promise">Access model</a><a href="mailto:hello@volantpartners.com?subject=Open%20Engine%20access">Request access</a><a href="../platform.html">Platform</a></div>
        <div class="foot-col"><h5>Stay close</h5><a href="../feed.xml">RSS feed</a><a href="../perspectives.html#subscribe">Subscribe</a><a href="mailto:hello@volantpartners.com">Contact</a><a href="../platform.html">Platform</a></div>
      </div>
    </div>
    <div class="foot-bottom"><span>&copy; 2026 Volant Partners</span><span class="nrp">No rug-pull: the engine stays runnable.</span></div>
  </div>
</footer>`;
}

function renderArticle(post, posts) {
  const relatedCards = post.related
    .map((slug) => posts.find((candidate) => candidate.slug === slug))
    .filter(Boolean)
    .map((item) => `<a class="related-card" href="../${escapeHtml(item.url)}">
          <span class="lanepill ${escapeHtml(item.kind)}">${escapeHtml(item.kindLabel)}</span>
          <h3>${escapeHtml(item.shortTitle)}</h3>
          <p>${escapeHtml(item.dek)}</p>
          <span class="read">Read next -&gt;</span>
        </a>`)
    .join("\n        ");

  const body = post.body
    .map((section) => `<h2>${escapeHtml(section.heading)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ")}`)
    .join("\n        ");

  const provenanceRows = [
    ["Provenance", post.provenance.source],
    ["Reasoning layer", post.provenance.reasoningLayer],
    ["Human ratifier", post.provenance.humanRatifier],
    ["Status", post.provenance.status],
    ["Known uncertainty", post.provenance.knownUncertainty],
    ["Dissent", post.provenance.dissent],
    ["Next falsifier", post.provenance.nextFalsifier]
  ]
    .map(([term, definition]) => `<dt>${escapeHtml(term)}</dt>
          <dd>${escapeHtml(definition)}</dd>`)
    .join("\n          ");

  const tags = post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const canonical = absoluteUrl(post.url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${escapeHtml(post.dek)}">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(post.dek)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="${escapeHtml(canonical)}">
<title>${escapeHtml(post.title)} - Perspectives - volantlabs.ai</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/site.css">
<link rel="stylesheet" href="../assets/perspective-article.css">
</head>
<body data-perspective-slug="${escapeHtml(post.slug)}">
<a class="skip" href="#main">Skip to content</a>
${renderHeader()}
<main id="main">
  <section class="article-hero">
    <div class="wrap article-hero-grid">
      <div>
        <a class="backlink" href="../perspectives.html">Back to Perspectives</a>
        <span class="lanepill ${escapeHtml(post.kind)}">${escapeHtml(post.kindLabel)}</span>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="dek">${escapeHtml(post.dek)}</p>
        <div class="article-meta">
          <span>${escapeHtml(post.displayDate)}</span>
          <span>${escapeHtml(post.readingTime)}</span>
          <span>${escapeHtml(post.provenanceLine)}</span>
        </div>
      </div>
      <aside class="article-summary" aria-label="Perspective summary">
        <strong>${escapeHtml(post.statusLabel)}</strong>
        <p>Every Perspectives piece keeps authorship and ratification visible. The full provenance footer lives with the article.</p>
        <div class="tag-row">${tags}</div>
      </aside>
    </div>
  </section>
  <section class="article-main wrap">
    <article class="article-body">
        ${body}
    </article>
    <section class="provenance-panel" aria-labelledby="provenance-title">
      <div class="provenance-head">
        <p class="article-kicker">Provenance</p>
        <h2 id="provenance-title">How this piece should be read</h2>
      </div>
      <dl>
          ${provenanceRows}
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
        <p>New essays, graph dispatches, and ratified notes as they land.</p>
      </div>
      <div class="article-actions">
        <a class="btn btn-primary" href="mailto:hello@volantpartners.com?subject=Subscribe%20to%20volantlabs.ai%20Perspectives">Request updates</a>
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

function renderFeed(posts) {
  const latest = posts[0] ? toRssDate(posts[0].published) : new Date().toUTCString();
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
    <description>Essays, graph dispatches, and ratified notes behind the Open Engine.</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(latest)}</lastBuildDate>
${items}
  </channel>
</rss>
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

const posts = await readPosts();
for (const post of posts) {
  await writeGenerated(path.join(siteRoot, post.url), renderArticle(post, posts));
}
await writeGenerated(path.join(assetsDir, "perspectives-data.js"), renderDataBundle(posts));
await writeGenerated(path.join(siteRoot, "feed.xml"), renderFeed(posts));

console.log(`${checkOnly ? "checked" : "built"} ${posts.length} Perspectives posts`);
