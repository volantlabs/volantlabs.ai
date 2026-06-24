# volantlabs.ai — Homepage Above-the-Fold Positioning Brief

**Status:** ratified (approved) 2026-06-22 · hero candidate A implemented · **Owner:** Eddie Austin
**Scope:** `index.html` above-the-fold (hero + first proof strip) — copy and content model, not code.
**Grounded in:** the live site (`client_packs/volant/published_apps/volantlabs.ai/`), Site-Architecture Spec `392e552b`, Provenance Display Model Spec `9c3d7e21`, Positioning-Terminology ADR `d1a2b3c4`.

> One-line ask: the hero should make a smart first-time visitor *want the thing* before we reassure them they can leave with it. Today it does the reverse.

> **Update — 2026-06-24:** Hero **candidate A** adopted (*"One memory your agents share — and you own."*) and implemented in `index.html`. The harness/MCP claim is **confirmed** by the product owner (Vellis works with Claude and Codex, or will), so the "works with Claude/Codex" chip ships without the earlier "pending confirmation" hedge. Codex review caught that the public repo/download path is not live yet, so hero CTAs now use *Request Vellis preview* / *See a worked model*, pointing to a gated preview-access path and Domain Explorations. The open items in §8 are retained as launch checks.

---

## 1. Current diagnosis

**What the homepage does well**
- The visual system is coherent and on-brand: navy/orange, the node-and-edge motif, the animated graph, accessible type. It looks like infrastructure, not a landing-page template.
- The narrative spine already exists and is strong — the Thesis page ("The graph remembers. The model reasons. The human ratifies." / "Capability is abundant. Coherence is scarce.") is the best writing on the site. The homepage doesn't borrow any of its energy.
- The open→governed structure is honest and well-built. The Platform "Same graph. One more layer." before/after is crisp and doesn't oversell.
- The IA is sound: one-property principle, four audience lanes, quiet graduation path. The skeleton is right.

**Where it undersells the technology**
- *The hero leads with a mechanism and a defense, not a capability.* "Give your AI a memory it can reason over" is serviceable but generic — every vector-DB and "memory" startup says some version of it. The actual differentiators (typed graph + schema + runtime governance + harness-agnostic) sit in the subhead or not at all.
- *The three proof bullets are all risk-reversal.* "No lock-in / Full-fidelity export / Governed when you graduate" tell the visitor what *won't* happen to them and what happens *later*. None tells them what they can *do*. Risk-reversal answers an objection the visitor hasn't formed yet — desire has to come first.
- *"Governed when you graduate" actively undercuts the free product in the hero.* It foregrounds the paid upsell on first contact and quietly signals "the real thing costs money." That belongs below the fold.
- *The homepage should make Vellis feel demonstrable, not decorative.* The animated graph needs enough surrounding copy to imply schema, traversal, and "two agents on one memory." The worked Domain Explorations now carry more of that proof burden.
- *The single most exciting story for a 2026 builder — "it works with the agents I already use" — is absent from the entire public site.* Nothing connects "graph" to "my Claude / Codex / MCP workflow."

**Confusion a first-time visitor will have**
- *What category is this?* The hero says "memory," the Engine page says "typed graph infrastructure," the footer says "coordination and integrity substrate." Three different nouns in three places.
- *Can I actually use it now?* The hero now promises preview access, not a public self-serve download. Before switching back to self-serve language, the public repo or release artifact behind the Engine access path must be real.
- *What does this have to do with my AI agents?* The link between "typed graph" and the visitor's actual agent stack is never drawn.
- *Is it open source?* "Vellis," "Open by design," "no rug-pull" are asserted, but no license, no repo, and gated access. Openness is claimed, not demonstrated.

---

## 2. Recommended core positioning

**What is this?**
Vellis is a typed, governable knowledge graph that gives your AI agents a shared memory they can reason over — and that you own and export in full.

**Why should I care?**
Agents, chats, and tools keep forgetting context and disagreeing with each other; Vellis turns that scattered context into one durable, queryable model of your domain that every tool can build on instead of re-explaining from scratch.

**What can I do with it this week?**
Request Vellis preview access, model one real domain in a readable schema, load your first nodes, and run a traversal your agents can reason over — with full-fidelity export from day one.

> Note on the "this week" line: it now assumes gated preview access, not public self-serve access. Swap the CTA to `Run Vellis locally` only after the public repo or release artifact is live.

---

## 3. Hero direction — three candidate H1 / subhead pairs

### A. Capability-forward / harness-agnostic *(recommended primary)*
- **H1:** One memory your agents share — and you own.
- **Subhead:** Vellis is a typed knowledge graph that turns scattered context into a living model your AI can reason over. Model your domain once; let Claude, Codex, and MCP-capable tools build on the same graph — and export everything, anytime.
- **Intended reaction:** A builder juggling several agents thinks *"finally, my tools stop starting from zero every session."* Highest excitement; speaks to a felt 2026 pain.
- **Tradeoff:** Leans on the multi-agent / MCP claim, which must be true in the preview before it ships (see §8). Slightly assumes the visitor already feels the multi-agent problem.

