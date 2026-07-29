# volantlabs.ai — Perspectives Reader Context Model

**Status:** current public-copy model · **Owner:** Eddie Austin · **Updated:** 2026-07-29
**Graph authority:** Specification `9c3d7e21-5b4a-4f86-a1d9-2e7c6b8f0a34`; accepted amendments `6e4b8d37-2a5c-4f19-8b6d-3c7e9f1a4b28` and `629faf32-a7bd-402b-b42b-0218a5765219`.

---

## Why this exists

Perspectives should feel authored and accountable without making readers parse an internal publication ledger. The byline and **Made with** panel disclose accountable authorship and material assistance. The reader-context box should add information that helps a reader evaluate the argument.

## Public labels

| Kind | Meaning |
|---|---|
| Essay | Human-authored piece with a named byline. |
| Field note | Edited Volant Labs working note, product note, or observation. |
| Artifact *(later)* | A produced document, diagram, or decision record once that workflow is public-ready. |

Avoid graph-authored or formal approval labels in current public copy.

## What Shows Where

**Library card (Perspectives):**

1. Kind pill: Essay / Field note.
2. One accountability line: "By Eddie Austin" or "Volant Labs field note."

**Article page:**

The public reader aid uses:

- Kicker: **A reader's lens**
- Heading: **Questions and counterpoints**
- Open question
- Counterpoint
- What would change our mind

These are the only fields rendered in the box. Source, editorial layer, owner, and status remain in structured content and graph-governance data, but are not repeated in the public presentation.

The same heading and three labels appear in public Markdown summaries so the HTML and machine-readable views stay aligned.

## Filters

Perspectives filters by public kind only: All · Essays · Field notes.

## Future State

The richer graph provenance model remains available in structured data and can return to public presentation when it gives readers information not already conveyed by the byline and **Made with** panel.
