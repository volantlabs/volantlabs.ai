# volantlabs.ai

Mid-fidelity prototype of **volantlabs.ai** — the public story site for the Open Engine. Seven cross-linked pages sharing one design system.

## View it

Open `index.html` in a browser. The nav, logo, and footers link to every page, so you can click through the whole site locally. All links are relative filenames — it's a static prototype, not a deployed/build-step site (yet).

```
volantlabs.ai/
├── index.html              # Home — animated node-edge hero
├── engine.html             # The Engine (flagship / "one property") — terminal quickstart
├── domain-explorations.html# Worked models — filter + card grid + OTA
├── thesis.html             # Cinematic story page — Volant's point of view
├── perspectives.html       # Essays / From the graph / Ratified (provenance-tagged)
├── community.html          # Iceberg model — support + telemetry, roadmap "the bank"
├── platform.html           # Quiet graduation path to the governed platform
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
- **Spacing:** 4px scale, 12-col grid, 1200px max content width.
- **Accessibility:** WCAG AA contrast, visible focus states, ≥44px touch targets.

The nav + footer + token block are currently **duplicated per file** (mid-fi tradeoff). Factoring them into a shared component/partial is a known next step when this moves toward build.

## Conventions & decisions baked in

- **"Graphcasting" is cut from v1** — it does not appear anywhere public-facing. The story section is named **Thesis**.
- **Thesis and Perspectives are split:** Thesis carries the narrative; Perspectives is the growing content library.
- **One-property principle:** the site sells the open engine. The commercial **Platform** appears only as a *quiet* graduation path, never a competing pillar.
- **Audience lanes:** engineer (→ Engine), curious/builder (→ Domain Explorations), thinker (→ Thesis / Perspectives), champion (→ Platform).

## Source of truth

**This repo is canonical for the site code.** The source bundle lives at `client_packs/volant/published_apps/volantlabs.ai/`; the `volant_base` knowledge graph *governs/indexes* it — site-architecture Spec `392e552b-5858-475e-a716-31d8f05bc5a6` and WebsiteLaunch `6328b862-2d29-4500-bbe2-13c338b104fc`. FileDrive copies under `/public/open-engine/website/` are distribution snapshots, not the working copy — edit here, in git.

## Status & next

Fidelity: **mid**. Status: published app bundle. Next: hi-fi polish + real content, extract the shared shell into a partial/component, and wire a build/deploy path when the static prototype grows into the public site.
