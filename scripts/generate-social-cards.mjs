#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(siteRoot, "assets", "images", "social");
const width = 1200;
const height = 630;

const cards = [
  {
    page: "/",
    filename: "home-vellis-shared-memory.png",
    title: "Vellis: structured knowledge for AI agents",
    description:
      "Model meaning explicitly, change it safely, and recover it completely across MCP-capable agent surfaces.",
    kicker: "Vellis",
    shortTitle: "Structured\nknowledge",
    alt: "A large orange Vellis knowledge node connecting AI agents and tools.",
    motif: "home",
  },
  {
    page: "/engine.html",
    filename: "engine-local-graph.png",
    title: "Vellis Engine: structured knowledge for AI agents",
    description:
      "Explicit semantics, validated change, deterministic query, replayable history, and recoverable state across agent surfaces.",
    kicker: "Engine",
    shortTitle: "Knowledge\nlayer",
    alt: "A local engine panel connected to a typed graph.",
    motif: "engine",
  },
  {
    page: "/thesis.html",
    filename: "thesis-memory-reasoning-review.png",
    title: "The Vellis thesis: meaning, reasoning, review",
    description:
      "Why graph-native infrastructure preserves meaning, gives models explicit structure, and keeps human judgment in the loop.",
    kicker: "Thesis",
    shortTitle: "Meaning\nReason\nReview",
    alt: "Three large connected nodes representing meaning, reasoning, and review.",
    motif: "thesis",
  },
  {
    page: "/perspectives.html",
    filename: "perspectives-library.png",
    title: "Perspectives from Volant Labs",
    description:
      "Essays and field notes on explicit knowledge models, controlled change, recoverable systems, provenance, and governed operations.",
    kicker: "Perspectives",
    shortTitle: "Field notes",
    alt: "A stack of perspective cards connected to a central graph node.",
    motif: "perspectives",
  },
  {
    page: "/community.html",
    filename: "community-builder-path.png",
    title: "Build with Vellis",
    description:
      "Run Vellis, follow releases, share examples, and ask direct questions as the open graph engine takes shape.",
    kicker: "Community",
    shortTitle: "Build with Vellis",
    alt: "A bold path of connected builder nodes.",
    motif: "community",
  },
  {
    page: "/platform.html",
    filename: "platform-governed-operations.png",
    title: "From Vellis to governed operations",
    description:
      "Carry open Vellis patterns into governed production with Volant Partners.",
    kicker: "Platform",
    shortTitle: "Governed operations",
    alt: "A Vellis graph passing through a governance gate into an audit record.",
    motif: "platform",
  },
  {
    page: "/domain-explorations.html",
    filename: "domain-explorations-worked-models.png",
    title: "Domain Explorations: worked Vellis models",
    description:
      "A parked exploration of reference graph packs, public-standard mappings, narrow workflow examples, and community builds.",
    kicker: "Domain Explorations",
    shortTitle: "Worked models",
    alt: "Four domain model panels connected to a shared graph substrate.",
    motif: "domains",
  },
  {
    page: "/perspectives/graph-theory.html",
    filename: "perspective-graph-theory.png",
    title: "The graph is a theory",
    description:
      "Why legibility is the wedge for agentic software, and why the graph should be treated as an executable point of view.",
    kicker: "Perspective",
    shortTitle: "Graph as theory",
    alt: "A central theory node connected to four evidence neighborhoods.",
    motif: "theory",
  },
  {
    page: "/perspectives/runtime-controls.html",
    filename: "perspective-runtime-controls.png",
    title: "Runtime-native controls: policy where execution happens",
    description:
      "A field note on why governance should sit near the write path, not in a disconnected approval ritual after the fact.",
    kicker: "Perspective",
    shortTitle: "Runtime controls",
    alt: "A write path passing through a runtime policy gate.",
    motif: "controls",
  },
  {
    page: "/perspectives/open-data.html",
    filename: "perspective-open-data.png",
    title: "Open data, proprietary intelligence",
    description:
      "Vellis is an open graph engine. This field note draws the line that keeps it open while the operational intelligence organizations build on it stays their own.",
    kicker: "Perspective",
    shortTitle: "Open substrate",
    alt: "Private intelligence nodes growing from an open Vellis substrate.",
    motif: "open-data",
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(value, maxChars) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines(value, x, y, maxChars, lineHeight, className, maxLines = 3) {
  return value
    .split("\n")
    .flatMap((line) => wrapText(line, maxChars))
    .slice(0, maxLines)
    .map(
      (line, index) =>
        `<text class="${className}" x="${x}" y="${y + index * lineHeight}">${escapeHtml(line)}</text>`,
    )
    .join("");
}

function node(x, y, r = 18, className = "node") {
  return `<circle class="${className}" cx="${x}" cy="${y}" r="${r}" />`;
}

function link(x1, y1, x2, y2, className = "link") {
  return `<line class="${className}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
}

function box(x, y, boxWidth, boxHeight, className = "symbol-box") {
  return `<rect class="${className}" x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="22" />`;
}

function tinyNetwork(cx, cy, scale = 1) {
  const pts = [
    [cx, cy],
    [cx - 84 * scale, cy - 72 * scale],
    [cx + 92 * scale, cy - 66 * scale],
    [cx - 104 * scale, cy + 68 * scale],
    [cx + 106 * scale, cy + 72 * scale],
  ];
  return `
    ${link(pts[0][0], pts[0][1], pts[1][0], pts[1][1], "link strong")}
    ${link(pts[0][0], pts[0][1], pts[2][0], pts[2][1], "link strong")}
    ${link(pts[0][0], pts[0][1], pts[3][0], pts[3][1], "link strong")}
    ${link(pts[0][0], pts[0][1], pts[4][0], pts[4][1], "link strong")}
    ${link(pts[1][0], pts[1][1], pts[2][0], pts[2][1])}
    ${link(pts[3][0], pts[3][1], pts[4][0], pts[4][1])}
    ${node(pts[0][0], pts[0][1], 44 * scale, "node hot core")}
    ${pts.slice(1).map(([x, y]) => node(x, y, 22 * scale)).join("")}
  `;
}

function motif(name) {
  switch (name) {
    case "home":
      return `
        ${tinyNetwork(878, 310, 1.32)}
        ${node(630, 310, 28)}
        ${node(1122, 310, 28)}
        ${link(658, 310, 760, 310, "link strong")}
        ${link(996, 310, 1094, 310, "link strong")}
      `;
    case "engine":
      return `
        ${box(624, 176, 252, 270, "terminal")}
        <path class="terminal-line" d="M676 252 L812 252" />
        <path class="terminal-line muted-line" d="M676 318 L786 318" />
        <path class="terminal-caret" d="M674 372 L724 342 L674 312" />
        ${tinyNetwork(1012, 312, 0.86)}
        ${link(876, 312, 900, 312, "link strong")}
      `;
    case "thesis":
      return `
        ${link(710, 214, 1024, 214, "link strong")}
        ${link(1024, 214, 870, 448, "link strong")}
        ${link(870, 448, 710, 214, "link strong")}
        ${node(710, 214, 62, "node hot core")}
        ${node(1024, 214, 54)}
        ${node(870, 448, 54)}
      `;
    case "perspectives":
      return `
        ${box(650, 138, 260, 152)}
        ${box(746, 238, 260, 152)}
        ${box(842, 338, 260, 152)}
        ${node(860, 316, 46, "node hot core")}
        ${link(760, 216, 860, 316, "link strong")}
        ${link(976, 414, 860, 316, "link strong")}
      `;
    case "community":
      return `
        ${[650, 760, 870, 980, 1090]
          .map((x, index) => node(x, index % 2 ? 360 : 270, index === 0 ? 42 : 32, index === 0 ? "node hot core" : "node"))
          .join("")}
        ${link(692, 270, 728, 360, "link strong")}
        ${link(792, 360, 838, 270, "link strong")}
        ${link(902, 270, 948, 360, "link strong")}
        ${link(1012, 360, 1058, 270, "link strong")}
      `;
    case "platform":
      return `
        ${tinyNetwork(690, 314, 0.74)}
        ${box(820, 154, 170, 318, "gate")}
        ${link(738, 314, 820, 314, "link strong")}
        ${link(990, 314, 1072, 314, "link strong")}
        ${box(1072, 232, 100, 164)}
        ${node(905, 314, 38, "node hot core")}
        <path class="check" d="M878 316 L898 338 L936 292" />
      `;
    case "domains":
      return `
        ${box(630, 144, 180, 132)}
        ${box(934, 144, 180, 132)}
        ${box(630, 374, 180, 132)}
        ${box(934, 374, 180, 132)}
        ${node(872, 326, 58, "node hot core")}
        ${link(720, 276, 872, 326, "link strong")}
        ${link(1024, 276, 872, 326, "link strong")}
        ${link(720, 374, 872, 326, "link strong")}
        ${link(1024, 374, 872, 326, "link strong")}
      `;
    case "theory":
      return `
        ${node(878, 312, 72, "node hot core")}
        ${[690, 244, 1058, 244, 710, 454, 1050, 454]
          .reduce((svg, value, index, arr) => {
            if (index % 2) return svg;
            const x = value;
            const y = arr[index + 1];
            return `${svg}${link(878, 312, x, y, "link strong")}${node(x, y, 34)}`;
          }, "")}
      `;
    case "controls":
      return `
        ${box(628, 230, 144, 164)}
        ${box(860, 168, 168, 286, "gate")}
        ${box(1100, 230, 82, 164)}
        ${link(772, 312, 860, 312, "link strong")}
        ${link(1028, 312, 1100, 312, "link strong")}
        ${node(944, 312, 44, "node hot core")}
      `;
    case "open-data":
      return `
        <rect class="substrate" x="620" y="410" width="520" height="72" rx="22" />
        ${box(652, 170, 136, 152)}
        ${box(820, 126, 136, 152)}
        ${box(988, 178, 136, 152)}
        ${link(720, 322, 720, 410, "link strong")}
        ${link(888, 278, 888, 410, "link strong")}
        ${link(1056, 330, 1056, 410, "link strong")}
        ${node(888, 410, 42, "node hot core")}
      `;
    case "wedge":
      return `
        <path class="wedge" d="M628 484 L1120 156 L1120 484 Z" />
        ${node(742, 408, 40, "node hot core")}
        ${node(922, 318, 30)}
        ${node(1052, 232, 24)}
        ${link(742, 408, 922, 318, "link strong")}
        ${link(922, 318, 1052, 232, "link strong")}
      `;
    case "domain-article":
      return `
        ${box(622, 210, 198, 190)}
        ${box(1014, 210, 148, 190)}
        <path class="bridge" d="M812 344 C876 242 954 242 1022 344" />
        ${node(916, 294, 54, "node hot core")}
        ${link(820, 300, 866, 294, "link strong")}
        ${link(966, 294, 1014, 300, "link strong")}
      `;
    case "license":
      return `
        ${node(672, 312, 58, "node hot core")}
        ${box(810, 232, 140, 160)}
        ${box(1030, 232, 140, 160)}
        ${link(730, 312, 810, 312, "link strong")}
        ${link(950, 312, 1030, 312, "link strong")}
        <path class="arrow" d="M922 312 L950 312 L934 294 M950 312 L934 330" />
      `;
    default:
      return tinyNetwork(878, 310, 1);
  }
}

function renderCard(card) {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          :root {
            --base: #041026;
            --surface: #071A3B;
            --elevated: #001E50;
            --accent: #D15B21;
            --text: #F5F5F5;
            --muted: #9FB0CC;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            background: var(--base);
            color: var(--text);
            font-family: Montserrat, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          svg { display: block; width: ${width}px; height: ${height}px; background: var(--base); }
          .frame { fill: none; stroke: rgba(159, 176, 204, 0.26); stroke-width: 1.4; }
          .texture line { stroke: rgba(159, 176, 204, 0.075); stroke-width: 1; }
          .texture circle { fill: rgba(159, 176, 204, 0.18); }
          .brand { fill: var(--text); font-weight: 850; font-size: 34px; letter-spacing: 0; }
          .bug { fill: var(--accent); }
          .kicker { fill: var(--accent); font-size: 24px; font-weight: 850; text-transform: uppercase; letter-spacing: 2.4px; }
          .title { fill: var(--text); font-size: 72px; font-weight: 850; letter-spacing: 0; }
          .link, .bridge, .arrow {
            stroke: rgba(245, 245, 245, 0.72);
            stroke-width: 4;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .link.strong, .bridge, .arrow { stroke: rgba(245, 245, 245, 0.9); stroke-width: 7; }
          .node {
            fill: var(--elevated);
            stroke: rgba(245, 245, 245, 0.92);
            stroke-width: 5;
          }
          .node.hot {
            fill: var(--accent);
            stroke: #F5F5F5;
            stroke-width: 7;
          }
          .node.core { filter: drop-shadow(0 0 30px rgba(209, 91, 33, 0.48)); }
          .symbol-box, .terminal, .gate {
            fill: rgba(7, 26, 59, 0.78);
            stroke: rgba(159, 176, 204, 0.7);
            stroke-width: 3;
          }
          .gate {
            fill: rgba(209, 91, 33, 0.16);
            stroke: rgba(209, 91, 33, 0.9);
          }
          .terminal-line, .terminal-caret, .check {
            stroke: rgba(245, 245, 245, 0.9);
            stroke-width: 8;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .muted-line { stroke: rgba(159, 176, 204, 0.78); }
          .substrate {
            fill: rgba(209, 91, 33, 0.22);
            stroke: rgba(209, 91, 33, 0.9);
            stroke-width: 4;
          }
          .wedge {
            fill: rgba(209, 91, 33, 0.28);
            stroke: rgba(209, 91, 33, 0.96);
            stroke-width: 4;
          }
        </style>
      </head>
      <body>
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(card.alt)}">
          <rect width="${width}" height="${height}" fill="#041026" />
          <g class="texture">
            ${Array.from({ length: 11 }, (_, index) => `<line x1="${72 + index * 104}" y1="72" x2="${-24 + index * 104}" y2="558" />`).join("")}
            ${Array.from({ length: 30 }, (_, index) => `<circle cx="${610 + (index % 6) * 86}" cy="${118 + Math.floor(index / 6) * 86}" r="${index % 5 === 0 ? 3 : 1.6}" />`).join("")}
          </g>
          <rect class="frame" x="36" y="36" width="1128" height="558" rx="18" />
          <g transform="translate(76 80)">
            <path class="bug" d="M0 28 L30 8 L60 28 L48 62 L12 62 Z" />
            <text class="brand" x="82" y="46">Volant Labs</text>
          </g>
          <text class="kicker" x="76" y="210">${escapeHtml(card.kicker)}</text>
          ${textLines(card.shortTitle, 76, 316, 15, 86, "title", 3)}
          <g>${motif(card.motif)}</g>
        </svg>
      </body>
    </html>`;
}

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

for (const card of cards) {
  await page.setContent(renderCard(card), { waitUntil: "load" });
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
