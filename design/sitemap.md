# volantlabs.ai — Site Architecture (Sitemap)

**Status:** rebuilt 2026-06-16 · public copy and quickstart refreshed 2026-07-10
**Spec:** `392e552b-5858-475e-a716-31d8f05bc5a6` (volant_base)
**Source of truth for this rebuild:** the 7 wireframes on disk + `volantlabs-sitemap-v2.svg` + Vellis handoff IA. Where v1 detail was unrecoverable, structure is re-derived from the wireframes, not invented.

---

## What changed in this rebuild (decisions locked 2026-06-16)

1. **"Graphcasting" is cut entirely from v1.** The term hasn't landed with the team, so it appears nowhere public-facing — not in nav, not as a page title, not as a lane name, not as an explainer. Future graph-drafted publishing can return when the workflow is real.
2. **The story section keeps its name: "Thesis."** Thesis remains the point-of-view page; the feed/index behavior moves to Perspectives.
3. **The spine gains a content-library page:** Engine · Domain Explorations · Thesis · Perspectives · Community · Platform, plus Home.

---

## Governing principles (carried forward)

- **One-property principle.** This site sells one thing: Vellis. The commercial platform is present only as a *quiet* graduation path, never a competing pillar.
- **Quiet graduation path.** Platform lives in the nav and in one calm strip per page — never a loud sales rail.
- **Audience lanes.** Four readers move through the site on different paths (see §2). The IA serves all four without four separate sites.
- **Lightweight builder path.** Most users pull and build; the site surfaces clone/run, release following, useful examples, and direct questions.

---

## 1. Global shell (every page)

**Top nav (left → right):**
`Vellis` (logo → Home) · Engine · Thesis · Perspectives · Community · — · `Contact` (ghost button) · `Platform` (quiet button)

**Footer (every page):**
Open by Design · Quickstart · RSS / subscribe · Contact · Platform

---

## 2. Audience lanes → entry points

| Reader | Wants | Primary path |
|---|---|---|
| **Engineer** | "Can I evaluate it?" | Home hero → **Engine** (local run path + terminal-style access model) → clone and run |
| **Curious / builder** | "What can it model?" | Home featured trio → **Community** → run locally or share an example |
| **Thinker** | "What's the idea here?" | Home → **Thesis** (story) → **Perspectives** (library) → subscribe |
| **Champion** | "When do we need governance?" | **Thesis / Engine** → **Platform** (governed production) → book a conversation |

---

## 3. Section detail

### 3.0 Home  *(wireframe-1)*
**Job:** answer "what is it / can I evaluate it" in one screen; route the four lanes.
- **Hero** — headline "One memory your agents share — and you own."; subhead: Apache-licensed typed graph engine, harness-agnostic shared AI context, and exportable ownership; CTAs: *Run Vellis locally* (primary), *See the engine*; animated node-edge graph.
- **Featured trio** — flagship (Vellis) + 2 satellites (engine details, Thesis/Perspectives).
- **Latest perspectives** — feed strip of recent essays and field notes linking to the Perspectives library.
- **Flywheel (5 steps)** — clone → model → connect → iterate → reuse.
- **Community CTA** + **quiet Platform strip** ("Need governance? → Platform").

> Mid-fi update 2026-06-17: the home page keeps the Thesis entry point, and the latest-content strip now routes to Perspectives.

### 3.1 Engine  *(wireframe-2)* — the flagship, the one property
**Job:** get an engineer from landing to local evaluation.
- **Hero** — "Vellis is the open-source graph engine for agent memory"; CTAs *Run locally*, *Read the thesis*.
- **Two-column** — *What it is* (typed graph · schema language · storage · export) | terminal-style local quick start.
- **Capabilities** — Schema language · MCP server · local storage · documented snapshots, restore, and ledger replay · starter docs/prompts. Do not name additional export formats until they are documented in the public repo.
- **Why open · promise** — portability + no-rug-pull covenant, stated up front as a trust signal.

### 3.2 Domain Explorations  *(wireframe-3)* — proof by worked models
**Job:** show what Vellis can model once example boundaries are ready; remain parked until then.
- **Header** — reference-graph framing; domain examples are useful proof, but not part of the current supported path.
- **Reference concepts** — personal project management, jobs/search, business operating graph, and other starter domains once the example format is ready.
- **Boundary note** — publish examples only when the schema, seed data, and review path are clear enough for builders to reuse.
- **Propose a domain** — optional signal capture once a reusable example format exists.

