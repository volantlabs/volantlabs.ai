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
    "subjectMatter": [
      "Substrate",
      "Legibility",
      "Agentic software"
    ],
    "provenanceLine": "By Eddie Austin",
    "statusLabel": "Essay",
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
          "A useful graph does something stronger. It says the relationships are part of the meaning. A supplier does not merely sit near a part; it qualifies, constrains, and changes what the part means. A policy does not merely describe a write path; it can decide whether that path runs at all."
        ]
      },
      {
        "heading": "Theory becomes executable when the system can test it",
        "paragraphs": [
          "Vellis lets the graph carry a point of view. Types, links, and constraints are not a diagram about the system. They are a theory the system can execute against: this node may connect to that one, this edge carries this implication, this proposed change has to pass this rule.",
          "That is the wedge for agentic software. Agents do not need a larger pile of text. They need a world where the important distinctions are already named, where traversals reveal context, and where uncertain changes have somewhere to slow down."
        ]
      },
      {
        "heading": "Legibility is what lets judgment stay human",
        "paragraphs": [
          "The point is not to automate judgment away. The point is to make the system legible enough that judgment can happen at the right moment. When the graph knows what a thing is, what it depends on, and what policies attach to it, a human can review the meaningful decision instead of auditing the rubble afterward.",
          "That is why the graph is more than storage. It is a compact theory of the domain: partial, revisable, and powerful precisely because the system can run it."
        ]
      },
      {
        "heading": "A year in, the constraint moved",
        "paragraphs": [
          "A year of actually running the graph this way only reinforced part of the argument. Individual work got easier and faster than expected: the same task now moves with a person from a desk to a phone in a waiting room without losing quality, and a problem that used to take days to notice and fix can get caught and corrected in the same sitting. What hasn't kept up is coordination across a team. When one person can move this fast, staying right on your own stops being the hard part. Staying aligned with everyone else becomes it."
        ]
      }
    ],
    "provenance": {
      "source": "Human-written essay for volantlabs.ai Perspectives.",
      "reasoningLayer": "Agent-facilitated revision: interviewed by an agent; the added section was drafted from the author's interview answers, then edited directly by the author. No automated synthesis from graph node data.",
      "humanRatifier": "Byline accountability: Eddie Austin.",
      "status": "Published essay.",
      "knownUncertainty": "The claim is directional, not a benchmark: it argues for legibility as the wedge rather than proving it is the only wedge.",
      "dissent": "Some systems can get useful agent behavior from retrieval and workflow scaffolding before adopting a graph-native model.",
      "nextFalsifier": "A production agent workflow that remains safe, explainable, and adaptive without explicit domain relationships would weaken the thesis."
    },
    "related": [
      "runtime-controls",
      "open-data"
    ],
    "madeWith": {
      "label": "Made with",
      "explanation": "Made with separates accountability from assistance. The human author owns the argument and final judgment; models and graph context are named when they materially shaped the published piece.",
      "items": [
        {
          "label": "Eddie Austin",
          "role": "Accountable author",
          "kind": "person",
          "summary": "thesis + final judgment",
          "detail": "Owns the argument, judgment, and final publication decision.",
          "initials": "EA",
          "avatar": {
            "src": "assets/images/contributors/eddie-austin.png",
            "alt": "Eddie Austin"
          },
          "metrics": []
        },
        {
          "label": "Claude Opus 4.8",
          "role": "AI drafting partner",
          "kind": "model",
          "summary": "drafting + simplification",
          "detail": "Helped compress, clarify, and shape the essay language without owning the final claims.",
          "initials": "AI",
          "avatar": null,
          "metrics": []
        },
        {
          "label": "Graph snapshot",
          "role": "Context graph",
          "kind": "graph",
          "summary": "18,951 nodes / 45,005 links",
          "detail": "The structured context, schema, and relationships available around this publishing workflow. Snapshot shape: 18,951 nodes, 45,005 links, 269 node types, 575 link rules. Context: volant_base; schema tag perspective_made_with_attribution_v1; captured 2026-07-08T20:27:33Z.",
          "initials": "KG",
          "avatar": null,
          "metrics": [
            {
              "value": "18,951",
              "label": "nodes"
            },
            {
              "value": "45,005",
              "label": "links"
            },
            {
              "value": "269",
              "label": "node types"
            },
            {
              "value": "575",
              "label": "link rules"
            }
          ]
        }
      ]
    }
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
    "subjectMatter": [],
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
          "A policy that appears only after the system has changed state is not controlling the operation. It is documentation. Documentation matters, but it cannot stop the wrong write, route a risky change for approval, or explain why an agent was allowed to act in the first place.",
          "Runtime-native control means the policy is close enough to the execution path to shape what happens. It can inspect the proposed operation, read the graph context, and decide whether the action proceeds, degrades, queues for review, or stops.",
          "In the Volant Labs stack, this marks the boundary between Vellis and the governed production layer. Vellis keeps knowledge explicit, schema-validated, and recoverable. The production layer adds tenant policy, approval paths, and governed audit controls when that knowledge becomes operational infrastructure."
        ]
      },
      {
        "heading": "The graph gives policy something to inspect",
        "paragraphs": [
          "Rules become more useful when they can ask graph-shaped questions. What tenant owns this record? Which schema governs this edge? Has a human reviewed this source? Does this write cross a boundary that requires explicit approval?",
          "Those questions are not security theater. They are domain questions. The graph makes them available at the moment of action, which is where governance stops being a ceremony and becomes a substrate."
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
      "reasoningLayer": "Edited from internal positioning notes for public site copy.",
      "humanRatifier": "Editorial review by Volant Labs.",
      "status": "Published field note.",
      "knownUncertainty": "This dispatch states the operating model but does not yet name a production customer implementation.",
      "dissent": "Some regulated environments may still require external approval ceremonies even when runtime controls exist.",
      "nextFalsifier": "A disconnected approval process that reliably prevents unsafe agent writes at scale would weaken the argument."
    },
    "related": [
      "graph-theory",
      "open-data"
    ],
    "madeWith": {
      "label": "Made with",
      "explanation": "Made with separates accountability from assistance. The human author owns the argument and final judgment; models and graph context are named when they materially shaped the published piece.",
      "items": [
        {
          "label": "Matthew Lou-Magnuson",
          "role": "Accountable author",
          "kind": "person",
          "summary": "thesis + final judgment",
          "detail": "Owns the argument, judgment, and final publication decision.",
          "initials": "ML",
          "avatar": {
            "src": "assets/images/contributors/matthew-lou-magnuson.png",
            "alt": "Matthew Lou-Magnuson"
          },
          "metrics": []
        },
        {
          "label": "ChatGPT 5.5",
          "role": "AI drafting partner",
          "kind": "model",
          "summary": "drafting + refinement",
          "detail": "Helped draft, refine, and shape the field note language without owning the final claims.",
          "initials": "AI",
          "avatar": null,
          "metrics": []
        },
        {
          "label": "Graph snapshot",
          "role": "Context graph",
          "kind": "graph",
          "summary": "18,951 nodes / 45,005 links",
          "detail": "The structured context, schema, and relationships available around this publishing workflow. Snapshot shape: 18,951 nodes, 45,005 links, 269 node types, 575 link rules. Context: volant_base; schema tag perspective_made_with_attribution_v1; captured 2026-07-08T20:27:33Z.",
          "initials": "KG",
          "avatar": null,
          "metrics": [
            {
              "value": "18,951",
              "label": "nodes"
            },
            {
              "value": "45,005",
              "label": "links"
            },
            {
              "value": "269",
              "label": "node types"
            },
            {
              "value": "575",
              "label": "link rules"
            }
          ]
        }
      ]
    }
  },
  {
    "slug": "open-data",
    "url": "perspectives/open-data.html",
    "kind": "notes",
    "kindLabel": "Field note",
    "title": "Open data, proprietary intelligence",
    "shortTitle": "Open data, proprietary intelligence",
    "dek": "Vellis is an open graph engine. This field note draws the line that keeps it open while the operational intelligence organizations build on it stays their own.",
    "published": "2026-05-27",
    "displayDate": "May 27, 2026",
    "readingTime": "4 min read",
    "image": {
      "src": "assets/images/perspectives/open-data.webp",
      "alt": "Layered graph stack showing private organization knowledge above an open substrate with snapshot, restore, and replay paths.",
      "width": 1672,
      "height": 941
    },
    "author": null,
    "subjectMatter": [],
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Vellis",
      "Portability",
      "Compounding intelligence"
    ],
    "body": [
      {
        "heading": "The question an open engine invites",
        "paragraphs": [
          "Vellis is an open graph engine: anyone can run it, inspect it, and keep its state under local control. That openness invites a fair question from both directions. Skeptics ask what stops the open foundation from becoming a dependency once adoption is deep. Adopters ask what is actually theirs if the machinery is shared. The answer is a line, and this note is about where it sits."
        ]
      },
      {
        "heading": "Open does not mean undifferentiated",
        "paragraphs": [
          "The line is not open versus proprietary. It is substrate versus accumulated intelligence. The substrate — schema, graph operations, snapshot and recovery paths, and the basic affordances that let a team model its world — is shared machinery, and Vellis keeps it open.",
          "The proprietary value lives in the work an organization does with that machinery. Their domain model, policy choices, operating history, reviewed decisions, and learned patterns are not generic infrastructure. They are the compounding record of how that organization thinks and acts."
        ]
      },
      {
        "heading": "Recoverability is the trust signal",
        "paragraphs": [
          "A system that promises compounding intelligence has to answer a simple fear: can we reconstruct the state we depend on? Vellis answers by keeping the substrate locally runnable and making snapshots, restore, ledger replay, and rebuilt-state verification part of the operating model. Recoverability is not a footnote; it is how ownership becomes testable.",
          "That is why production support should not compete with Vellis. Services can add write gates, audit traces, approvals, and enterprise controls. They should not make the open substrate feel like bait."
        ]
      },
      {
        "heading": "The line makes both sides stronger",
        "paragraphs": [
          "When the open layer is real, more people can inspect, run, and extend the basic model. When the proprietary layer is respected, organizations can invest in their own operational graph without worrying that their intelligence is being laundered into a vendor moat.",
          "The result is a healthier bargain: open knowledge mechanics, proprietary intelligence where it belongs, and a graduation path that adds governance without rewriting the organization's world."
        ]
      }
    ],
    "provenance": {
      "source": "Drawn from Volant Labs site architecture and open/governed boundary notes.",
      "reasoningLayer": "Edited from internal positioning notes for public site copy.",
      "humanRatifier": "Editorial review by Volant Labs.",
      "status": "Published field note.",
      "knownUncertainty": "The boundary will need sharper examples as real deployments create edge cases.",
      "dissent": "Some open-core models blur this boundary intentionally and still build trust with a different commercial bargain.",
      "nextFalsifier": "A platform path that requires a proprietary service to run or recover Vellis state would invalidate the promise."
    },
    "related": [
      "runtime-controls",
      "graph-theory"
    ],
    "madeWith": {
      "label": "Made with",
      "explanation": "Made with separates accountability from assistance. The human author owns the argument and final judgment; models and graph context are named when they materially shaped the published piece.",
      "items": [
        {
          "label": "Andrew Forman",
          "role": "Accountable author",
          "kind": "person",
          "summary": "thesis + final judgment",
          "detail": "Owns the argument, judgment, and final publication decision.",
          "initials": "AF",
          "avatar": {
            "src": "assets/images/contributors/andrew-forman.png",
            "alt": "Andrew Forman"
          },
          "metrics": []
        },
        {
          "label": "Fable 5",
          "role": "AI drafting partner",
          "kind": "model",
          "summary": "drafting + refinement",
          "detail": "Helped draft, refine, and shape the field note language without owning the final claims.",
          "initials": "AI",
          "avatar": null,
          "metrics": []
        },
        {
          "label": "Graph snapshot",
          "role": "Context graph",
          "kind": "graph",
          "summary": "18,951 nodes / 45,005 links",
          "detail": "The structured context, schema, and relationships available around this publishing workflow. Snapshot shape: 18,951 nodes, 45,005 links, 269 node types, 575 link rules. Context: volant_base; schema tag perspective_made_with_attribution_v1; captured 2026-07-08T20:27:33Z.",
          "initials": "KG",
          "avatar": null,
          "metrics": [
            {
              "value": "18,951",
              "label": "nodes"
            },
            {
              "value": "45,005",
              "label": "links"
            },
            {
              "value": "269",
              "label": "node types"
            },
            {
              "value": "575",
              "label": "link rules"
            }
          ]
        }
      ]
    }
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
