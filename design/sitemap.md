# volantlabs.ai — Site Architecture (Sitemap)

**Status:** rebuilt 2026-06-16 · Vellis/FileDrive hygiene refreshed 2026-06-24
**Spec:** `392e552b-5858-475e-a716-31d8f05bc5a6` (volant_base)
**Source of truth for this rebuild:** the 7 wireframes on disk + `volantlabs-sitemap-v2.svg` + Vellis handoff IA. Where v1 detail was unrecoverable, structure is re-derived from the wireframes, not invented.

---

## What changed in this rebuild (decisions locked 2026-06-16)

1. **"Graphcasting" is cut entirely from v1.** The term hasn't landed with the team, so it appears nowhere public-facing — not in nav, not as a page title, not as a lane name, not as an explainer. The underlying capability (publishing from the graph, with provenance) stays; the *word* comes back only if/when it lands internally.
2. **The story section keeps its name: "Thesis."** Thesis remains the point-of-view page; the feed/index behavior moves to Perspectives.
3. **The spine gains a content-library page:** Engine · Domain Explorations · Thesis · Perspectives · Community · Platform, plus Home.

---

## Governing principles (carried forward)

- **One-property principle.** This site sells one thing: Vellis. The commercial platform is present only as a *quiet* graduation path, never a competing pillar.
- **Quiet graduation path.** Platform lives in the nav and in one calm strip per page — never a loud sales rail.
- **Audience lanes.** Four readers move through the site on different paths (see §2). The IA serves all four without four separate sites.
- **Iceberg model of community.** Most users pull and build; the site surfaces support + adoption telemetry, not a PR bazaar.

---

## 1. Global shell (every page)

**Top nav (left → right):**
`Vellis` (logo → Home) · Engine · Domain Explorations · Thesis · Perspectives · Community · — · `Contact` (ghost button) · `Platform` (quiet button)

**Footer (every page):**
Open by Design · Access model · Preview access · RSS / subscribe · Contact · Platform

---

## 2. Audience lanes → entry points

| Reader | Wants | Primary path |
|---|---|---|
| **Engineer** | "Can I evaluate it?" | Home hero → **Engine** (preview access + terminal-style access model) → preview access |
| **Curious / builder** | "What can it model?" | Home featured trio → **Domain Explorations** → bootstrap a pack |
| **Thinker** | "What's the idea here?" | Home → **Thesis** (story) → **Perspectives** (library) → subscribe |
| **Champion** | "When do we need governance?" | **Thesis / Engine** → **Platform** (Kesher graduation) → book a conversation |

---

## 3. Section detail

### 3.0 Home  *(wireframe-1)*
**Job:** answer "what is it / can I evaluate it" in one screen; route the four lanes.
- **Hero** — headline "One memory your agents share — and you own."; subhead: typed knowledge graph, shared AI context, full-fidelity export; CTAs: *Request Vellis preview* (primary), *See a worked model*; animated node-edge graph.
- **Featured trio** — flagship (Vellis) + 2 satellites (worked domain models, Thesis essay).
- **Latest perspectives** — feed strip of recent essays/dispatches linking to the Perspectives library.
- **Flywheel (5 steps)** — seed → meaning → governance → graduate to Kesher → compound.
- **Community CTA** + **quiet Platform strip** ("Need governance? → Platform").

> Mid-fi update 2026-06-17: the home page keeps the Thesis entry point, and the latest-content strip now routes to Perspectives.

### 3.1 Engine  *(wireframe-2)* — the flagship, the one property
**Job:** get an engineer from landing to a preview access.
- **Hero** — "Vellis is the typed context graph for AI-native work"; CTAs *Request Vellis preview*, *See the platform*.
- **Two-column** — *What it is* (typed graph · schema language · storage · export) | terminal-style preview access.
- **Capabilities** — Schema language · Open-standards export (JSON-LD · RDF · CSV) · access-pack docs.
- **Why open · promise** — portability + no-rug-pull covenant, stated up front as a trust signal.

### 3.2 Domain Explorations  *(wireframe-3)* — proof by worked models
**Job:** show what Vellis can model; let people bootstrap a real graph.
- **Header + filter** — All · Domain packs · Reference builds · Over-the-air ★ (filter by type; freshness shown per card).
- **Featured OTA callout** — "★ Over-the-air graphs" → *Bootstrap it*.
- **Card grid (3×2)** — each card: type tag + freshness date.
- **Propose a domain** — *Submit an idea* CTA.

