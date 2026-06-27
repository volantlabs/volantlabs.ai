import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(siteRoot, "content", "perspectives");
const articleDir = path.join(siteRoot, "perspectives");
const assetsDir = path.join(siteRoot, "assets");
const llmsDir = path.join(siteRoot, "llms");
const llmsPerspectivesDir = path.join(llmsDir, "perspectives");
const checkOnly = process.argv.includes("--check");
const contentSourceName = process.env.PERSPECTIVES_SOURCE || "json";
const kindLabelsByKind = new Map([
  ["essays", "Essay"],
  ["graph", "From the graph"],
  ["artifact", "Artifact"]
]);

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
const defaultSocialImage = "assets/images/graph-theory-thesis.webp";
const defaultSocialImageAlt =
  "Radial graph theory diagram with one orange thesis node connecting memory, schema, and governance clusters.";
const summaryPages = [
  {
    title: "Home",
    path: "",
    summaryPath: "llms/pages/home.md",
    description: "Volant Labs publishes open graph-native infrastructure for AI-native work, starting with Vellis."
  },
  {
    title: "Vellis Engine",
    path: "engine.html",
    summaryPath: "llms/pages/engine.md",
    description: "The product overview for Vellis as a typed context graph with schema-enforced writes and exportable context."
  },
  {
    title: "Thesis",
    path: "thesis.html",
    summaryPath: "llms/pages/thesis.md",
    description: "The narrative point of view behind Vellis: graph memory, model reasoning, and human ratification."
  },
  {
    title: "Perspectives",
    path: "perspectives.html",
    summaryPath: "llms/pages/perspectives.md",
    description: "The library of essays, graph dispatches, and ratified notes behind Vellis."
  },
  {
    title: "Community",
    path: "community.html",
    summaryPath: "llms/pages/community.md",
    description: "The support and signal page for collaboration, graph registration, release notes, and questions."
  },
  {
    title: "Platform",
    path: "platform.html",
    summaryPath: "llms/pages/platform.md",
    description: "The Volant Partners production-support path for teams applying Volant Labs infrastructure."
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

function absoluteUrl(relativePath) {
  return `${manifest.siteUrl}/${relativePath}`;
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
    author,
    provenanceLine: requireString(rawPost, "provenanceLine", sourceRef),
    statusLabel: requireString(rawPost, "statusLabel", sourceRef),
    tags: requireStringArray(rawPost, "tags", sourceRef),
    body: normalizedBody,
    provenance: normalizedProvenance,
    related: requireStringArray(rawPost, "related", sourceRef)
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
    return Promise.all(
      files.map(async (file) => {
        const sourceRef = `content/perspectives/${file}`;
        const rawPost = JSON.parse(await readFile(path.join(this.directory, file), "utf8"));
        return normalizePerspectivePost(rawPost, sourceRef);
      })
    );
  }
}

function createPerspectiveSource(name) {
  if (name === "json") return new JsonFilePerspectiveSource(sourceDir);
  throw new Error(`unsupported Perspectives content source ${name}; add an adapter that returns normalized Perspective posts`);
}

async function readPosts() {
  const source = createPerspectiveSource(contentSourceName);
  const posts = await source.loadPosts();
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

function renderLogo() {
  return `<svg class="glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18" stroke="#F5F5F5" stroke-width="1.6"/><line x1="6" y1="6" x2="6" y2="18" stroke="#F5F5F5" stroke-width="1.6"/><line x1="6" y1="18" x2="18" y2="18" stroke="#F5F5F5" stroke-width="1.6"/>
          <circle cx="6" cy="6" r="3" fill="#F5F5F5"/><circle cx="18" cy="18" r="3" fill="#F5F5F5"/><circle cx="6" cy="18" r="2.4" fill="#D15B21"/>
        </svg>`;
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
        <a class="btn btn-ghost btn-sm" href="https://www.volantpartners.com/contact" aria-label="Contact Volant">Contact</a>
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
      <div><div class="brand" style="font-size:20px">Volant Labs</div><p style="max-width:34ch;margin-top:12px;font-size:14px;color:#9aa0ab">Open tools and research for graph-native AI work.</p></div>
      <div class="foot-cols">
        <div class="foot-col"><h5>Project</h5><a href="../engine.html">Engine</a><a href="../thesis.html">Thesis</a><a href="../perspectives.html">Perspectives</a><a href="../community.html">Community</a></div>
        <div class="foot-col"><h5>Open</h5><a href="../thesis.html">Open by Design</a><a href="../engine.html">Engine overview</a><a href="../engine.html#quickstart">Local start</a><a href="../platform.html">Production support</a></div>
        <div class="foot-col"><h5>Stay close</h5><a href="../feed.xml">RSS feed</a><a href="../perspectives.html#subscribe">Subscribe</a><a href="mailto:hello@volantpartners.com">Contact</a><a href="../platform.html">Platform</a></div>
      </div>
    </div>
    <div class="foot-bottom"><span>&copy; 2026 Volant Partners</span><span class="nrp">Vellis stays runnable and exportable.</span></div>
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
  const socialImage = absoluteUrl(defaultSocialImage);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.dek,
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${escapeHtml(post.dek)}">
<meta property="og:site_name" content="Volant Labs">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(post.dek)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(socialImage)}">
<meta property="og:image:width" content="960">
<meta property="og:image:height" content="540">
<meta property="og:image:alt" content="${escapeHtml(defaultSocialImageAlt)}">
<meta property="article:published_time" content="${escapeHtml(post.published)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(post.title)}">
<meta name="twitter:description" content="${escapeHtml(post.dek)}">
<meta name="twitter:image" content="${escapeHtml(socialImage)}">
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

function renderPerspectiveIndexJson(posts) {
  const payload = {
    schemaVersion: "2026-06-27.perspectives.index.v1",
    siteUrl: manifest.siteUrl,
    generatedFrom: contentSourceName,
    collection: {
      title: "volantlabs.ai Perspectives",
      url: absoluteUrl("perspectives.html"),
      feedUrl: absoluteUrl("feed.xml"),
      description: "Essays, graph dispatches, and ratified notes behind Vellis."
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
  return `        <span class="lane">${posts.length} pieces and growing</span>`;
}

function renderPerspectiveIndexFeed(posts) {
  return posts
    .map((post) => {
      const provenanceClass = post.provenanceLine.includes("Ratified") ? "prov ok" : "prov";
      return `        <article class="post" id="${escapeHtml(post.slug)}" data-lane="${escapeHtml(post.kind)}">
          <div><span class="lanepill ${escapeHtml(post.kind)}">${escapeHtml(post.kindLabel)}</span></div>
          <div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.dek)}</p>
            <div class="meta">
              <span>${escapeHtml(post.displayDate)}</span>
              <span class="${provenanceClass}">${escapeHtml(post.provenanceLine)}</span>
            </div>
          </div>
          <a class="read" href="${escapeHtml(post.url)}" aria-label="Open perspective: ${escapeHtml(post.title)}">Open note <span class="arr">-&gt;</span></a>
        </article>`;
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
    <description>Essays, graph dispatches, and ratified notes behind Vellis.</description>
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
  const provenanceRows = [
    ["Source", post.provenance.source],
    ["Reasoning layer", post.provenance.reasoningLayer],
    ["Human ratifier", post.provenance.humanRatifier],
    ["Status", post.provenance.status],
    ["Known uncertainty", post.provenance.knownUncertainty],
    ["Dissent", post.provenance.dissent],
    ["Next falsifier", post.provenance.nextFalsifier]
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

## Summary

${post.dek}

## What This Page Is For

This page is part of the Volant Labs Perspectives library. It should be used as context for Vellis, graph-native AI infrastructure, provenance, governance, and operational adoption.

## Main Sections

${sectionList}

## Provenance

${provenanceRows}

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

> Volant Labs publishes open graph-native infrastructure for AI-native work. Vellis is the first open project: a typed context graph for shared agent context, schema-enforced writes, and exportable operational memory.

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
- Domain Explorations is intentionally parked and noindexed for launch; do not present it as a finished ontology-pack catalog.
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

const posts = await readPosts();
await reconcileArticleOrphans(posts);
await reconcilePerspectiveMarkdownOrphans(posts);
for (const post of posts) {
  await writeGenerated(path.join(siteRoot, post.url), renderArticle(post, posts));
  await writeGenerated(path.join(llmsPerspectivesDir, `${post.slug}.md`), renderPerspectiveMarkdownSummary(post, posts));
}
await writeGenerated(path.join(assetsDir, "perspectives-data.js"), renderDataBundle(posts));
await writeGenerated(path.join(articleDir, "index.json"), renderPerspectiveIndexJson(posts));
await writeGenerated(path.join(siteRoot, "feed.xml"), renderFeed(posts));
await writeGenerated(path.join(siteRoot, "llms.txt"), renderLlmsTxt(posts));
await writeGenerated(path.join(siteRoot, "sitemap.xml"), renderSitemap(posts));
await writeGeneratedBlock(path.join(siteRoot, "perspectives.html"), "perspectives-count", renderPerspectiveCount(posts));
await writeGeneratedBlock(path.join(siteRoot, "perspectives.html"), "perspectives-feed", renderPerspectiveIndexFeed(posts));
await writeGeneratedBlock(path.join(siteRoot, "index.html"), "home-latest-perspectives", renderHomeLatestRows(posts));

console.log(`${checkOnly ? "checked" : "built"} ${posts.length} Perspectives posts from ${contentSourceName}`);
