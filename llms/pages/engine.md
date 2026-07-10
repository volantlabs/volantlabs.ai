# Vellis Engine

Canonical URL: https://volantlabs.ai/engine.html
HTML path: /engine.html
Primary audience: engineers and technical evaluators.

## Summary

Vellis is both a reusable AI-native component library and a local RTG knowledge-system application for humans and agents. It separates stable anchors, typed data/fact records, UUID link records, schema validation, and snapshots with ledger replay so agents can share durable operational context without locking the organization into a closed memory layer.

## Use This Page For

- Explaining what Vellis is and what it does.
- Routing users through the documented clone, setup, MCP configuration, validation, state-check, and beta-prompt path.
- Distinguishing typed graph infrastructure from generic document storage or chat memory.

## Key Claims

- Vellis stores typed nodes and edges with enforced structure.
- The RTG model is explained as five parts: schema rules, link records, anchor objects, fact records, and ledger/snapshots.
- Fact records are typed data objects associated with anchors; the raw graph allows zero, one, or many fact records.
- Vellis uses UUID link identity with source and target UUIDs.
- Agents can reason over shared context instead of each holding private fragments.
- The public quickstart mirrors the Vellis README: `just setup`, `just rtg-eval-info`, `just rtg`, `rtg_validate_graph`, `rtg_get_system_state`, then the named life-graph beta prompt.
- Current operation is local. Filesystem and SQLite-backed state, snapshots, restore, and ledger replay provide the documented portability and recovery path.

## Related Pages

- Home: https://volantlabs.ai/
- Thesis: https://volantlabs.ai/thesis.html
- Perspectives: https://volantlabs.ai/perspectives.html
- Platform: https://volantlabs.ai/platform.html