### 3.3 Thesis  *(story page — reworked 2026-06-17)* — Volant's point of view
**Job:** carry the big story — for the "thinker" lane — in plain language, with a more cinematic landing-page feel.

- **Hero** — full-viewport dark scene with animated node field and the central line: "The graph remembers. The model reasons. The human ratifies."
- **Story arc** — capability is abundant → text alone cannot carry the system → graph as theory → governance at execution.
- **Operating loop** — remember → reason → ratify → run → compound.
- **Promise** — open substrate and governed graduation path.
- **Latest perspectives** — small strip linking into the content library, not the primary page job.

### 3.4 Perspectives  *(new 2026-06-17)* — content library
**Job:** hold the growing body of essays and graph dispatches, with ratification shown per piece, without turning Thesis into a blog index.

- **Header** — "Essays, dispatches, and ratified work"; calls out that Thesis is the story and Perspectives is the library.
- **Kind filter** — three content views:
  - *All*
  - *Essays* (was "Human Essays")
  - *From the graph* (was "Graph Dispatches")
- **Provenance line** — each post keeps one provenance line (byline for essays; exploration or ratification status for graph-drafted pieces). No "graphcasting" label attached.
- **Subscribe band** — email + RSS.

### 3.5 Community  *(wireframe-5)* — support + telemetry, iceberg model
**Job:** support the silent majority who pull & build; capture adoption signal; avoid a noisy contributor bazaar.
- **Header** — framing: most users pull & build; surface support + telemetry.
- **Cards (2×2)** — Collaborate · Showcase/register your graph (= adoption telemetry) · Release notes/cadence · Questions (email during the test period).
- **Roadmap · the bank** — next drop / planned / banked (from the module + exploration bank).

### 3.6 Platform  *(wireframe-6)* — the quiet graduation path
**Job:** for the "champion," name the one thing Vellis should not pretend to solve alone, and offer a calm exit to Kesher.
- **Hero** — "When AI context work needs governed operations"; names Kesher as Volant Partners' governed platform.
- **Before / after** — *On Vellis* (agents write · graphs run real ops · no audit answer) vs *On Kesher* (write-back gates · audit traces · approval policies · accumulated intelligence).
- **Single CTA** — "Ready for governed operations? → Book a conversation" (links out to the commercial site). One calm CTA only.

---

## 4. Page tree (at a glance)

```
Home  (/)
├─ Engine  (/engine)                         ← Vellis flagship · one property
│   ├─ Preview access / terminal
│   ├─ Capabilities (schema · export · docs)
│   └─ Why open · promise (portability + no-rug-pull)
├─ Domain Explorations  (/explorations)
│   ├─ filter: packs · reference builds · over-the-air ★
│   ├─ exploration cards (type + freshness)
│   └─ Propose a domain
├─ Thesis  (/thesis)                          ← story page
│   ├─ foundation hero
│   ├─ story arc
│   ├─ operating loop
│   └─ latest perspectives strip
├─ Perspectives  (/perspectives)              ← growing content library
│   ├─ Kind filter: All · Essays · From the graph
│   ├─ posts (with one provenance line)
│   └─ Subscribe (email + RSS)
├─ Community  (/community)
│   ├─ Contribute · Showcase · Release notes · Discussions
│   └─ Roadmap · the bank
└─ Platform  (/platform)                      ← quiet Kesher graduation path
    ├─ the governance question
    ├─ Vellis vs Kesher
    └─ Book a conversation  → commercial site
```

---

## 5. Resolved decisions

1. **Middle story section name** → **Thesis** (kept; not renamed).
2. **Graphcasting** → **cut entirely for v1.** No public-facing use anywhere. Revisit only if the term lands internally.
3. **Growing content library** → **Perspectives**.
4. **Perspective Kind filters** → *All · Essays · From the graph*. Ratified is status, not a filter.

---

## 6. Re-align status (wireframes)

- **thesis.html** — ✅ reworked into a cinematic story page; no longer functions as the primary content index.
- **perspectives.html** — ✅ added as the growing content library with filters and provenance.
- **wireframe-7-perspectives.svg** — ✅ added for the Perspectives library page.
- **volantlabs-sitemap-v2.svg** — ✅ added as the 6-section IA diagram companion to this sitemap.
- **home-midfi.html / index.html** — ✅ latest content strip now points to Perspectives.

> Graph/FileDrive hygiene 2026-06-24: the current Vellis site bundle is published under `/public/vellis/website/volantlabs-ai-vellis-site-20260624.zip`. Older `/public/open-engine/website/` sitemap, wireframe, and mid-fi Media records remain linked as legacy/pre-Vellis snapshots.