### 3.3 Thesis  *(story page — reworked 2026-06-17)* — Volant's point of view
**Job:** carry the big story — for the "thinker" lane — in plain language, with a more cinematic landing-page feel.

- **Hero** — full-viewport dark scene with animated node field and the central line: "The graph remembers. The model reasons. You ratify."
- **Story arc** — capability is abundant → text alone cannot carry the system → graph as theory → governance at execution.
- **Operating loop** — remember → reason → ratify → run → compound.
- **Promise** — open substrate and governed graduation path.
- **Latest perspectives** — small strip linking into the content library, not the primary page job.

### 3.4 Perspectives  *(new 2026-06-17)* — content library
**Job:** hold the growing body of essays and field notes without turning Thesis into a blog index.

- **Header** — essays and field notes; calls out that Thesis is the story and Perspectives is the library.
- **Kind filter** — simple public views:
  - *All*
  - *Essays*
  - *Field notes*
- **Provenance line** — byline and update status only. Graph-drafted provenance can return once the workflow is real.
- **Subscribe band** — email + RSS.

### 3.5 Community  *(wireframe-5)* — lightweight builder path
**Job:** support the silent majority who pull and build; avoid implying a mature registry or fixed cadence.
- **Header** — framing: most users clone, run, and learn by building.
- **Cards (2×2)** — Run locally · Share an example · Follow releases · Questions.
- **Future directions** — likely next / exploring / later, framed explicitly as candidates rather than dated commitments.

### 3.6 Platform  *(wireframe-6)* — the quiet graduation path
**Job:** for the "champion," name the one thing Vellis should not pretend to solve alone, and offer a calm path to governed production with Volant Partners.
- **Hero** — "When shared agent memory becomes production infrastructure"; names the governance, controls, and operating support required in production.
- **Before / after** — *In Vellis* (agents write · graphs run real ops · production readiness remains the builder's responsibility) vs *With Volant Partners* (write-back gates · audit traces · approval policies · accumulated intelligence).
- **Single CTA** — "Ready for governed operations? → Book a conversation" (links directly to the Volant Partners contact form). One calm CTA only.

---

## 4. Page tree (at a glance)

```
Home  (/)
├─ Engine  (/engine)                         ← Vellis flagship · one property
│   ├─ Local run path / terminal
│   ├─ Capabilities (schema · export · docs)
│   └─ Why open · promise (portability + no-rug-pull)
├─ Domain Explorations  (/explorations)
│   ├─ parked reference-graph concepts
│   ├─ exploration cards (type + freshness)
│   └─ Propose a domain
├─ Thesis  (/thesis)                          ← story page
│   ├─ foundation hero
│   ├─ story arc
│   ├─ operating loop
│   └─ latest perspectives strip
├─ Perspectives  (/perspectives)              ← growing content library
│   ├─ Kind filter: All · Essays · Field notes
│   ├─ posts
│   └─ Subscribe (email + RSS)
├─ Community  (/community)
│   ├─ Run locally · Share an example · Follow releases · Questions
│   └─ Future directions
└─ Platform  (/platform)                      ← quiet governed-production path
    ├─ the governance question
    ├─ Vellis in governed production
    └─ Book a conversation  → commercial site
```

---

## 5. Resolved decisions

1. **Middle story section name** → **Thesis** (kept; not renamed).
2. **Graphcasting** → **cut entirely for v1.** No public-facing use anywhere. Revisit only if the term lands internally.
3. **Growing content library** → **Perspectives**.
4. **Perspective Kind filters** → *All · Essays · Field notes*. Graph-drafted provenance is future-state.

---

## 6. Re-align status (wireframes)

- **thesis.html** — ✅ reworked into a cinematic story page; no longer functions as the primary content index.
- **perspectives.html** — ✅ added as the growing content library with filters and provenance.
- **wireframe-7-perspectives.svg** — ✅ added for the Perspectives library page.
- **volantlabs-sitemap-v2.svg** — ✅ added as the 6-section IA diagram companion to this sitemap.
- **home-midfi.html / index.html** — ✅ latest content strip now points to Perspectives.

> Graph/FileDrive hygiene 2026-06-24: the current Vellis site bundle is published under `/public/vellis/website/volantlabs-ai-vellis-site-20260624.zip`. Older `/public/open-engine/website/` sitemap, wireframe, and mid-fi Media records remain linked as legacy/pre-Vellis snapshots.
