# volantlabs.ai

Mid-fidelity prototype of **volantlabs.ai** — the public story site for Volant Labs, with Vellis as the first open project. Core pages share one design system.

## View it

Open `index.html` in a browser. The nav, logo, and footers link to every page, so you can click through the whole site locally. All links are relative filenames; the site is static, with a small Perspectives generator that must be run before committing content changes.

For the standard local review flow:

```
npm run dev
```

Then open `http://localhost:4173/`.

```
volantlabs.ai/
├── index.html              # Home — animated node-edge hero
├── engine.html             # Vellis Engine (flagship / "one property") — quickstart path
├── domain-explorations.html# Parked post-launch initiative — worked models
├── thesis.html             # Cinematic story page — Volant's point of view
├── perspectives.html       # Essays and field notes
├── community.html          # Lightweight builder actions and future directions
├── platform.html           # Volant Partners production-support path
├── llms.txt                # Generated LLM-facing site map with summary links
├── llms/                   # Markdown summaries for LLM retrieval and routing
├── perspectives/           # Static article detail pages + generated index.json metadata
├── assets/
│   ├── images/             # Generated graph-native bitmap visuals for tiles and hero motifs
│   ├── perspective-article.css # Shared article detail template styles
│   ├── perspectives-data.js    # Generated runtime post manifest + article body/provenance content
│   └── site.css            # Shared shell — tokens + chrome (nav/buttons/sections/footer) + global reduced-motion
├── content/
│   ├── perspectives/       # Source JSON files for Perspectives posts
│   └── perspectives.schema.json # Contract for the Perspectives source shape
├── feed.xml                # Static RSS feed for Perspectives
├── robots.txt              # Crawl policy + sitemap pointer
├── sitemap.xml             # Generated sitemap for indexable top-level pages + Perspectives posts
├── scripts/
│   └── build-perspectives.mjs # Generates article pages, runtime data, RSS, and Perspectives/listing blocks
├── README.md
└── design/
    ├── sitemap.md          # Full IA / site architecture (the spec)
    └── wireframes/         # The 6 low-fi wireframes these pages were built from
```

## Design system

Each hand-authored page is a single self-contained HTML file with page-specific styles inline. Resolved from the Volant brand in the `volant_base` knowledge graph:

- **Type:** Montserrat (300–800).
- **Color:** navy `#001E50` (headers/trust/dark surfaces), orange `#D15B21` (emphasis/active nodes), orange-600 `#A8491A` (CTA fills and small orange text on white, for AA), orange-50 `#FEF3ED` (tints and dark-footer accents), warm white `#F5F5F5`, charcoal `#333333`, blue-50 `#E6EAF2`.
- **Motif:** node-and-edge graph visuals only. No pie/donut/3D/clipart/stock photos.
- **Generated imagery:** site-local WebP assets in `assets/images/` follow the `Flat Design Knowledge Graph` prompt template, `Infographic Dark` visual style, and Volant imagery/color/data-viz guidelines from `volant_base`.
- **Spacing:** 4px scale, 12-col grid, 1200px max content width.
- **Accessibility:** WCAG AA contrast, visible focus states, ≥44px touch targets, skip-to-content links, one `<main>` landmark per page, `aria-current="page"` on the active nav link, and a global `prefers-reduced-motion` rule (all in `assets/site.css`).

The **token block + chrome** (nav, buttons, section scaffolding, footer) now live once in **`assets/site.css`**, linked by every page — which also enforces a global `prefers-reduced-motion` rule for consistent motion safety. Page-specific styles stay inline per page. Nav/footer **markup** is still inline per page; folding that into a templated/JS-injected partial is the remaining shell step for when a broader build pipeline lands.

## Conventions & decisions baked in

