# volantlabs.ai

Mid-fidelity prototype of **volantlabs.ai** — the public story site for the Open Engine. Seven cross-linked pages sharing one design system.

## View it

Open `index.html` in a browser. The nav, logo, and footers link to every page, so you can click through the whole site locally. All links are relative filenames. The checked-in files are static; Perspectives article pages and RSS are generated from source JSON before commit.

```
volantlabs.ai/
├── index.html              # Home — animated node-edge hero
├── engine.html             # The Engine (flagship / "one property") — terminal quickstart
├── domain-explorations.html# Worked models — filter + card grid + OTA
├── thesis.html             # Cinematic story page — Volant's point of view
├── perspectives.html       # Essays / From the graph / Ratified (provenance-tagged)
├── community.html          # Iceberg model — support + telemetry, roadmap "the bank"
├── platform.html           # Quiet graduation path to the governed platform
├── perspectives/           # Static article detail pages for the Perspectives library
├── assets/
│   ├── images/             # Generated graph-native bitmap visuals for tiles and hero motifs
│   ├── perspective-article.css # Shared article detail template styles
│   ├── perspectives-data.js    # Generated post manifest for future client-side affordances
│   └── site.css            # Shared shell — tokens + chrome (nav/buttons/sections/footer) + global reduced-motion
├── content/
│   ├── perspectives/       # Source JSON files for Perspectives articles
│   └── perspectives.schema.json # Contract for the Perspectives post manifest shape
├── feed.xml                # Static RSS feed for Perspectives
├── scripts/
│   └── build-perspectives.mjs # Generates article HTML, post manifest, and RSS
├── README.md
└── design/
    ├── sitemap.md          # Full IA / site architecture (the spec)
    └── wireframes/         # The 6 low-fi wireframes these pages were built from
```

## Design system

Each page is a single self-contained HTML file with the tokens inline (no build step). Resolved from the Volant brand in the `volant_base` knowledge graph:

- **Type:** Montserrat (300–800).
- **Color:** navy `#001E50` (headers/trust/dark surfaces), orange `#D15B21` (emphasis/active nodes), orange-600 `#A8491A` (CTA fills and small orange text on white, for AA), orange-50 `#FEF3ED` (tints and dark-footer accents), warm white `#F5F5F5`, charcoal `#333333`, blue-50 `#E6EAF2`.
- **Motif:** node-and-edge graph visuals only. No pie/donut/3D/clipart/stock photos.
- **Generated imagery:** site-local WebP assets in `assets/images/` follow the `Flat Design Knowledge Graph` prompt template, `Infographic Dark` visual style, and Volant imagery/color/data-viz guidelines from `volant_base`.
- **Spacing:** 4px scale, 12-col grid, 1200px max content width.
- **Accessibility:** WCAG AA contrast, visible focus states, ≥44px touch targets, skip-to-content links, one `<main>` landmark per page, `aria-current="page"` on the active nav link, and a global `prefers-reduced-motion` rule (all in `assets/site.css`).

The **token block + chrome** (nav, buttons, section scaffolding, footer) now live once in **`assets/site.css`**, linked by every page — which also enforces a global `prefers-reduced-motion` rule for consistent motion safety. Page-specific styles stay inline per page. Nav/footer **markup** is still inline per page; folding that into a shared generator partial is the remaining shell step.

## Perspectives publishing

Perspectives article source lives in `content/perspectives/*.json`. To rebuild generated article HTML, `assets/perspectives-data.js`, and `feed.xml`, run:

```bash
node scripts/build-perspectives.mjs
```

Before committing, verify generated files are current:

```bash
node scripts/build-perspectives.mjs --check
```

## Conventions & decisions baked in

- **"Graphcasting" is cut from v1** — it does not appear anywhere public-facing. The story section is named **Thesis**.
- **Thesis and Perspectives are split:** Thesis carries the narrative; Perspectives is the growing content library.
- **Perspectives publishing model:** cards filter by Kind only (`Essay` / `From the graph`), while each generated article page carries the full provenance footer from the approved Kind × Status model. New posts should be added to `content/perspectives/*.json`, linked from `perspectives.html` / latest-content strips as needed, and regenerated with `node scripts/build-perspectives.mjs`.
- **One-property principle:** the site sells the open engine. The commercial **Platform** appears only as a *quiet* graduation path, never a competing pillar.
- **Audience lanes:** engineer (→ Engine), curious/builder (→ Domain Explorations), thinker (→ Thesis / Perspectives), champion (→ Platform).

## Source of truth

**This repo is canonical for the site code.** The source bundle lives at `client_packs/volant/published_apps/volantlabs.ai/`; the `volant_base` knowledge graph *governs/indexes* it — site-architecture Spec `392e552b-5858-475e-a716-31d8f05bc5a6` and WebsiteLaunch `6328b862-2d29-4500-bbe2-13c338b104fc`. FileDrive copies under `/public/open-engine/website/` are distribution snapshots, not the working copy — edit here, in git.

## Status & next

Fidelity: **mid→hi**. Status: published app bundle. Done: shared CSS shell extracted to `assets/site.css`; Home hero reframed outcome-first (lead with the capability, demote the mechanism); Perspectives article pages and RSS generated from source JSON. Next: real content polish, per-page hi-fi polish, fold nav/footer markup into a partial, and wire a build/deploy path.
