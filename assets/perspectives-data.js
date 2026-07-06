window.PERSPECTIVE_POSTS = [
  {
    "slug": "graph-theory",
    "url": "perspectives/graph-theory.html",
    "kind": "essays",
    "kindLabel": "Essay",
    "title": "The graph is a theory",
    "shortTitle": "The graph is a theory",
    "dek": "Why legibility is the wedge for agentic software, and why the graph should be treated as an executable point of view rather than passive storage.",
    "published": "2026-06-11",
    "displayDate": "June 11, 2026",
    "readingTime": "4 min read",
    "image": {
      "src": "assets/images/graph-theory-thesis.webp",
      "alt": "Radial graph theory diagram with one orange thesis node connecting memory, schema, and governance clusters.",
      "width": 960,
      "height": 540
    },
    "author": "Eddie Austin",
    "provenanceLine": "By Eddie Austin",
    "statusLabel": "Human essay",
    "tags": [
      "Substrate",
      "Legibility",
      "Agentic software"
    ],
    "body": [
      {
        "heading": "A graph is not a filing cabinet",
        "paragraphs": [
          "Most software treats structure as a convenience for storage. Tables hold rows. Documents hold paragraphs. Search gives you a way back into the pile. That helps people retrieve things, but it does not help a system understand what kind of thing it is touching.",
          "A useful graph does something stronger. It says that the relationships are part of the meaning. A supplier does not merely sit near a part; it qualifies, constrains, and changes what the part means. A policy does not merely describe a write path; it can become part of whether that path should run at all."
        ]
      },
      {
        "heading": "Theory becomes executable when the system can test it",
        "paragraphs": [
          "Vellis is interesting because it lets the graph carry a point of view. Types, links, and constraints are not a diagram about the system. They are a theory the system can execute against: this node may connect to that one, this edge carries this implication, this proposed change has to pass this rule.",
          "That is the wedge for agentic software. Agents do not need a larger pile of text. They need a world where the important distinctions are already named, where traversals reveal context, and where uncertain changes have somewhere to slow down."
        ]
      },
      {
        "heading": "Legibility is what lets judgment stay human",
        "paragraphs": [
          "The point is not to automate judgment away. The point is to make the system legible enough that judgment can happen at the right moment. When the graph knows what a thing is, what it depends on, and what policies attach to it, a human can review the meaningful decision instead of auditing the rubble afterward.",
          "That is why the graph is more than storage. It is a compact theory of the domain: partial, revisable, and powerful precisely because the system can run it."
        ]
      }
    ],
    "provenance": {
      "source": "Human-written essay for volantlabs.ai Perspectives.",
      "reasoningLayer": "No graph synthesis layer; the graph is referenced as the subject of the essay.",
      "humanRatifier": "Byline accountability: Eddie Austin.",
      "status": "Published essay.",
      "knownUncertainty": "The claim is directional, not a benchmark: it argues for legibility as the wedge rather than proving it is the only wedge.",
      "dissent": "Some systems can get useful agent behavior from retrieval and workflow scaffolding before adopting a graph-native model.",
      "nextFalsifier": "A production agent workflow that remains safe, explainable, and adaptive without explicit domain relationships would weaken the thesis."
    },
    "related": [
      "runtime-controls",
      "open-data"
    ]
  },
  {
    "slug": "runtime-controls",
    "url": "perspectives/runtime-controls.html",
    "kind": "notes",
    "kindLabel": "Field note",
    "title": "Runtime-native controls: policy where execution happens",
    "shortTitle": "Runtime-native controls",
    "dek": "A field note on why governance should sit near the write path, not in a disconnected approval ritual after the fact.",
    "published": "2026-06-04",
    "displayDate": "June 4, 2026",
    "readingTime": "3 min read",
    "image": {
      "src": "assets/images/perspectives/runtime-controls.webp",
      "alt": "Runtime control network diagram with an orange policy gate inspecting graph evidence and routing write outcomes.",
      "width": 1672,
      "height": 941
    },
    "author": null,
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Governance",
      "Controls",
      "Write path"
    ],
    "body": [
      {
        "heading": "Controls that live after execution become paperwork",
        "paragraphs": [
          "A policy that only appears after a system has already changed state is not really controlling the operation. It is documentation. Documentation matters, but it cannot stop the wrong write, route a risky change for approval, or explain why an agent was allowed to act in the first place.",
          "Runtime-native control means the policy is close enough to the execution path to shape what happens. It can inspect the proposed operation, read the graph context, and decide whether the action proceeds, degrades, queues for review, or stops."
        ]
      },
      {
        "heading": "The graph gives policy something to inspect",
        "paragraphs": [
          "Rules become much more useful when they can ask graph-shaped questions. What tenant owns this record? Which schema governs this edge? Has a human reviewed this source? Does this write cross a boundary that requires an explicit approval?",
          "Those questions are not generic security theater. They are domain questions. The graph makes them available at the moment of action, which is where governance stops being a ceremony and starts becoming a substrate."
        ]
      },
      {
        "heading": "The audit trail should be a byproduct",
        "paragraphs": [
          "When controls run at execution time, the audit record becomes a natural residue of the decision. The system can capture who or what proposed the change, which policy applied, what evidence was consulted, and how the final decision was made.",
          "That is a quieter, stronger promise than bolting an approval log onto an opaque process. The trace is useful because it was born inside the control loop."
        ]
      }
    ],
    "provenance": {
      "source": "Drawn from Volant Labs governance and site architecture notes.",
      "reasoningLayer": "Edited from internal positioning notes for public launch copy.",
      "humanRatifier": "Editorial review by Volant Labs.",
      "status": "Published field note.",
      "knownUncertainty": "This dispatch states the operating model but does not yet name a production customer implementation.",
      "dissent": "Some regulated environments may still require external approval ceremonies even when runtime controls exist.",
      "nextFalsifier": "A disconnected approval process that reliably prevents unsafe agent writes at scale would weaken the argument."
    },
    "related": [
      "graph-theory",
      "open-data"
    ]
  },
  {
    "slug": "open-data",
    "url": "perspectives/open-data.html",
    "kind": "notes",
    "kindLabel": "Field note",
    "title": "Open data, proprietary intelligence",
    "shortTitle": "Open data, proprietary intelligence",
    "dek": "The line that lets Vellis stay open while proprietary operational intelligence compounds inside each organization.",
    "published": "2026-05-27",
    "displayDate": "May 27, 2026",
    "readingTime": "4 min read",
    "image": {
      "src": "assets/images/perspectives/open-data.webp",
      "alt": "Layered graph stack showing private organization graphs above an open substrate with open-format export rails.",
      "width": 1672,
      "height": 941
    },
    "author": null,
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Vellis",
      "Portability",
      "Compounding intelligence"
    ],
    "body": [
      {
        "heading": "Open does not mean undifferentiated",
        "paragraphs": [
          "The useful boundary is not open versus proprietary. It is substrate versus accumulated intelligence. Vellis can stay open because the substrate is the shared machinery: schema, graph operations, export paths, and the basic affordances that let a team model its world.",
          "The proprietary value appears in the work an organization does with it. Their domain model, policy choices, operating history, reviewed decisions, and learned patterns are not generic infrastructure. They are the compounding record of how that organization thinks and acts."
        ]
      },
      {
        "heading": "Portability is the trust signal",
        "paragraphs": [
          "A system that promises compounding intelligence has to answer a simple fear: what happens if we leave? Vellis answers by keeping the substrate runnable and the export path visible. Full-fidelity export is not a footnote; it is the condition that makes adoption rational.",
          "That is also why production support should not compete with Vellis. Services can add write controls, audit traces, approvals, and enterprise controls. They should not make the open substrate feel like bait."
        ]
      },
      {
        "heading": "The line makes both sides stronger",
        "paragraphs": [
          "When the open layer is real, more people can inspect, run, and extend the basic model. When the proprietary layer is respected, organizations can invest in their own operational graph without feeling that their intelligence is being laundered into a vendor moat.",
          "The result is a healthier bargain: open data mechanics, proprietary intelligence where it actually belongs, and a graduation path that adds governance without rewriting the user's world."
        ]
      }
    ],
    "provenance": {
      "source": "Drawn from Volant Labs site architecture and open/governed boundary notes.",
      "reasoningLayer": "Edited from internal positioning notes for public launch copy.",
      "humanRatifier": "Editorial review by Volant Labs.",
      "status": "Published field note.",
      "knownUncertainty": "The boundary will need sharper examples as real deployments create edge cases.",
      "dissent": "Some open-core models blur this boundary intentionally and still build trust with a different commercial bargain.",
      "nextFalsifier": "A platform path that requires proprietary lock-in or lossy export would invalidate the promise."
    },
    "related": [
      "no-rug-pull-license",
      "runtime-controls"
    ]
  },
  {
    "slug": "legibility-wedge",
    "url": "perspectives/legibility-wedge.html",
    "kind": "essays",
    "kindLabel": "Essay",
    "title": "Legibility is the wedge for agentic software",
    "shortTitle": "Legibility is the wedge",
    "dek": "Agents become more useful when the system can show them what things mean, how they relate, and which changes require judgment.",
    "published": "2026-05-19",
    "displayDate": "May 19, 2026",
    "readingTime": "3 min read",
    "image": {
      "src": "assets/images/perspectives/legibility-wedge.webp",
      "alt": "Agent proposal resolving through an orange traversal wedge into accountable customer, policy, record, boundary, and human review graph context.",
      "width": 1672,
      "height": 941
    },
    "author": "Eddie Austin",
    "provenanceLine": "By Eddie Austin",
    "statusLabel": "Human essay",
    "tags": [
      "Agents",
      "Legibility",
      "Human judgment"
    ],
    "body": [
      {
        "heading": "The hard problem is not generation",
        "paragraphs": [
          "Generation keeps getting cheaper. The harder problem is knowing what a generated action would mean inside a real operating system. Which customer does it affect? Which policy applies? Which record would become authoritative if this write succeeds?",
          "Without that legibility, agents remain impressive at the edge and awkward near the core. They can suggest, summarize, and draft, but they struggle to operate where the consequences are connected."
        ]
      },
      {
        "heading": "Legibility changes the shape of delegation",
        "paragraphs": [
          "When the system can expose meaning, delegation becomes more precise. An agent can be allowed to draft one kind of change, blocked from another, and asked to collect human review when a boundary is crossed.",
          "That is a better model than treating autonomy as a slider. The useful question is not how much freedom the agent has in the abstract. It is whether the system can tell what the agent is trying to touch."
        ]
      },
      {
        "heading": "The wedge is narrow on purpose",
        "paragraphs": [
          "Legibility is not the whole product. It is the first crack in the wall. Once a graph can name the domain, carry constraints, and make context traversable, the other pieces have somewhere to attach: policy, memory, approval, audit, and learning.",
          "That is why Vellis begins with structure. The graph makes software more readable to agents and more accountable to humans."
        ]
      }
    ],
    "provenance": {
      "source": "Human-written essay for volantlabs.ai Perspectives.",
      "reasoningLayer": "No graph synthesis layer; the essay reflects Vellis positioning.",
      "humanRatifier": "Byline accountability: Eddie Austin.",
      "status": "Published essay.",
      "knownUncertainty": "The essay emphasizes legibility and does not exhaust other prerequisites for useful agents.",
      "dissent": "Tool quality, evaluation, and interface design can each be the wedge in narrower deployments.",
      "nextFalsifier": "A durable agent system that safely acts in opaque business context would weaken the claim."
    },
    "related": [
      "graph-theory",
      "runtime-controls"
    ]
  },
  {
    "slug": "domain-explorations-matter",
    "url": "perspectives/domain-explorations-matter.html",
    "kind": "notes",
    "kindLabel": "Field note",
    "title": "Why domain explorations matter",
    "shortTitle": "Why domain explorations matter",
    "dek": "A field note on worked models as the bridge between abstract infrastructure and practical adoption.",
    "published": "2026-05-08",
    "displayDate": "May 8, 2026",
    "readingTime": "3 min read",
    "image": {
      "src": "assets/images/perspectives/domain-explorations-matter.webp",
      "alt": "Context graph connected to supply lineage, clinical ontology, manufacturing BOM, and energy topology worked model panels.",
      "width": 1672,
      "height": 941
    },
    "author": null,
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Domain packs",
      "Adoption",
      "Worked models"
    ],
    "body": [
      {
        "heading": "Infrastructure is hard to believe in until it models something",
        "paragraphs": [
          "A graph engine can sound abstract very quickly. Types, edges, export, governance, provenance: all of it is important, and none of it tells a visitor what they can do next.",
          "Domain explorations solve that problem by making the substrate tangible. Aerospace supply lineage, clinical trial ontology, manufacturing bills of materials, energy topology: each one gives Vellis a concrete surface where the reader can see what becomes possible."
        ]
      },
      {
        "heading": "A worked model is a bridge",
        "paragraphs": [
          "The best exploration is not a demo frozen in amber. It is a bridge from curiosity to use. It shows the shape of the domain, names the first useful nodes and links, and gives a builder enough confidence to bootstrap their own version.",
          "That matters because adoption rarely starts with a platform argument. It starts with recognition: this is my mess, and this model can hold it."
        ]
      },
      {
        "heading": "Reference models keep the site practical",
        "paragraphs": [
          "A small set of reference models can create proof without becoming a launch blocker. New domains should follow real builder need, not a content cadence.",
          "That is the role of domain explorations when the boundary is ready: not decoration, but translation."
        ]
      }
    ],
    "provenance": {
      "source": "Drawn from Volant Labs site architecture and domain exploration positioning.",
      "reasoningLayer": "Edited from internal positioning notes for public launch copy.",
      "humanRatifier": "Editorial review by Volant Labs.",
      "status": "Published field note.",
      "knownUncertainty": "The note describes the site strategy rather than measuring exploration-to-adoption conversion.",
      "dissent": "Some builders will prefer raw docs and code before worked domain narratives.",
      "nextFalsifier": "If visitors adopt Vellis without using any domain exploration path, the strategic weight of explorations should be reduced."
    },
    "related": [
      "open-data",
      "legibility-wedge"
    ]
  },
  {
    "slug": "no-rug-pull-license",
    "url": "perspectives/no-rug-pull-license.html",
    "kind": "notes",
    "kindLabel": "Field note",
    "title": "No rug-pull means more than a license",
    "shortTitle": "No rug-pull means more than a license",
    "dek": "A field note on trust signals: Apache licensing, portability, export path, and production support that does not compete with Vellis.",
    "published": "2026-04-29",
    "displayDate": "April 29, 2026",
    "readingTime": "3 min read",
    "image": {
      "src": "assets/images/perspectives/no-rug-pull-license.webp",
      "alt": "Open engine architecture diagram with Apache-2.0 license, export rails, and attached policy, audit, and approval controls.",
      "width": 1672,
      "height": 941
    },
    "author": null,
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Trust",
      "License",
      "Export"
    ],
    "body": [
      {
        "heading": "A license is only the beginning",
        "paragraphs": [
          "A permissive license matters, but it is not the whole trust signal. Users also need to know whether the project remains runnable, whether their data remains portable, and whether the commercial path will quietly make the open path irrelevant.",
          "No rug-pull is a product promise as much as a legal one. It has to show up in the architecture."
        ]
      },
      {
        "heading": "The exit path has to be real",
        "paragraphs": [
          "Full-fidelity export is the operational version of trust. It tells a team that the work they put into modeling their domain is not trapped inside a vendor's future pricing decision.",
          "That promise is strongest when it is boring and visible: open formats, clear docs, and no mysterious downgrade between what Vellis stores and what the user can take with them."
        ]
      },
      {
        "heading": "The platform should graduate, not replace",
        "paragraphs": [
          "Volant Partners support has a real job: write controls, audit traces, approvals, and operational discipline. Those capabilities can justify a commercial relationship without undermining Vellis.",
          "That is the clean bargain. Vellis stays runnable. Production support adds governance when an organization needs it. Nobody has to pretend that trust was solved by a license file alone."
        ]
      }
    ],
    "provenance": {
      "source": "Drawn from Volant Labs site architecture and open/governed boundary notes.",
      "reasoningLayer": "Edited from internal positioning notes for public launch copy.",
      "humanRatifier": "Editorial review by Volant Labs.",
      "status": "Published field note.",
      "knownUncertainty": "The promise should be revisited whenever packaging, access, or deployment mechanics change.",
      "dissent": "A project can be trustworthy with a stronger commercial boundary if it communicates that boundary early and honestly.",
      "nextFalsifier": "Any change that makes Vellis non-runnable or export lossy would break the no-rug-pull claim."
    },
    "related": [
      "open-data",
      "domain-explorations-matter"
    ]
  }
];

window.PERSPECTIVE_MANIFEST = {
  "schemaVersion": "2026-07-06.perspectives.v4",
  "siteUrl": "https://volantlabs.ai",
  "sourceSpecs": [
    {
      "id": "392e552b-5858-475e-a716-31d8f05bc5a6",
      "name": "volantlabs.ai - Site Architecture"
    }
  ],
  "filters": [
    "all",
    "essays",
    "notes"
  ]
};