### B. Problem-first / plainest *(recommended safe fallback)*
- **H1:** Stop re-explaining your domain to your AI.
- **Subhead:** Vellis is a typed, governable knowledge graph — a durable model of your domain that agents query instead of guessing from text, and that you own and export in full.
- **Intended reaction:** Anyone who has pasted the same context into a model fifty times nods immediately. Very relatable, zero jargon dependency, no claim that needs verifying.
- **Tradeoff:** Opens on a pain rather than the magic; "knowledge graph" can read enterprise-heavy to the cool-tier / indie builder.

### C. Thesis-forward / visionary
- **H1:** The graph remembers. Your agents reason. You stay in control.
- **Subhead:** Vellis is the typed substrate under agentic systems: meaning that persists across tools, structure your models can traverse, and full ownership with no lock-in.
- **Intended reaction:** The thinker / evaluator gets the worldview in one line; consistent with the (excellent) Thesis page.
- **Tradeoff:** More abstract — a hands-on engineer may still ask "but what do I *do*?" Also echoes the Thesis hero almost verbatim, so the two pages would need to differentiate. Best kept *on* Thesis, not duplicated on Home.

**Recommendation:** ship **A** as the homepage hero for excitement, hold **B** as the A/B alternate (and the safe choice if the MCP claim can't be stood behind at launch), and leave **C** living on the Thesis page where it already works.

---

## 4. Above-the-fold content model

Replace the three risk-reversal ticks (`No lock-in / Full-fidelity export / Governed when you graduate`) with a **capability strip** that says what Vellis *does*, and demote risk-reversal to one quiet line.

**Capability chips (pick 3–4):**

| Chip | Says to the visitor | Verify before shipping? |
|---|---|---|
| Harness-agnostic memory — works with Claude, Codex & MCP-capable tools | "It plugs into what I already use." | **Yes** — confirm preview exposes an MCP/agent interface (§8) |
| Carry context across agents and sessions | "My tools stop forgetting." | Partial — true conceptually; phrase as capability, not a live integration list |
| Model your domain as a typed, queryable graph | "It's structure I can reason over, not a blob." | No — true today |
| Yours to export, in open formats — no lock-in | folds the old promise in, as *one* item not the whole pitch | No — true today (JSON-LD / RDF / CSV) |

**Single quiet trust line under the CTAs** (this is where the old bullets retire to):
> Open by design · full-fidelity export · no rug-pull.

**Show, don't just tell.** The hero figure should become *demonstrative*, not decorative. Cheapest high-impact options, in order:
1. Label the existing animated graph with 3–4 real type names (e.g. `Supplier → Part → Obligation`) so "typed graph" becomes concrete in the first screen.
2. Or a 4-line schema/traversal snippet in the established terminal device (already styled on the Engine page) — e.g. declare two types, one link, one traversal.

**CTAs:** primary should match reality — `Request Vellis preview`; secondary should give an immediate proof click — `See a worked model →` (to Domain Explorations).

---

## 5. Page narrative (recommended first-scroll sequence)

Current order: hero → "Start here" trio → latest perspectives → flywheel → community + quiet platform.

**Recommended order — capability and proof before the upsell:**

1. **Hero** — capability promise (§3A) + a demonstrative graph/schema snippet (§4). Primary CTA *Request Vellis preview*, secondary *See a worked model*.
2. **The stakes, in one band** — borrow the Thesis line: *"Capability is abundant. Coherence is scarce."* Three quick without-it / with-it beats. This is the "why care," and it's already written — reuse it.
3. **What you actually do** — reframe the flywheel as a concrete 3–4 step path: *Request Vellis preview → Model a domain → Connect your agents → Query & reason → Export anytime.*
4. **Pathways** — the four audience lanes as explicit cards (Engineer → Engine · Builder → Domain Explorations · Thinker → Thesis/Perspectives · Evaluator → Platform). This replaces the undifferentiated "Start here" trio with intentional routing the IA already calls for.
5. **Proof by worked models** — a strip of 2–3 Domain Explorations (aerospace supply, clinical-trial ontology…). "Here's a real typed graph," not an abstract claim.
6. **Trust / governance (quiet)** — the open promise + the calm Platform graduation strip. Keep it understated; it's the safety net, not the pitch.
7. **Latest perspectives + subscribe** — credibility and the content flywheel, last.

Net change: the visitor meets *capability → why it matters → what they'd do → where to go → proof* before they ever see the paid layer.

---

## 6. Content-page recommendation

**Yes — elevate a "harness-agnostic memory" story, scoped to current truth.**

This is the strongest unmade argument on the site and the most direct answer to "why is this exciting." It converts the abstract "typed graph" into "this works with the agent tools I already run."

**Its job:** make a builder believe one graph can sit under Claude, Codex, scripts, and MCP-capable tools at once — carrying context, schema, and provenance across all of them.

**Suggested sections (working title "Works anywhere MCP works" / "One memory. Every agent."):**
- Hero: *One memory. Every agent.*
- *How it connects* — MCP endpoint and/or open-standard export; a diagram of multiple agents reading/writing one graph.
- *What carries across* — context, schema, and provenance persist across tools and sessions.
- *Honest boundaries* — what's live in preview vs. planned (no overclaiming).
- CTA: *Request Vellis preview.*

**Sequencing recommendation:** if the public engine exposes an MCP/agent interface to external collaborators, build it as its own page and link it from the hero chip. If only export formats are live today, ship it first as a **"Connect" section on the Engine page** (framed roadmap-honest), and promote it to a standalone page once the interface is publicly demonstrable. Either way, this is the page that makes the homepage hero's harness-agnostic promise land.

---

## 7. Rejected framings (tempting but weaker — avoid)

1. **"Governed when you graduate" in the hero.** Leads with the upsell and signals the free product is a trial. Move governance below the fold; let desire form first.
2. **Risk-reversal as the headline proof ("No lock-in / full-fidelity export").** Answers an objection the visitor hasn't formed. Powerful as a *closer*, weak as an *opener*. Keep it as the one quiet trust line.
3. **"The coordination and integrity substrate for the agentic era."** True to the vision but pure category-jargon; a smart visitor can't picture it. Fine in the footer and on Thesis; fatal in a hero.
4. **"Graph database" / leading with "database."** Accurate-adjacent but drops Vellis into a crowded, commoditized category (Neo4j et al.) and throws away the agent-memory + governance differentiation.
5. **"Run it tonight" / "Quickstart" while access is gated.** Sets an expectation the next click breaks. Either publish openly or change the verb to match reality. Don't promise a download that isn't there.
6. **Reintroducing "Graphcasting"** (bonus). Already cut as a public term per the Site-Architecture spec and sitemap; don't bring it back.

---

## 8. Implementation notes for Codex

**File & workflow**
- Edit the source of truth: `client_packs/volant/published_apps/volantlabs.ai/index.html`. **Do not** edit `data/app_bundles/` (ephemeral). After editing, `just app-sync volantlabs.ai volant published_apps` (or copy to `data/app_bundles/` for local preview).
- This is a homepage-hero PR. Keep the change scoped to the hero + first proof strip unless taking on the §5 reorder as a follow-up.

**Exact edit points in `index.html`**
- Hero block ~lines 151–174. Replace: H1 (line 155), subhead (156), the `.meta-row` ticks (157–161), and adjust the `.cta-row` verbs (162–167).
- `.meta-row` (three ✓ ticks) → convert to capability chips (§4). Reuse existing chip styling — `.chip` exists on `engine.html`/`domain-explorations.html` (`var(--blue-50)` bg, `var(--navy)` text); for small orange text on white use `var(--orange-600)` `#A8491A` for AA.
- Hero CTAs: primary `Request Vellis preview` pointing to the gated contact path; secondary `See a worked model →` pointing to `domain-explorations.html`.
- `<title>` and meta description (lines 20–21) currently say "governed intelligence you can run tonight" — update to match the new hero and the gated-access reality.
- If the hero category noun changes, align the footer tagline (line 315) and keep one category word across Home + Engine + footer.

**Brand facts to preserve (from `README.md` / `assets/site.css`)**
- Type: Montserrat. Color: navy `#001E50`, orange `#D15B21`, orange-600 `#A8491A` (small orange text on white, AA), warm white `#F5F5F5`, charcoal `#333333`, blue-50 `#E6EAF2`, orange-50 `#FEF3ED`.
- Node-and-edge motif only — no stock/3D/clipart. WCAG AA contrast, visible focus, ≥44px targets, global `prefers-reduced-motion`. Tokens live once in `assets/site.css`.
- Keep the no-rug-pull line and the quiet Platform strip — just demote them below capability.

**Honesty constraints (must stay accurate — these are load-bearing)**
- **Access must match the CTA.** `engine.html` (preview-access block) is the source of truth. If the public repo/release is live, the hero may say `Run Vellis locally`; while access is gated, the hero must use a preview-access verb.
- **The "Works with Claude / Codex / MCP" chip needs product confirmation before it ships as a literal claim.** Kesher itself is MCP-native (the platform runs over MCP; Codex already reviews this repo), so the claim is *true of the platform*. Confirm the **public preview engine** exposes an MCP/agent interface to external collaborators. If it doesn't yet, ship the softer, still-true version — "open, agent-readable memory (JSON-LD · RDF · CSV)" — and stage the explicit harness claim for the §6 page when the interface is public.
- **Over-the-air refresh is "planned," not live** (`domain-explorations.html`). Don't imply it's shipping.
- Keep the Provenance Display Model intact where referenced (Spec `9c3d7e21`: Kind = Essay / From the graph / Artifact; Status = Exploration / Ratified / Superseded).

**Graph facts to keep in sync**
- Site-Architecture Spec `392e552b` (six sections, one-property principle, four audience lanes) and the commercial-side positioning term "Platform Architecture" (ADR `d1a2b3c4`) remain canonical. If the hero adopts a new public category word, update Spec `392e552b`'s description in a governance pass — flag as a follow-up, not a blocker for the copy PR.
