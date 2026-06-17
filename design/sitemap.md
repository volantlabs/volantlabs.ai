# volantlabs.ai — Site Architecture (Sitemap)

**Status:** rebuilt 2026-06-16 · supersedes the lost v1 (Media `eb82e7f0`, bytes never published)
**Spec:** `392e552b-5858-475e-a716-31d8f05bc5a6` (volant_base)
**Source of truth for this rebuild:** the 7 wireframes on disk + `volantlabs-sitemap-v2.svg` + the Open Engine handoff IA. Where v1 detail was unrecoverable, structure is re-derived from the wireframes, not invented.

---

## What changed in this rebuild (decisions locked 2026-06-16)

1. **"Graphcasting" is cut entirely from v1.** The term hasn't landed with the team, so it appears nowhere public-facing — not in nav, not as a page title, not as a lane name, not as an explainer. The underlying capability (publishing from the graph, with provenance) stays; the *word* comes back only if/when it lands internally.
2. **The story section keeps its name: "Thesis."** Thesis remains the point-of-view page; the feed/index behavior moves to Perspectives.
3. **The spine gains a content-library page:** Engine · Domain Explorations · Thesis · Perspectives · Community · Platform, plus Home.

---

## Governing principles (carried forward)

- **One-property principle.** This site sells one thing: the open engine. The commercial platform is present only as a *quiet* graduation path, never a competing pillar.
- **Quiet graduation path.** Platform lives in the nav and in one calm strip per page — never a loud sales rail.
- **Audience lanes.** Four readers move through the site on different paths (see §2). The IA serves all four without four separate sites.
- **Iceberg model of community.** Most users pull and build; the site surfaces support + adoption telemetry, not a PR bazaar.

---

## 1. Global shell (every page)

**Top nav (left → right):**
`volantlabs.ai` (logo → Home) · Engine · Domain Explorations · Thesis · Perspectives · Community · — · `GitHub` (ghost button) · `Platform` (quiet button)

**Footer (every page):**
About · Open by Design · Open promise · Issues · GitHub · RSS / subscribe · Contact

---

## 2. Audience lanes → entry points

| Reader | Wants | Primary path |
|---|---|---|
| **Engineer** | "Can I run it tonight?" | Home hero → **Engine** (quickstart + terminal) → GitHub |
| **Curious / builder** | "What can it model?" | Home featured trio → **Domain Explorations** → bootstrap a pack |
| **Thinker** | "What's the idea here?" | Home → **Thesis** (story) → **Perspectives** (library) → subscribe |
| **Champion** | "When do we need the real thing?" | **Thesis / Engine** → **Platform** (graduation) → book a conversation |

---

## 3. Section detail

### 3.0 Home  *(wireframe-1)*
**Job:** answer "what is it / can I run it" in one screen; route the four lanes.
- **Hero** — headline "Run the open engine tonight."; subhead: no lock-in · full-fidelity export · governed when you graduate; CTAs: *Quickstart* (primary), *View on GitHub*; animated node-edge graph.
- **Featured trio** — flagship (the Engine) + 2 satellites (a domain exploration, a Thesis essay).
- **Latest perspectives** — feed strip of recent essays/dispatches linking to the Perspectives library.
- **Flywheel (5 steps)** — seed → meaning → governance → graduate → compound.
- **Community CTA** + **quiet Platform strip** ("Need governance? → Platform").

> Mid-fi update 2026-06-17: the home page keeps the Thesis entry point, and the latest-content strip now routes to Perspectives.

### 3.1 Engine  *(wireframe-2)* — the flagship, the one property
**Job:** get an engineer from landing to "running it tonight."
- **Hero** — "The Engine — the typed graph you can run locally"; CTAs *Quickstart*, *Download*.
- **Two-column** — *What it is* (typed graph · schema language · storage · export) | *Terminal* quickstart snippet (`$ run it tonight`).
- **Capabilities** — Schema language · Open-standards export (JSON-LD · RDF · CSV) · Public docs.
- **Why open · promise** — public repository + no-rug-pull covenant, stated up front as a trust signal.