- **"Graphcasting" is cut from v1** — it does not appear anywhere public-facing. The story section is named **Thesis**.
- **Thesis and Perspectives are split:** Thesis carries the narrative; Perspectives is the growing content library.
- **Perspectives publishing model:** launch copy should present authored essays and field notes. The JSON generator still supports provenance metadata for future graph-drafted work; keep that future-state language out of public copy until the workflow is real. New posts start as JSON in `content/perspectives/`; run `node scripts/build-perspectives.mjs` to regenerate article pages in `perspectives/`, `assets/perspectives-data.js`, `feed.xml`, and the generated blocks in `index.html` / `perspectives.html`. Use `node scripts/build-perspectives.mjs --check` before committing.
- **Discovery fundamentals:** top-level pages carry canonical URLs, descriptions, Open Graph/Twitter preview metadata, RSS discovery, Markdown summary discovery, and theme color. Perspectives articles inherit the same baseline plus Article JSON-LD from `scripts/build-perspectives.mjs`; `sitemap.xml`, `llms.txt`, `perspectives/index.json`, and `llms/perspectives/*.md` are generated there too. Parked `domain-explorations.html` is intentionally `noindex,follow` and excluded from the sitemap.
- **Repo scripts:** `npm run build` regenerates Perspectives outputs; `npm run check` verifies generated files are current.
- **Launch posture:** the launch site presents Vellis as an Apache-licensed open-source repo. Users should see a clear `Run locally` path: clone the repo, follow the README, run the graph engine/MCP server pattern, and load a first graph. Do not route launch copy through access-request or contact-gate language.
- **Domain Explorations:** demoted from global navigation for launch; keep the page as a parked reference-graph initiative until the example format and review path are ready.
- **Community:** keep community actions GitHub-native and lightweight: clone/run, follow releases, share examples, ask questions. Do not imply a mature graph registry, telemetry program, or fixed release cadence before those exist.
- **Audience lanes:** engineer (→ Engine / quickstart), thinker (→ Thesis / Perspectives), builder (→ Community), production champion (→ Platform).

## Source of truth

**The Kesher graph and Kesher source tree are the working source for this site.** The editable site bundle lives in the Kesher repo at `client_packs/volant/published_apps/volantlabs.ai/`; the `volant_base` knowledge graph *governs/indexes* it — site-architecture Spec `392e552b-5858-475e-a716-31d8f05bc5a6` and WebsiteLaunch `6328b862-2d29-4500-bbe2-13c338b104fc`.

The GitHub repo [`volantlabs/volantlabs.ai`](https://github.com/volantlabs/volantlabs.ai) is the public deployment mirror. Do not treat a change made only in that mirror as canonical; port it back to the Kesher working source first, then export.

Current FileDrive publication snapshots live under `/public/vellis/website/`; older `/public/open-engine/website/` assets are legacy/pre-Vellis snapshots, not the working copy.

## Publish to GitHub

From the Kesher repo root, export the working source into a clean local checkout of `volantlabs/volantlabs.ai`:

```
just export-volantlabs-ai ../volantlabs.ai
```

The export target defaults to `../volantlabs.ai`. Override it with the Just argument above or with `VOLANTLABS_AI_REPO=/path/to/volantlabs.ai` when running `scripts/export-volantlabs-ai.sh` directly.

The export script:
- refuses to run if the Kesher checkout has unresolved merge conflicts;
- runs `npm run check` and `npm run audit` in the site bundle;
- verifies the target checkout remote is `git@github.com:volantlabs/volantlabs.ai.git`;
- refuses to overwrite a dirty target checkout;
- syncs the site bundle with `rsync --delete`, preserving the target `.git/`, `.gitignore`, and common host-owned deployment metadata (`CNAME`, `.nojekyll`, `netlify.toml`, `vercel.json`, `_headers`, `_redirects`);
- stages the resulting mirror changes in the deployment repo.

After export, inspect and publish from the deployment repo:

```
cd ../volantlabs.ai
git status -sb
git diff --cached --stat
git commit -m "Export volantlabs.ai from Kesher"
git push origin main
```

If GitHub Pages or another host deploys from `volantlabs/volantlabs.ai`, the push is the deployment handoff.

## Status & next

Fidelity: **mid→hi**. Status: published app bundle / launch-copy draft. Done: shared CSS shell extracted to `assets/site.css`; Home and Engine reframed around the open-source Vellis launch posture with the public repo at `https://github.com/volantlabs/vellis`. Next: confirm export-format specifics, add launch demos/reference graphs, and fold nav/footer markup into a partial when a build lands.
