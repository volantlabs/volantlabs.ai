# volantlabs.ai — Provenance Display Model (Kind × Status)

**Status:** approved · **Owner:** Eddie Austin · **Date:** 2026-06-17
**Implements:** Principle *Provenance-Disclosed Authorship for External Artifacts* (`2f4a8e6b-1c93-4d57-a8e2-6b9f3c1d4e70`)
**Decision:** *De-brand Graphcasting for v1; ship the provenance authorship norm* (`7b2e9c14-3a6d-4f81-9c52-0e8a4d2f1b67`)

---

## Why this exists

Every public piece on volantlabs.ai discloses how it was made and who stands behind it. This document defines the labeling model so the rule lives in one durable place — not buried in page code, where it drifts the first time someone refactors the feed.

## The fix: two axes, never one

The site previously used a single "lane" list — Essays / From the graph / Ratified — that fused two unrelated ideas. "Essay" and "From the graph" describe *how a piece was authored*; "Ratified" describes *whether a human has signed off*. These are independent: an essay can be ratified, and a graph dispatch can still be an unratified exploration. We keep them on separate axes.

### Axis 1 — Kind (how it was authored)

| Kind | Meaning |
|---|---|
| Essay | Human-written. A person is the author. |
| From the graph | Drafted from graph evidence, reasoned by a model. |
| Artifact *(optional)* | A produced document, diagram, or decision record. |

The Kind already encodes the author system. There is no separate "author-system" label.

### Axis 2 — Status (human accountability)

| Status | Meaning |
|---|---|
| Exploration | Drafted, not yet ratified. |
| Ratified | A named human has reviewed and signed off. |
| Superseded | Replaced by a newer ratified version. |

### How the axes pair

- **Essay** → the byline carries accountability: *"By [name]."* No separate ratification.
- **From the graph / Artifact** → carries a status: *"Exploration"* until *"Ratified by [name]."*

## What shows where

**Library card (Perspectives) — exactly two elements:**

1. Kind pill — Essay / From the graph / Artifact
2. One provenance line — *"By Eddie Austin"* **or** *"Drafted from the graph · Ratified by Eddie Austin"*

Nothing else. No stacked chips. No footer on cards.

**Article / note page — the full provenance footer:**

> Provenance · Reasoning layer · Human ratifier · Status · Known uncertainty · Dissent · Next falsifier

The heavy disclosure lives where the piece is actually read, not in the index.

## Filters

Perspectives filters by **Kind only**: All · Essays · From the graph · (Artifacts). Ratification is shown per-card and in the footer — it is **not** a filter tab.

## In one line

Kind = how it was made. Status = whether a human vouches for it. The card shows both, briefly; the article page shows the full footer.
