#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(siteRoot, "assets", "images", "social");
const backgroundDir = path.join(outputDir, "backgrounds");
const vellisBrandDir = path.resolve(
  siteRoot,
  "..",
  "..",
  "assets",
  "brand",
  "vellis",
  "generated",
);
const width = 1200;
const height = 630;

const lockupSvg = readFileSync(
  path.join(siteRoot, "assets", "logos", "volant-labs-flask-lockup.svg"),
  "utf8",
)
  .replace(/<\?xml[^>]*>\s*/g, "")
  .replace(/<!DOCTYPE[^>]*>\s*/g, "")
  .replace("<svg ", '<svg class="lockup-svg" ');

const latestMarkDataUri = `data:image/svg+xml;base64,${readFileSync(
  path.join(siteRoot, "assets", "logos", "volant-labs-flask-mark.svg"),
).toString("base64")}`;

const vellisPrimaryDataUri = `data:image/svg+xml;base64,${readFileSync(
  path.join(vellisBrandDir, "vellis-primary-dark.svg"),
).toString("base64")}`;

const cards = [
  {
    page: "/",
    filename: "home-vellis-topographic-v3.png",
    title: "Vellis: the open-source context graph engine for AI agents",
    description:
      "One typed, locally owned context graph your AI agents share — model meaning explicitly, change it safely, recover it completely.",
    kicker: "Vellis",
    headline: "One context graph\nyour agents share —\nand you own.",
    headlineSize: 74,
    background: "home-context-graph-topographic-v3.jpg",
    alt: "Volant Labs typography beside one illuminated topographic context graph with shared agent pathways.",
  },
  {
    page: "/engine.html",
    filename: "engine-vellis-topographic-v3.png",
    brand: "vellis",
    title: "Vellis Engine: an open-source context graph for AI agents",
    description:
      "Explicit semantics, validated change, deterministic query, replayable history, and recoverable state across agent surfaces.",
    kicker: "Context Graph Engine",
    headline: "The context graph\nagents can share, change,\nand recover.",
    headlineSize: 63,
    background: "engine-context-graph-topographic-v3.jpg",
    alt: "Vellis with a Volant Labs endorsement beside a layered topographic context graph and recovery loop.",
  },
  {
    page: "/thesis.html",
    filename: "thesis-topographic-v2.png",
    title: "The Vellis thesis: meaning, reasoning, review",
    description:
      "Why a context graph preserves meaning, gives models explicit structure, and keeps human judgment in the loop.",
    kicker: "The Thesis",
    headline: "The graph remembers.\nThe model reasons.\nYou ratify.",
    headlineSize: 68,
    background: "thesis-topographic.jpg",
    alt: "Volant Labs typography beside three connected topographic basins representing memory, reasoning, and review.",
  },
  {
    page: "/perspectives.html",
    filename: "perspectives-topographic-v2.png",
    title: "Perspectives from Volant Labs",
    description:
      "Essays and field notes on context graphs, explicit knowledge models, controlled change, recoverable systems, provenance, and governed operations.",
    kicker: "Perspectives",
    headline: "Essays and\nfield notes.",
    headlineSize: 86,
    background: "perspectives-topographic.jpg",
    alt: "Volant Labs typography beside layered topographic folios connected as a knowledge network.",
  },
  {
    page: "/community.html",
    filename: "community-vellis-topographic-v2.png",
    brand: "vellis",
    title: "Build with Vellis",
    description:
      "Run Vellis, follow releases, share examples, and ask direct questions as the open graph engine takes shape.",
    kicker: "Community",
    headline: "Build with\nVellis.",
    headlineSize: 88,
    background: "community-topographic.jpg",
    alt: "Vellis with a Volant Labs endorsement beside topographic paths converging into a shared builder network.",
  },
  {
    page: "/platform.html",
    filename: "platform-topographic-v2.png",
    title: "From Vellis to governed operations",
    description:
      "Carry open Vellis patterns into governed production with Volant Partners.",
    kicker: "Governed Operations",
    headline: "From Vellis to\nproduction\ninfrastructure.",
    headlineSize: 72,
    background: "platform-topographic.jpg",
    alt: "Volant Labs typography beside a topographic flow crossing into governed production infrastructure.",
  },
  {
    page: "/domain-explorations.html",
    filename: "domain-explorations-topographic-v2.png",
    title: "Domain Explorations: worked Vellis models",
    description:
      "A parked exploration of reference graph packs, public-standard mappings, narrow workflow examples, and community builds.",
    kicker: "Exploratory Work",
    headline: "Worked models\nfor real domains.",
    headlineSize: 78,
    background: "domain-explorations-topographic.jpg",
    alt: "Volant Labs typography beside several exploratory topographic domain regions on a shared substrate.",
  },
  {
    page: "/perspectives/graph-theory.html",
    filename: "perspective-graph-theory-topographic-v2.png",
    title: "The graph is a theory",
    description:
      "Why legibility is the wedge for agentic software, and why the graph should be treated as an executable point of view.",
    kicker: "Perspective · Essay",
    headline: "The graph is\na theory.",
    headlineSize: 86,
    background: "graph-theory-topographic.jpg",
    alt: "Volant Labs typography beside a topographic theory core connected to evidence neighborhoods.",
  },
  {
    page: "/perspectives/runtime-controls.html",
    filename: "perspective-runtime-controls-topographic-v2.png",
    title: "Runtime-native controls: policy where execution happens",
    description:
      "A field note on why governance should sit near the write path, not in a disconnected approval ritual after the fact.",
    kicker: "Perspective · Field Note",
    headline: "Runtime-native\ncontrols: policy where\nexecution happens.",
    headlineSize: 60,
    background: "runtime-controls-topographic.jpg",
    alt: "Volant Labs typography beside an illuminated runtime path crossing an abstract topographic threshold.",
  },
  {
    page: "/perspectives/open-data.html",
    filename: "perspective-open-data-topographic-v2.png",
    title: "Open data, proprietary intelligence",
    description:
      "Vellis is an open graph engine. This field note draws the line that keeps it open while the operational intelligence organizations build on it stays their own.",
    kicker: "Perspective · Field Note",
    headline: "Open data.\nProprietary\nintelligence.",
    headlineSize: 75,
    background: "open-data-topographic.jpg",
    alt: "Volant Labs typography beside an open topographic substrate supporting a concentrated intelligence layer.",
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageDataUri(filename) {
  return `data:image/jpeg;base64,${readFileSync(path.join(backgroundDir, filename)).toString("base64")}`;
}

function headlineLines(card) {
  const lines = card.headline.split("\n");
  if (lines.length > 3) {
    throw new Error(`${card.page} uses ${lines.length} headline lines; social cards allow at most three`);
  }
  return lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("");
}

function brandMarkup(card) {
  if (card.brand === "vellis") {
    return `<img class="product-logo" src="${vellisPrimaryDataUri}" alt="">`;
  }

  return `
    <div class="logo">
      ${lockupSvg}
      <img class="latest-mark" src="${latestMarkDataUri}" alt="">
    </div>`;
}

function publisherMarkup(card) {
  if (card.brand !== "vellis") return "";

  return `
    <div class="publisher">
      <div class="publisher-logo">
        ${lockupSvg}
        <img class="publisher-mark" src="${latestMarkDataUri}" alt="">
      </div>
    </div>`;
}

function renderCard(card) {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; }
          html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
          body { font-family: Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          .card { position: relative; width: ${width}px; height: ${height}px; overflow: hidden; background: #041026; }
          .background { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(4,16,38,.995) 0%, rgba(4,16,38,.97) 43%, rgba(4,16,38,.72) 57%, rgba(4,16,38,.10) 82%); }
          .frame { position: absolute; inset: 28px; border: 1px solid rgba(220,230,244,.24); border-radius: 22px; }
          .content { position: absolute; left: 58px; top: 34px; width: 780px; }
          .logo { position: relative; width: 690px; height: 230px; isolation: isolate; }
          .logo .lockup-svg { display: block; width: 100%; height: 100%; }
          .logo .lockup-svg text { fill: #f5f5f5 !important; font-family: Montserrat, sans-serif !important; }
          .logo .latest-mark { position: absolute; left: 0; top: 0; width: 230px; height: 230px; object-fit: contain; }
          .product-logo { display: block; width: 680px; height: 230px; object-fit: contain; object-position: left center; }
          .publisher { position: absolute; right: 48px; top: 48px; width: 274px; height: 111px; padding: 14px 12px; background: rgba(4,16,38,.68); border: 1px solid rgba(220,230,244,.20); border-radius: 16px; backdrop-filter: blur(6px); }
          .publisher-logo { position: relative; width: 250px; height: 83px; }
          .publisher-logo .lockup-svg { display: block; width: 100%; height: 100%; }
          .publisher-logo .lockup-svg text { fill: #f5f5f5 !important; font-family: Montserrat, sans-serif !important; }
          .publisher-mark { position: absolute; left: 0; top: 0; width: 83px; height: 83px; object-fit: contain; }
          .kicker { margin: 18px 0 17px 6px; color: #d15b21; font-size: 29px; line-height: 1; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; }
          .headline { margin: 0 0 0 4px; color: #f5f5f5; font-size: ${card.headlineSize}px; line-height: .98; letter-spacing: -.052em; font-weight: 800; }
          .headline span { display: block; width: max-content; white-space: nowrap; }
        </style>
      </head>
      <body>
        <main class="card" role="img" aria-label="${escapeHtml(card.alt)}">
          <img class="background" src="${imageDataUri(card.background)}" alt="">
          <div class="wash"></div>
          <div class="frame"></div>
          <div class="content">
            ${brandMarkup(card)}
            <div class="kicker">${escapeHtml(card.kicker)}</div>
            <h1 class="headline">${headlineLines(card)}</h1>
          </div>
          ${publisherMarkup(card)}
        </main>
      </body>
    </html>`;
}

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

for (const card of cards) {
  await page.setContent(renderCard(card), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const overflows = await page.locator(".headline span").evaluateAll((lines) =>
    lines.filter((line) => line.getBoundingClientRect().right > 820).map((line) => line.textContent),
  );
  if (overflows.length) {
    throw new Error(`${card.page} has headline lines outside the typography field: ${overflows.join(", ")}`);
  }
  const outputPath = path.join(outputDir, card.filename);
  await page.screenshot({ path: outputPath, type: "png", fullPage: false });
  console.log(`wrote ${path.relative(siteRoot, outputPath)}`);
}

await browser.close();

writeFileSync(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify(
    cards.map((card) => ({
      page: card.page,
      title: card.title,
      description: card.description,
      twitterTitle: card.title,
      twitterDescription: card.description,
      image: `assets/images/social/${card.filename}`,
      width,
      height,
      alt: card.alt,
    })),
    null,
    2,
  )}\n`,
);
console.log(`wrote ${path.relative(siteRoot, path.join(outputDir, "manifest.json"))}`);
