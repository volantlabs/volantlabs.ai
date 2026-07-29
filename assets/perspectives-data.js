window.PERSPECTIVE_POSTS = [
  {
    "slug": "adding-my-book-collection-to-vellis",
    "url": "perspectives/adding-my-book-collection-to-vellis.html",
    "kind": "essays",
    "kindLabel": "Essay",
    "title": "Adding My Book Collection to Vellis",
    "shortTitle": "Adding my book collection",
    "dek": "A first-person account of extending Vellis with Book and Collection entities, importing a Goodreads library, and turning personal context into something queryable.",
    "published": "2026-07-29",
    "modified": "2026-07-29",
    "displayDate": "July 29, 2026",
    "readingTime": "5 min read",
    "publicationState": "published",
    "image": {
      "src": "assets/images/perspectives/book-collection-vellis-hero.webp",
      "alt": "A small personal library and catalog resolving into a typed knowledge graph with one orange active path.",
      "width": 1672,
      "height": 941
    },
    "author": "Andrew Forman",
    "authorUrl": "https://www.volantpartners.com/about-us",
    "authorSameAs": [
      "https://www.linkedin.com/in/abforman/",
      "https://github.com/abforman"
    ],
    "subjectMatter": [
      "Personal graph",
      "Schema design",
      "Data import"
    ],
    "provenanceLine": "By Andrew Forman",
    "statusLabel": "Essay",
    "tags": [
      "Personal graph",
      "Schema design",
      "Goodreads"
    ],
    "intro": [
      "I wanted to see what it would take to make my initial Vellis graph more like my own. My first project was something familiar and bounded: adding my personal book collection to my graph, starting with the library I had already tracked in Goodreads.",
      "This was less a formal integration project than an experiment in adapting Vellis to a part of my everyday life. I wanted to ask simple questions such as “Do I already own *Starter Villain* by John Scalzi?” or “Which book comes next in this series?” I also wanted to record changes conversationally—for example, adding several books and setting their reading statuses without editing rows by hand."
    ],
    "body": [
      {
        "heading": "Starting with Goodreads",
        "paragraphs": [
          "Goodreads makes it easy to get a copy of your library. From **My Books**, I went to [**Import and export**](https://www.goodreads.com/review/import) and selected **Export Library**. The resulting CSV includes quite a bit: titles, authors, ISBNs, publishers, publication years, page counts, shelves, reading status, dates, reviews, and ratings.",
          "My goal was not to build a universal bibliographic system or reproduce a formal standard such as [Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/). I wanted a practical personal library built around the information Goodreads already tracked and the questions I was likely to ask."
        ],
        "image": null
      },
      {
        "heading": "Extending the Everyday Life schema",
        "paragraphs": [
          "I started a Claude CLI session on my Raspberry Pi and used the `rtg-schema-design` skill to extend Vellis's [Everyday Life starter schema](../engine.html#quickstart). The central request was simple: add `Collection` and `Book` entities.",
          "`Collection` turned out to be important because “my books” is not a single physical or logical pile. A collection can represent books I own, books borrowed from a public library or another person, books downstairs, books in my office, or books I have loaned to someone else. That gives location and custody a place in the graph without overloading the book itself.",
          "For `Book`, I kept the model broad enough to preserve useful Goodreads data: title and series information; primary and additional authors; ISBN and ISBN-13; publisher, binding, page count, and publication years; reading and added dates; bookshelves and status; and my review and ratings. I added `isbn13` and `series_sequence` after the initial pass.",
          "One deliberate simplification was keeping the author as book metadata rather than linking it to a `Person` entity. Modeling authors as people may become useful later, but I did not need it to make the collection valuable. This was a good reminder that a personal graph does not have to model everything perfectly on day one."
        ],
        "image": {
          "src": "assets/images/perspectives/book-collection-contexts.webp",
          "alt": "A Book entity connected to Owned, Office, Public Library, and Tobias on-loan Collection contexts, with Tobias on-loan emphasized in orange.",
          "width": 1672,
          "height": 941,
          "caption": "The book remains the same object while its collection context carries location or custody."
        }
      },
      {
        "heading": "A useful discovery",
        "paragraphs": [
          "The schema work produced one of the more useful moments in the project. At first, the model tried to update only the JSON representation of the schema rather than the underlying model. The tests caught the mismatch and redirected the work. That gave me more confidence than a change that merely appeared to succeed: the project’s checks were enforcing how schema extensions are supposed to be made."
        ],
        "image": null
      },
      {
        "heading": "Importing the library",
        "paragraphs": [
          "Once the graph schema was updated, I switched back to my Mac and treated the Goodreads import as a script-driven task, starting with a plan. Separating the work into two phases—[first establish the model](graph-theory.html), then import the data—made the process easier to reason about. It also left room to normalize fields and decide how Goodreads shelves, statuses, and series information should map into the graph.",
          "The result is a much more natural way to interact with my library. I can check whether I own a particular title, look for gaps in a numbered series, add the first four *Dungeon Crawler Carl* books while marking the first three as read and the fourth as currently reading, or move *Snow Crash* into a new “Tobias on-loan” collection. With the right series data, I can also ask what comes next in the series I'm reading.",
          "There is still plenty to explore, such as enriching the graph with genre and subgenre data or adding a Goodreads hook to keep additions and reading-status changes synchronized. For now, though, this project has already demonstrated the part of Vellis I was most interested in: [building context I own, can correct, and can keep extending](open-data.html) as my personal graph becomes more useful over time."
        ],
        "image": {
          "src": "assets/images/perspectives/goodreads-to-vellis-process.webp",
          "alt": "Four stages show defining the Book and Collection model, mapping Goodreads CSV fields, importing a Vellis graph, and asking or updating it conversationally.",
          "width": 1672,
          "height": 941,
          "caption": "A model-first workflow keeps the import legible: define, map, import, then ask or update."
        }
      }
    ],
    "provenance": {
      "source": "First-person project diary by Andrew Forman, promoted from the checksum-verified source exploration.",
      "reasoningLayer": "Human-authored account. Page assembly and supporting visual production were assisted by Codex; experiential claims remain the author's testimony.",
      "humanRatifier": "Andrew Forman retains byline accountability; Eddie Austin approved publication on July 29, 2026.",
      "status": "Published after a ratified pre-publication editorial assessment and an approved graph PublishingDecision.",
      "knownUncertainty": "The article documents a personal extension built with Vellis 1.0; implementation details may shift in later versions.",
      "dissent": "A CSV or dedicated library application may be sufficient for readers who do not need cross-domain questions or conversational updates.",
      "nextFalsifier": "If the imported graph cannot reliably answer the named ownership, series, and reading-status questions, the claimed usefulness is not demonstrated."
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
          "label": "Andrew Forman",
          "role": "Accountable author",
          "kind": "person",
          "summary": "experience + final judgment",
          "detail": "Owns the first-person account, its experiential claims, and the final publication judgment.",
          "initials": "AF",
          "avatar": {
            "src": "assets/images/contributors/andrew-forman.png",
            "alt": "Andrew Forman"
          },
          "metrics": []
        },
        {
          "label": "OpenAI Codex",
          "role": "AI production partner",
          "kind": "model",
          "summary": "page assembly + visual production",
          "detail": "Helped turn the approved source into the site page and supporting visuals without owning the underlying experience or final claims.",
          "initials": "AI",
          "avatar": null,
          "metrics": []
        },
        {
          "label": "Graph snapshot",
          "role": "Context graph",
          "kind": "graph",
          "summary": "23,621 nodes / 57,059 links",
          "detail": "The structured context, schema, and relationships available around this publishing workflow. Snapshot shape: 23,621 nodes, 57,059 links, 309 node types, 716 link rules. Context: volant_base; schema tag perspective_made_with_attribution_v1; captured 2026-07-29T13:36:01Z.",
          "initials": "KG",
          "avatar": null,
          "metrics": [
            {
              "value": "23,621",
              "label": "nodes"
            },
            {
              "value": "57,059",
              "label": "links"
            },
            {
              "value": "309",
              "label": "node types"
            },
            {
              "value": "716",
              "label": "link rules"
            }
          ]
        }
      ]
    }
  },
  {
    "slug": "graph-theory",
    "url": "perspectives/graph-theory.html",
    "kind": "essays",
    "kindLabel": "Essay",
    "title": "The graph is a theory",
    "shortTitle": "The graph is a theory",
    "dek": "Why legibility is the wedge for agentic software, and why the graph should be treated as an executable point of view rather than passive storage.",
    "published": "2026-06-11",
    "modified": "2026-07-28",
    "displayDate": "June 11, 2026",
    "readingTime": "4 min read",
    "publicationState": "published",
    "image": {
      "src": "assets/images/graph-theory-thesis.webp",
      "alt": "Radial graph theory diagram with one orange thesis node connecting memory, schema, and governance clusters.",
      "width": 960,
      "height": 540
    },
    "author": "Eddie Austin",
    "authorUrl": "https://github.com/EddieA123-ship-it",
    "authorSameAs": [],
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
    "intro": [],
    "body": [
      {
        "heading": "A graph is not a filing cabinet",
        "paragraphs": [
          "Most software treats structure as a convenience for storage. Tables hold rows. Documents hold paragraphs. Search gives you a way back into the pile. That helps people retrieve things, but it does not help a system understand what kind of thing it is touching.",
          "A useful graph does something stronger. It says the relationships are part of the meaning. A supplier does not merely sit near a part; it qualifies, constrains, and changes what the part means. A policy does not merely describe a [write path](runtime-controls.html); it can decide whether that path runs at all."
        ],
        "image": null
      },
      {
        "heading": "Theory becomes executable when the system can test it",
        "paragraphs": [
          "Vellis lets the graph carry a point of view. In [the Vellis RTG model](../engine.html#rtg-model), types, links, and constraints are not a diagram about the system. They are a theory the system can execute against: this node may connect to that one, this edge carries this implication, this proposed change has to pass this rule. The broader idea that a graph can be checked against explicit conditions also appears in the W3C [Shapes Constraint Language](https://www.w3.org/TR/shacl/), although Vellis uses its own schema model.",
          "That is the wedge for agentic software. Agents do not need a larger pile of text. They need a world where the important distinctions are already named, where traversals reveal context, and where uncertain changes have somewhere to slow down."
        ],
        "image": {
          "src": "assets/images/perspectives/storage-vs-executable-graph.webp",
          "alt": "A split diagram contrasts disconnected tables and documents feeding search with a typed graph routing a proposed change through an emphasized constraint node.",
          "width": 1672,
          "height": 941,
          "caption": "Storage retrieves what was placed inside it; an executable graph can test a proposed change against typed relationships and constraints."
        }
      },
      {
        "heading": "Legibility is what lets judgment stay human",
        "paragraphs": [
          "The point is not to automate judgment away. The point is to make the system legible enough that judgment can happen at the right moment. When the graph knows what a thing is, what it depends on, and what policies attach to it, a human can review the meaningful decision instead of auditing the rubble afterward.",
          "That is why the graph is more than storage. It is a compact theory of the domain: partial, revisable, and powerful precisely because the system can run it."
        ],
        "image": null
      },
      {
        "heading": "A year in, the constraint moved",
        "paragraphs": [
          "A year of actually running the graph this way only reinforced part of the argument. Individual work got easier and faster than expected: the same task now moves with a person from a desk to a phone in a waiting room without losing quality, and a problem that used to take days to notice and fix can get caught and corrected in the same sitting. What hasn't kept up is coordination across a team. When one person can move this fast, staying right on your own stops being the hard part. Staying aligned with everyone else becomes it."
        ],
        "image": null
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
    "modified": "2026-07-28",
    "displayDate": "June 4, 2026",
    "readingTime": "3 min read",
    "publicationState": "published",
    "image": {
      "src": "assets/images/perspectives/runtime-controls.webp",
      "alt": "Runtime control network diagram with an orange policy gate inspecting graph evidence and routing write outcomes.",
      "width": 1672,
      "height": 941
    },
    "author": "Matthew Lou-Magnuson",
    "authorUrl": "https://github.com/skagit",
    "authorSameAs": [
      "https://www.linkedin.com/in/matthew-lou-magnuson-08a5136b/"
    ],
    "subjectMatter": [],
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Governance",
      "Controls",
      "Write path"
    ],
    "intro": [],
    "body": [
      {
        "heading": "Controls that live after execution become paperwork",
        "paragraphs": [
          "A policy that appears only after the system has changed state is not controlling the operation. It is documentation. Documentation matters, but it cannot stop the wrong write, route a risky change for approval, or explain why an agent was allowed to act in the first place.",
          "[Runtime-native control](../platform.html) means the policy is close enough to the execution path to shape what happens. It can inspect the proposed operation, read the graph context, and decide whether the action proceeds, degrades, queues for review, or stops.",
          "In the Volant Labs stack, this marks the boundary between Vellis and the governed production layer. Vellis keeps knowledge explicit, schema-validated, and recoverable. The production layer adds tenant policy, approval paths, and governed audit controls when that knowledge becomes operational infrastructure."
        ],
        "image": {
          "src": "assets/images/perspectives/runtime-control-decision-flow.webp",
          "alt": "A proposed graph write and evidence enter an emphasized runtime policy gate that branches to proceed, queue, or stop while emitting an audit record.",
          "width": 1672,
          "height": 941,
          "caption": "A runtime control sits on the write path: inspect context and policy, then proceed, queue, or stop while producing an audit record."
        }
      },
      {
        "heading": "The graph gives policy something to inspect",
        "paragraphs": [
          "Rules become more useful when they can ask [graph-shaped questions](graph-theory.html). What tenant owns this record? Which schema governs this edge? Has a human reviewed this source? Does this write cross a boundary that requires explicit approval?",
          "Those questions are not security theater. They are domain questions. The graph makes them available at the moment of action, which is where governance stops being a ceremony and becomes a substrate. That lifecycle view aligns with the [NIST AI Risk Management Framework](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/), which treats governance as a cross-cutting function rather than a final checkpoint."
        ],
        "image": null
      },
      {
        "heading": "The audit trail should be a byproduct",
        "paragraphs": [
          "When controls run at execution time, the audit record becomes a natural residue of the decision. The system can capture who or what proposed the change, which policy applied, what evidence was consulted, and how the final decision was made.",
          "That is a quieter, stronger promise than bolting an approval log onto an opaque process. The trace is useful because it was born inside the control loop."
        ],
        "image": null
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
    "modified": "2026-07-28",
    "displayDate": "May 27, 2026",
    "readingTime": "4 min read",
    "publicationState": "published",
    "image": {
      "src": "assets/images/perspectives/open-data.webp",
      "alt": "Layered graph stack showing private organization knowledge above an open substrate with snapshot, restore, and replay paths.",
      "width": 1672,
      "height": 941
    },
    "author": "Andrew Forman",
    "authorUrl": "https://www.volantpartners.com/about-us",
    "authorSameAs": [
      "https://www.linkedin.com/in/abforman/",
      "https://github.com/abforman"
    ],
    "subjectMatter": [],
    "provenanceLine": "Volant Labs field note",
    "statusLabel": "Field note",
    "tags": [
      "Vellis",
      "Portability",
      "Compounding intelligence"
    ],
    "intro": [],
    "body": [
      {
        "heading": "The question an open engine invites",
        "paragraphs": [
          "[Vellis](https://github.com/volantlabs/vellis) is an open graph engine: anyone can run it, inspect it, and keep its state under local control. That openness invites a fair question from both directions. Skeptics ask what stops the open foundation from becoming a dependency once adoption is deep. Adopters ask what is actually theirs if the machinery is shared. The answer is a line, and this note is about where it sits."
        ],
        "image": null
      },
      {
        "heading": "Open does not mean undifferentiated",
        "paragraphs": [
          "The line is not open versus proprietary. It is substrate versus accumulated intelligence. The substrate — schema, graph operations, snapshot and recovery paths, and the basic affordances that let a team model its world — is shared machinery, and Vellis [keeps it open](../engine.html#open-promise).",
          "The proprietary value lives in the work an organization does with that machinery. Their domain model, policy choices, operating history, reviewed decisions, and learned patterns are not generic infrastructure. They are the compounding record of how that organization thinks and acts."
        ],
        "image": {
          "src": "assets/images/perspectives/open-substrate-owned-intelligence.webp",
          "alt": "Three distinct organization-owned graph structures extend one shared open graph substrate through a single emphasized boundary node.",
          "width": 1672,
          "height": 941,
          "caption": "The open substrate is shared machinery; the model, policies, history, and learned patterns above it belong to each organization."
        }
      },
      {
        "heading": "Recoverability is the trust signal",
        "paragraphs": [
          "A system that promises compounding intelligence has to answer a simple fear: can we reconstruct the state we depend on? Vellis answers by keeping the substrate locally runnable and making snapshots, restore, ledger replay, and rebuilt-state verification part of the operating model. Recoverability is not a footnote; it is how ownership becomes testable.",
          "That is why production support should not compete with Vellis. [The governed production path](../platform.html) can add write gates, audit traces, approvals, and enterprise controls. It should not make the open substrate feel like bait."
        ],
        "image": null
      },
      {
        "heading": "The line makes both sides stronger",
        "paragraphs": [
          "When the open layer is real, more people can inspect, run, and extend the basic model. When the proprietary layer is respected, organizations can invest in their own operational graph without worrying that their intelligence is being laundered into a vendor moat.",
          "The result is a healthier bargain: open knowledge mechanics, proprietary intelligence where it belongs, and a graduation path that adds governance without rewriting the organization's world."
        ],
        "image": null
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