### 3.2 Domain Explorations  *(wireframe-3)* — proof by worked models
**Job:** show what the engine can model; let people bootstrap a real graph.
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
**Job:** hold the growing body of essays, graph dispatches, and ratified artifacts without turning Thesis into a blog index.

- **Header** — "Essays, dispatches, and ratified work"; calls out that Thesis is the story and Perspectives is the library.
- **Lanes / filter** — four content views:
  - *All*
  - *Essays* (was "Human Essays")
  - *From the graph* (was "Graph Dispatches")
  - *Ratified* (was "Ratified Artifacts")
- **Provenance tag** — each post keeps a small provenance mark (human-written / from-the-graph / ratified). No "graphcasting" label attached.
- **Subscribe band** — email + RSS.

### 3.5 Community  *(wireframe-5)* — support + telemetry, iceberg model
**Job:** support the silent majority who pull & build; capture adoption signal; avoid a noisy contributor bazaar.
- **Header** — framing: most users pull & build; surface support + telemetry.
- **Cards (2×2)** — Contribute · DCO (contribution guide) · Showcase · register your graph (= adoption telemetry) · Release notes · cadence (90-day freshness; quarterly drops) · Discussions (GitHub Discussions, lowest overhead).
- **Roadmap · the bank** — next drop / planned / banked (from the module + exploration bank).

### 3.6 Platform  *(wireframe-6)* — the quiet graduation path
**Job:** for the "champion," name the one thing the open engine can't do alone, and offer a calm exit to the commercial product.
- **Hero** — "When you need governance"; "which agent changed this record, under what policy, approved by whom?"; "the one question the open engine can't answer alone."
- **Before / after** — *On the open engine* (agents write · graphs run real ops · no audit answer) vs *On the governed platform* (write-back gates · audit traces · approval policies · accumulated intelligence).
- **Single CTA** — "Ready to graduate? → Book a conversation" (links out to the commercial site). One calm CTA only.

---

## 4. Page tree (at a glance)

```
Home  (/)
├─ Engine  (/engine)                         ← flagship · one property
│   ├─ Quickstart / terminal
│   ├─ Capabilities (schema · export · docs)
│   └─ Why open · promise (public repo + no-rug-pull)
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
│   ├─ lanes: All · Essays · From the graph · Ratified
│   ├─ posts (with provenance tags)
│   └─ Subscribe (email + RSS)
├─ Community  (/community)
│   ├─ Contribute · Showcase · Release notes · Discussions
│   └─ Roadmap · the bank
└─ Platform  (/platform)                      ← quiet graduation path
    ├─ the governance question
    ├─ open engine vs governed platform
    └─ Book a conversation  → commercial site
```

---

## 5. Resolved decisions

1. **Middle story section name** → **Thesis** (kept; not renamed).
2. **Graphcasting** → **cut entirely for v1.** No public-facing use anywhere. Revisit only if the term lands internally.
3. **Growing content library** → **Perspectives**.
4. **Perspective lane labels** → *All · Essays · From the graph · Ratified*.

---

## 6. Re-align status (wireframes)

- **thesis.html** — ✅ reworked into a cinematic story page; no longer functions as the primary content index.
- **perspectives.html** — ✅ added as the growing content library with filters and provenance.
- **wireframe-7-perspectives.svg** — ✅ added for the Perspectives library page.
- **volantlabs-sitemap-v2.svg** — ✅ added as the 6-section IA diagram companion to this sitemap.
- **home-midfi.html / index.html** — ✅ latest content strip now points to Perspectives.

> Open hygiene item (not blocking): the sitemap Media nodes on spec `392e552b` (`sitemap-volantpartners-ai.md` + `.svg`) still have no published bytes in FileDrive — that's WorkItem `4e961008`. This rebuilt file should be the one published; if the public name stays `volantlabs.ai`, the graph/FileDrive labels should be renamed in the same governance pass.
