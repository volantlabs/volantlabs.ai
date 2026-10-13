const SCENARIO_MANIFEST = Object.freeze([
  Object.freeze({
    id: "project-memory",
    number: "01",
    name: "Project Memory Under Change",
    available: true,
    entryLabel: "Enter scenario 01",
    status:
      "Project Memory is ready to enter. Its illustrative fixture now uses the exact Everyday Life Core v1 vocabulary and direction contracts.",
  }),
  Object.freeze({
    id: "home-maintenance",
    number: "02",
    name: "Teach Vellis Home Maintenance",
    available: true,
    entryLabel: "Enter scenario 02",
    status:
      "Home Maintenance is ready to explore as an unpublished draft slice. The workspace distinguishes recipe availability, runtime-ready evidence, and explicit governed activation without activating anything.",
  }),
]);

const EVERYDAY_LIFE_CORE = Object.freeze({
  id: "ontology.vellis.everyday_life",
  version: "1",
  anchors: Object.freeze({
    Person: Object.freeze({factsType: "PersonFacts", description: "A person known to the individual or shared graph.", fields: ["name", "relationship?", "preferredContact?", "notes?"]}),
    Group: Object.freeze({factsType: "GroupFacts", description: "A household, family, team, organization, or community.", fields: ["name", "kind?", "description?"]}),
    Area: Object.freeze({factsType: "AreaFacts", description: "An ongoing sphere of responsibility.", fields: ["title", "domain?", "focus?", "active?"]}),
    Goal: Object.freeze({factsType: "GoalFacts", description: "A desired outcome that work or routines may support.", fields: ["title", "domain?", "status?", "priority?", "targetDate?", "desiredOutcome?"]}),
    Project: Object.freeze({factsType: "ProjectFacts", description: "A finite coordinated effort intended to produce an outcome.", fields: ["title", "domain?", "status?", "priority?", "desiredOutcome?", "nextReview?"]}),
    Task: Object.freeze({factsType: "TaskFacts", description: "An actionable unit of work.", fields: ["title", "domain?", "status?", "priority?", "due?", "context?"]}),
    Event: Object.freeze({factsType: "EventFacts", description: "A time-bound occurrence, appointment, or meeting.", fields: ["title", "domain?", "status?", "start?", "end?", "summary?"]}),
    Routine: Object.freeze({factsType: "RoutineFacts", description: "A recurring practice or responsibility.", fields: ["title", "domain?", "cadence?", "active?", "nextDue?", "context?"]}),
    Decision: Object.freeze({factsType: "DecisionFacts", description: "A choice or conclusion worth retaining with rationale.", fields: ["title", "domain?", "status?", "decidedOn?", "rationale?"]}),
    Note: Object.freeze({factsType: "NoteFacts", description: "A captured observation, idea, or piece of context.", fields: ["title", "domain?", "topic?", "summary?", "capturedAt?"]}),
    Resource: Object.freeze({factsType: "ResourceFacts", description: "A document, URL, artifact, or other useful resource.", fields: ["title", "domain?", "kind?", "locator?", "summary?"]}),
    Place: Object.freeze({factsType: "PlaceFacts", description: "A physical or named place relevant to the graph.", fields: ["name", "kind?", "address?", "notes?"]}),
  }),
  links: Object.freeze({
    "belongs_to": Object.freeze({description: "An item belongs to an ongoing area.", source: ["Goal", "Project", "Task", "Event", "Routine", "Decision", "Note", "Resource"], target: ["Area"]}),
    "supports": Object.freeze({description: "An item supports a goal or project.", source: ["Project", "Task", "Event", "Routine", "Decision", "Note", "Resource"], target: ["Goal", "Project"]}),
    "responsible_for": Object.freeze({description: "A person or group is responsible for an area or work item.", source: ["Person", "Group"], target: ["Area", "Goal", "Project", "Task", "Event", "Routine"]}),
    "member_of": Object.freeze({description: "A person is a member of a group.", source: ["Person"], target: ["Group"]}),
    "involves": Object.freeze({description: "An outcome, activity, or decision involves a person or group.", source: ["Goal", "Project", "Task", "Event", "Routine", "Decision"], target: ["Person", "Group"]}),
    "located_at": Object.freeze({description: "An activity or group is associated with a place.", source: ["Task", "Event", "Routine", "Group"], target: ["Place"]}),
    "documents": Object.freeze({description: "A note or resource documents another Core anchor.", source: ["Note", "Resource"], target: ["Person", "Group", "Area", "Goal", "Project", "Task", "Event", "Routine", "Decision", "Note", "Resource", "Place"]}),
    "mentions": Object.freeze({description: "A note mentions another Core anchor.", source: ["Note"], target: ["Person", "Group", "Area", "Goal", "Project", "Task", "Event", "Routine", "Decision", "Note", "Resource", "Place"]}),
    "depends_on": Object.freeze({description: "An outcome or work item depends on another outcome or work item.", source: ["Goal", "Project", "Task"], target: ["Goal", "Project", "Task"]}),
  }),
});

const HOME_MAINTENANCE_SLICE = Object.freeze({
  id: "ontology.vellis.everyday_life.home_maintenance",
  version: "1",
  status: "draft",
  runtimeCompatibility: "ready",
  activationPerformed: false,
  userFactCount: 0,
  anchors: Object.freeze({
    HomeSystem: Object.freeze({
      factsType: "HomeSystemFacts",
      description: "A physical system or installed equipment serving one home Place.",
      fields: ["name", "kind?", "manufacturer?", "model?", "serial_number?", "installed_on?"],
    }),
    MaintenanceIssue: Object.freeze({
      factsType: "MaintenanceIssueFacts",
      description: "An observed home-maintenance problem that may be recorded before diagnosis.",
      fields: ["title", "description?", "observed_on?", "status? · open | monitoring | resolved | unknown"],
    }),
  }),
  links: Object.freeze({
    "home_system_serves_place": Object.freeze({
      description: "A home system serves exactly one home Place.",
      source: ["HomeSystem"],
      target: ["Place"],
      cardinality: "exactly 1 target",
    }),
    "maintenance_issue_at_place": Object.freeze({
      description: "A maintenance issue is observed at exactly one home Place.",
      source: ["MaintenanceIssue"],
      target: ["Place"],
      cardinality: "exactly 1 target",
    }),
    "maintenance_issue_concerns_system": Object.freeze({
      description: "A diagnosed maintenance issue concerns at most one home system.",
      source: ["MaintenanceIssue"],
      target: ["HomeSystem"],
      cardinality: "0..1 target",
    }),
    "maintenance_work_concerns_system": Object.freeze({
      description: "Core work or an occurrence concerns a home system without becoming a new maintenance task type.",
      source: ["Task", "Routine", "Project", "Event"],
      target: ["HomeSystem"],
      cardinality: "optional",
    }),
    "maintenance_work_addresses_issue": Object.freeze({
      description: "Core work or an occurrence is intended to address a maintenance issue.",
      source: ["Task", "Project", "Event"],
      target: ["MaintenanceIssue"],
      cardinality: "optional",
    }),
    "maintenance_decision_concerns_issue": Object.freeze({
      description: "A retained Core decision concerns a maintenance issue.",
      source: ["Decision"],
      target: ["MaintenanceIssue"],
      cardinality: "optional",
    }),
  }),
  governance: Object.freeze({
    core: Object.freeze({
      title: "Everyday Life Core v1",
      description: "Built-in starting vocabulary. The draft slice requires this exact installed identity and does not widen it.",
      contract: "Installed · ontology.vellis.everyday_life · v1",
    }),
    recipe: Object.freeze({
      title: "Recipe available",
      description: "Prompt-first discovery instructions are present for review. Catalog presence does not authorize activation.",
      contract: "Draft recipe · discovery surface · no permission",
    }),
    runtime: Object.freeze({
      title: "Runtime-ready evidence",
      description: "Repository tests exercise additive schema change, validation, snapshot, and replay. This is compatibility evidence, not proof about a live graph.",
      contract: "runtimeCompatibility: ready · blockers: 0",
    }),
    activation: Object.freeze({
      title: "Activation not performed",
      description: "Rendering or loading this pack never activates it. A compatible live graph still requires an explicit governed schema-change decision.",
      contract: "10 definitions · 5 constraints · 1 migration · 0 user facts",
    }),
    facts: Object.freeze({
      title: "No user facts created",
      description: "Vocabulary activation is schema-only. Example HomeSystem and MaintenanceIssue records are a later, separately approved operation.",
      contract: "activationUserFactCount: 0",
    }),
  }),
});

const PROJECT_MEMORY_STEPS = [
  {
    name: "Orient",
    title: "Start with the decision the evaluator needs to make.",
    copy: "The accepted model is visible before any proposal. The question stays fixed while the state changes beneath it.",
    action: "Reveal recorded proposal",
    actionContext: "Understand the question and inspect the accepted state.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — composed for product-design validation, not generated by Vellis.",
  },
  {
    name: "Propose",
    title: "Keep proposed knowledge visibly separate from accepted state.",
    copy: "A recorded agent output proposes Decision → documents → Resource. The dashed edge has not become accepted state.",
    action: "Inspect the proposal",
    actionContext: "Compare the dashed proposal with the solid accepted model.",
    provenance: "Recorded agent output",
    provenanceCopy: "Recorded agent output — synthetic proposal prepared before this prototype session; no live inference is running.",
  },
  {
    name: "Inspect",
    title: "Make every endpoint, type, and source inspectable.",
    copy: "The target Resource is allowed, but the source Decision is not. Selection stays synchronized between the model, Core vocabulary, and textual outline.",
    action: "Challenge against contract",
    actionContext: "Inspect the relationship endpoints before evaluation.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — the model demonstrates the planned inspection experience.",
  },
  {
    name: "Challenge",
    title: "Put the governing rule beside the proposed change.",
    copy: "Core v1 permits only Note or Resource as the source of documents. A Decision may be documented, but it cannot originate this link.",
    action: "Show validation result",
    actionContext: "Evaluate whether the proposed target satisfies the candidate contract.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative contract — Vellis-generated evidence is not yet attached to this design prototype.",
  },
  {
    name: "Validate",
    title: "Rejection must prove that accepted state did not move.",
    copy: "The prototype presents equal before and after state tokens and identifies the invalid source direction in plain language.",
    action: "Choose a valid correction",
    actionContext: "Accepted state unchanged — before === after in this illustrative proof.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — equal prototype tokens show the intended no-mutation evidence pattern.",
  },
  {
    name: "Steer",
    title: "The visitor chooses the correction before acceptance.",
    copy: "Reverse the direction so Resource R-22 documents Decision D-17. Invalid alternatives remain explainable rather than silently corrected.",
    action: "Confirm correction",
    actionContext: "Choose one direction. Only Resource → documents → Decision satisfies Core v1.",
    provenance: "Browser-local",
    provenanceCopy: "Browser-local — your selection changes only this prototype session.",
  },
  {
    name: "Query",
    title: "Show how the accepted correction changes the answer.",
    copy: "The answer now connects the blocked launch, Maya's ownership, and Resource R-22 through exact Core links and inspectable facts.",
    action: "Inspect audit trail",
    actionContext: "Trace the answer back to the accepted relationship and supporting facts.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — the deterministic query projection is design content, not current Vellis output.",
  },
  {
    name: "Trace",
    title: "Separate mechanical history from explanatory narrative.",
    copy: "The audit preview shows proposal, rejection, correction, and acceptance as distinct events with visible source classes.",
    action: "Compare checkpoints",
    actionContext: "Inspect what changed, why it changed, and which state token followed.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — audit rows define the intended evidence hierarchy for the generated fixture.",
  },
  {
    name: "Recover",
    title: "Return to a known checkpoint and watch the answer follow.",
    copy: "Restore the initial checkpoint. Both the accepted relationship and the evaluator answer return to their earlier state.",
    action: "Restore launch checkpoint",
    actionContext: "Recovery should change the model and answer together, without touching the original fixture.",
    provenance: "Browser-local",
    provenanceCopy: "Browser-local — restore changes only this in-memory prototype state.",
  },
  {
    name: "Continue",
    title: "Make the execution boundary part of the next step.",
    copy: "The visitor can branch and export locally, or continue into the public repository. No browser action is represented as native Vellis execution.",
    action: "Restart guided proof",
    actionContext: "The guided proof is complete. Continue locally or restart from accepted state.",
    provenance: "Browser-local",
    provenanceCopy: "Browser-local — branch and export stay on this device unless you download the file.",
  },
];

const HOME_MAINTENANCE_STEPS = Object.freeze([
  Object.freeze({
    name: "Orient",
    title: "Begin with the schema that is actually installed.",
    copy: "Everyday Life Core v1 is accepted. Home Maintenance remains a separate unpublished draft slice outside the active schema.",
    action: "Discover the draft recipe",
    actionContext: "Separate built-in Core from optional vocabulary.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — the workspace explains authoritative model and descriptor states; it is not connected to a live graph.",
  }),
  Object.freeze({
    name: "Discover",
    title: "Catalog presence makes instructions findable—not executable.",
    copy: "The Home Maintenance recipe is available for review. It describes two anchors and six directed links, but availability grants no activation authority.",
    action: "Inspect the vocabulary",
    actionContext: "Review exactly what the draft slice would add.",
    provenance: "Recorded agent output",
    provenanceCopy: "Recorded agent output — synthetic discovery receipt prepared from the draft recipe descriptor.",
  }),
  Object.freeze({
    name: "Inspect",
    title: "Keep the optional slice visibly separate from Core.",
    copy: "The overlay adds HomeSystem and MaintenanceIssue plus their exact link contracts. Core work, places, decisions, notes, and resources remain Core.",
    action: "Review runtime evidence",
    actionContext: "Inspect the draft definitions and endpoint directions.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — definitions mirror the authoritative draft SysML model.",
  }),
  Object.freeze({
    name: "Verify",
    title: "Runtime-ready describes evidence, not a live graph.",
    copy: "Additive application, validation, snapshot, and replay are tested against compatible Core v1. A particular graph still has to be inspected.",
    action: "Challenge the shortcut",
    actionContext: "Distinguish compatibility evidence from permission and activation.",
    provenance: "Recorded agent output",
    provenanceCopy: "Recorded agent output — synthetic compatibility receipt based on repository evidence, not live execution.",
  }),
  Object.freeze({
    name: "Challenge",
    title: "Reject the claim that runtime-ready means activated.",
    copy: "Catalog presence and runtime-ready evidence cannot move a live schema. The accepted Core state token remains unchanged.",
    action: "Choose the governed next move",
    actionContext: "The draft slice remains outside accepted schema.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — equal state tokens demonstrate the required no-activation boundary.",
  }),
  Object.freeze({
    name: "Decide",
    title: "Choose a schema-only review path.",
    copy: "The safe next move is a staged preview against the complete live schema. Automatic activation and creating examples during vocabulary change both violate the boundary.",
    action: "Confirm review path",
    actionContext: "Select the only option that preserves explicit authorization.",
    provenance: "Browser-local",
    provenanceCopy: "Browser-local — this choice changes only the explanatory preview.",
  }),
  Object.freeze({
    name: "Preview",
    title: "See the exact activation projection without applying it.",
    copy: "A future governed change would carry 10 schema definitions, five constraints, one migration record, and zero user facts.",
    action: "Inspect the state ledger",
    actionContext: "Review the schema-only payload and its fail-closed boundary.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — the projection is design content derived from the draft schema pack; nothing has been staged or applied.",
  }),
  Object.freeze({
    name: "Trace",
    title: "Make each governance state independently legible.",
    copy: "Core installed, recipe available, runtime-ready evidence, and explicit activation are separate facts with separate authority.",
    action: "Close the local preview",
    actionContext: "Verify that no state transition was implied or hidden.",
    provenance: "Illustrative",
    provenanceCopy: "Illustrative — the ledger defines the intended evidence hierarchy for a future generated fixture.",
  }),
  Object.freeze({
    name: "Recover",
    title: "Return to the known Core-only checkpoint.",
    copy: "Discard the browser-local staged preview. The draft slice remains available for review and absent from accepted schema.",
    action: "Restore Core-only checkpoint",
    actionContext: "Recovery changes the preview and explanation together.",
    provenance: "Browser-local",
    provenanceCopy: "Browser-local — restore changes only this in-memory prototype.",
  }),
  Object.freeze({
    name: "Continue",
    title: "Carry the evaluation forward without claiming activation.",
    copy: "Export the browser-local assessment or continue into the public repository. A later agent must still inspect the live graph and request explicit approval.",
    action: "Restart guided proof",
    actionContext: "The draft-slice proof is complete. No schema or user facts changed.",
    provenance: "Browser-local",
    provenanceCopy: "Browser-local — exports stay on this device unless you download the file.",
  }),
]);

let steps = PROJECT_MEMORY_STEPS;

const state = {
  screen: "orientation",
  selectedScenario: "project-memory",
  step: 0,
  modelView: "graph",
  correction: null,
  accepted: false,
  restored: false,
  furthestStep: 0,
  localBranch: false,
};

const phases = [
  {name: "Understand", start: 0, end: 2},
  {name: "Decide", start: 3, end: 5},
  {name: "Prove", start: 6, end: 9},
];

const PROJECT_MEMORY_FOCUS_BY_STEP = [
  "project",
  "decision",
  "task",
  "decision",
  "decision",
  "resource",
  "resource",
  "decision",
  "project",
  "project",
];

const HOME_MAINTENANCE_FOCUS_BY_STEP = [
  "core",
  "recipe",
  "recipe",
  "runtime",
  "activation",
  "activation",
  "activation",
  "runtime",
  "core",
  "core",
];

let focusByStep = PROJECT_MEMORY_FOCUS_BY_STEP;

const elements = {
  orientation: document.getElementById("scenario-orientation"),
  workspaceScreen: document.getElementById("scenario-workspace"),
  orientationTitle: document.getElementById("orientation-title"),
  workspaceTitle: document.getElementById("workspace-title"),
  enterScenario: document.getElementById("enter-scenario"),
  scenarioStatus: document.getElementById("scenario-status"),
  changeScenario: document.getElementById("change-scenario"),
  resetScenario: document.getElementById("reset-scenario"),
  steps: document.getElementById("journey-steps"),
  stepNumber: document.getElementById("step-number"),
  journeyPhase: document.getElementById("journey-phase"),
  journeyProgress: document.getElementById("journey-progress"),
  journeyProgressFill: document.getElementById("journey-progress-fill"),
  stepKicker: document.getElementById("step-kicker"),
  title: document.getElementById("inspector-title"),
  copy: document.getElementById("inspector-copy"),
  provenancePill: document.getElementById("provenance-pill"),
  provenanceCopy: document.getElementById("provenance-copy"),
  primary: document.getElementById("primary-action"),
  previous: document.getElementById("previous-action"),
  actionStep: document.getElementById("action-step"),
  actionContext: document.getElementById("action-context"),
  answer: document.getElementById("answer-summary"),
  modelStage: document.getElementById("model-stage"),
  modelStatus: document.getElementById("model-status"),
  relationshipChip: document.getElementById("relationship-chip"),
  relationshipState: document.getElementById("relationship-state"),
  relationshipLabel: document.getElementById("relationship-label"),
  proposalLine: document.getElementById("proposal-line"),
  outlineRelationship: document.getElementById("outline-relationship"),
  validation: document.getElementById("validation-card"),
  correction: document.getElementById("correction-card"),
  correctionFeedback: document.getElementById("correction-feedback"),
  stateTitle: document.getElementById("state-title"),
  stateCopy: document.getElementById("state-copy"),
  audit: document.getElementById("audit-card"),
  auditEvents: document.getElementById("audit-events"),
  continuation: document.getElementById("continuation-panel"),
  continuationStatus: document.getElementById("continuation-status"),
  schemaKind: document.getElementById("schema-detail-kind"),
  schemaTitle: document.getElementById("schema-detail-title"),
  schemaDescription: document.getElementById("schema-detail-description"),
  schemaContract: document.getElementById("schema-detail-contract"),
  workspaceKicker: document.getElementById("workspace-scenario-kicker"),
  workspaceIntro: document.getElementById("workspace-intro-copy"),
  evaluatorQuestion: document.getElementById("evaluator-question"),
  modelEyebrow: document.getElementById("model-eyebrow"),
  modelTitle: document.getElementById("model-title"),
  domainSchemaPanel: document.getElementById("domain-schema-panel"),
  graphView: document.getElementById("graph-view"),
  outlineList: document.getElementById("graph-outline-list"),
  validationTitle: document.getElementById("validation-title"),
  validationCopy: document.getElementById("validation-copy"),
  checksumBefore: document.getElementById("checksum-before"),
  checksumAfter: document.getElementById("checksum-after"),
  correctionLegend: document.getElementById("correction-legend"),
  correctionOptions: document.getElementById("correction-options"),
  previewFixture: document.getElementById("preview-fixture"),
  previewExecution: document.getElementById("preview-execution"),
  truthDialog: document.getElementById("truth-dialog"),
};

function selectedScenario() {
  return SCENARIO_MANIFEST.find((scenario) => scenario.id === state.selectedScenario)
    ?? SCENARIO_MANIFEST[0];
}

const SCENARIO_WORKSPACES = Object.freeze({
  "project-memory": Object.freeze({
    kicker: "Scenario 01 · Guided proof",
    title: "Project Memory Under Change",
    intro: "Follow the highlighted step. The complete Core v1 vocabulary remains visible while the model, inspector, answer, and next action stay synchronized.",
    question: "Why is the launch blocked, who owns the next action, and what source documents the decision?",
    modelEyebrow: "Accepted project state",
    modelTitle: "Launch readiness model",
    graphLabel: "Synthetic project knowledge graph",
    activeCoreAnchors: ["Person", "Project", "Task", "Decision", "Resource"],
    activeCoreLinks: ["supports", "responsible_for", "involves", "documents"],
    nodes: [
      {key: "project", detailKind: "anchor", detailKey: "Project", type: "Project", title: "Aurora launch", meta: "Blocked"},
      {key: "task", detailKind: "anchor", detailKey: "Task", type: "Task", title: "Security review", meta: "Owner · Maya"},
      {key: "decision", detailKind: "anchor", detailKey: "Decision", type: "Decision", title: "D-17 · Hold launch", meta: "Needs evidence"},
      {key: "resource", detailKind: "anchor", detailKey: "Resource", type: "Resource", title: "R-22 · Threat model", meta: "Reviewed document"},
      {key: "person", detailKind: "anchor", detailKey: "Person", type: "Person", title: "Maya Chen", meta: "Platform owner"},
    ],
    edgeLabels: ["supports", "responsible_for", "involves"],
    paths: [
      "M170 222 C224 148 330 142 400 92",
      "M537 450 C430 390 280 330 170 245",
      "M630 245 C650 310 620 370 580 430",
    ],
    outline: [
      "<strong>Project:</strong> Aurora launch — blocked",
      "<strong>Task:</strong> Security review — owned by Maya Chen",
      "<strong>Decision:</strong> D-17 — hold launch pending evidence",
      "<strong>Resource:</strong> R-22 — reviewed threat model document",
      "<strong>Person:</strong> Maya Chen — platform owner",
      "<strong>Accepted:</strong> Task T-08 → supports → Project Aurora",
      "<strong>Accepted:</strong> Person Maya → responsible_for → Task T-08",
      "<strong>Accepted:</strong> Decision D-17 → involves → Person Maya",
    ],
    validationTitle: "Source type Decision is not allowed for documents.",
    validationCopy: "The source type Decision is not allowed. Core v1 permits <code>Note</code> or <code>Resource</code> as the source. Reverse the relationship so the resource documents the decision.",
    checksum: "proto:8f2c",
    correctionLegend: "Choose the Core-valid direction",
    correctionPrompt: "Select one direction, then confirm the correction.",
    validCorrection: "reverse",
    corrections: [
      {value: "reverse", label: "Resource R-22 → documents → Decision D-17", note: "Reverse direction · valid"},
      {value: "keep-direction", label: "Decision D-17 → documents → Resource R-22", note: "Decision source · invalid"},
      {value: "change-link", label: "Decision D-17 → involves → Resource R-22", note: "Resource target · invalid"},
    ],
    initialDetail: ["anchor", "Project"],
    fixture: "project-memory-under-change · synthetic",
    execution: "browser-local interaction only",
  }),
  "home-maintenance": Object.freeze({
    kicker: "Scenario 02 · Vocabulary boundary",
    title: "Teach Vellis Home Maintenance",
    intro: "Inspect one optional vocabulary slice without confusing discovery, compatibility evidence, or a browser-local preview with governed activation.",
    question: "What exists today, what is runtime-ready, and what still requires explicit authorization?",
    modelEyebrow: "Draft schema boundary",
    modelTitle: "Home Maintenance activation model",
    graphLabel: "Home Maintenance vocabulary governance model",
    activeCoreAnchors: ["Task", "Event", "Routine", "Decision", "Resource", "Place"],
    activeCoreLinks: ["documents"],
    nodes: [
      {key: "core", detailKind: "governance", detailKey: "core", type: "Installed schema", title: "Everyday Life Core v1", meta: "Built in"},
      {key: "recipe", detailKind: "governance", detailKey: "recipe", type: "Discovery", title: "Recipe available", meta: "Draft · reviewable"},
      {key: "runtime", detailKind: "governance", detailKey: "runtime", type: "Compatibility", title: "Runtime-ready evidence", meta: "Tests pass"},
      {key: "activation", detailKind: "governance", detailKey: "activation", type: "Governed change", title: "Activation not performed", meta: "Explicit approval required"},
      {key: "facts", detailKind: "governance", detailKey: "facts", type: "User records", title: "0 user facts", meta: "Schema-only boundary"},
    ],
    edgeLabels: ["requires Core v1", "tested projection", "0 automatic activations"],
    paths: [
      "M170 222 C224 148 330 142 400 92",
      "M630 245 C540 180 475 130 400 92",
      "M630 245 C650 310 620 370 580 430",
    ],
    outline: [
      "<strong>Installed:</strong> Everyday Life Core v1",
      "<strong>Available:</strong> Home Maintenance prompt recipe · draft",
      "<strong>Draft slice:</strong> HomeSystem + MaintenanceIssue",
      "<strong>Directed links:</strong> six optional-slice contracts",
      "<strong>Runtime evidence:</strong> additive change, validation, snapshot, replay tested",
      "<strong>Not established:</strong> compatibility with any particular live graph",
      "<strong>Not performed:</strong> governed activation",
      "<strong>User facts:</strong> zero created by schema activation",
    ],
    validationTitle: "Runtime-ready does not mean activated.",
    validationCopy: "Catalog presence does not authorize activation. Runtime-ready describes repository evidence, not permission or live-graph compatibility. Rendering or loading this pack never activates it.",
    checksum: "schema:core-v1",
    correctionLegend: "Choose the governed next move",
    correctionPrompt: "Select one path, then confirm the review boundary.",
    validCorrection: "stage-only",
    corrections: [
      {value: "stage-only", label: "Review a schema-only staged change", note: "Inspect live schema first · valid"},
      {value: "auto-activate", label: "Activate because runtime-ready", note: "Evidence is not authority · invalid"},
      {value: "create-examples", label: "Create examples while teaching vocabulary", note: "Schema change must create 0 user facts · invalid"},
    ],
    initialDetail: ["governance", "core"],
    fixture: "home-maintenance-v1 · unpublished draft",
    execution: "browser-local governance preview only",
  }),
});

function isHomeScenario() {
  return state.selectedScenario === "home-maintenance";
}

function workspaceConfig() {
  return SCENARIO_WORKSPACES[state.selectedScenario]
    ?? SCENARIO_WORKSPACES["project-memory"];
}

function renderCorrectionOptions() {
  const workspace = workspaceConfig();
  elements.correctionLegend.textContent = workspace.correctionLegend;
  elements.correctionOptions.innerHTML = workspace.corrections.map((option) => `
    <label><input type="radio" name="correction" value="${option.value}" /> ${option.label} <small>${option.note}</small></label>
  `).join("");
  elements.correctionFeedback.textContent = workspace.correctionPrompt;
  document.querySelectorAll('input[name="correction"]').forEach((input) => {
    input.addEventListener("change", () => {
      state.correction = input.value;
      const selected = workspace.corrections.find((option) => option.value === input.value);
      elements.correctionFeedback.textContent = input.value === workspace.validCorrection
        ? isHomeScenario()
          ? "Valid review boundary. Inspect and stage schema-only; do not activate or create facts."
          : "Valid Core direction. Resource R-22 may document Decision D-17."
        : `${selected?.note ?? "Invalid option"} still violates the scenario contract.`;
      render();
    });
  });
}

function applyScenarioWorkspace() {
  const workspace = workspaceConfig();
  steps = isHomeScenario() ? HOME_MAINTENANCE_STEPS : PROJECT_MEMORY_STEPS;
  focusByStep = isHomeScenario()
    ? HOME_MAINTENANCE_FOCUS_BY_STEP
    : PROJECT_MEMORY_FOCUS_BY_STEP;

  elements.workspaceKicker.textContent = workspace.kicker;
  elements.workspaceTitle.textContent = workspace.title;
  elements.workspaceIntro.textContent = workspace.intro;
  elements.evaluatorQuestion.textContent = workspace.question;
  elements.modelEyebrow.textContent = workspace.modelEyebrow;
  elements.modelTitle.textContent = workspace.modelTitle;
  elements.graphView.setAttribute("aria-label", workspace.graphLabel);
  elements.domainSchemaPanel.hidden = !isHomeScenario();
  if (elements.previewFixture) elements.previewFixture.textContent = workspace.fixture;
  if (elements.previewExecution) elements.previewExecution.textContent = workspace.execution;

  document.querySelectorAll("[data-core-anchor]").forEach((button) => {
    button.dataset.coreActive = String(workspace.activeCoreAnchors.includes(button.dataset.coreAnchor));
  });
  document.querySelectorAll("[data-core-link]").forEach((button) => {
    button.dataset.coreActive = String(workspace.activeCoreLinks.includes(button.dataset.coreLink));
  });

  document.querySelectorAll(".graph-node").forEach((button, index) => {
    const node = workspace.nodes[index];
    button.dataset.node = node.key;
    button.dataset.detailKind = node.detailKind;
    button.dataset.detailKey = node.detailKey;
    button.querySelector("span").textContent = node.type;
    button.querySelector("strong").textContent = node.title;
    button.querySelector("small").textContent = node.meta;
  });
  document.querySelectorAll(".edge-label").forEach((label, index) => {
    label.textContent = workspace.edgeLabels[index];
  });
  ["accepted-line-1", "accepted-line-2", "accepted-line-3"].forEach((id, index) => {
    document.getElementById(id).setAttribute("d", workspace.paths[index]);
  });
  elements.outlineList.innerHTML = workspace.outline
    .map((item) => `<li>${item}</li>`)
    .join("") + '<li id="outline-relationship"></li>';
  elements.outlineRelationship = document.getElementById("outline-relationship");

  elements.validationTitle.textContent = workspace.validationTitle;
  elements.validationCopy.innerHTML = workspace.validationCopy;
  elements.checksumBefore.textContent = workspace.checksum;
  elements.checksumAfter.textContent = workspace.checksum;
  renderCorrectionOptions();
  buildStepNavigation();
  renderSchemaDetail(...workspace.initialDetail);
}

function focusScreenHeading(element) {
  window.requestAnimationFrame(() => {
    element.focus({preventScroll: true});
    window.requestAnimationFrame(() => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      }, 0);
    });
  });
}

function renderExperienceShell() {
  const scenario = selectedScenario();
  const workspaceVisible = state.screen === "workspace";

  document.body.dataset.screen = state.screen;
  document.body.dataset.scenario = scenario.id;
  elements.orientation.hidden = workspaceVisible;
  elements.workspaceScreen.hidden = !workspaceVisible;
  elements.changeScenario.hidden = !workspaceVisible;
  elements.resetScenario.hidden = !workspaceVisible;
  elements.scenarioStatus.textContent = scenario.status;
  elements.enterScenario.disabled = !scenario.available;
  elements.enterScenario.querySelector("span").textContent = scenario.entryLabel;

  document.querySelectorAll("[data-scenario-id]").forEach((button) => {
    const isSelected = button.dataset.scenarioId === scenario.id;
    button.setAttribute("aria-pressed", String(isSelected));
    button.dataset.selected = String(isSelected);
  });
}

function selectScenario(scenarioId) {
  const nextScenario = SCENARIO_MANIFEST.find((scenario) => scenario.id === scenarioId);
  if (!nextScenario) return;
  state.selectedScenario = nextScenario.id;
  renderExperienceShell();
}

function enterSelectedScenario() {
  const scenario = selectedScenario();
  if (!scenario.available) return;
  state.screen = "workspace";
  applyScenarioWorkspace();
  resetScenario();
  renderExperienceShell();
  focusScreenHeading(elements.workspaceTitle);
}

function showOrientation() {
  state.screen = "orientation";
  renderExperienceShell();
  focusScreenHeading(elements.orientationTitle);
}

function initializeExperienceShell() {
  document.querySelectorAll("[data-scenario-id]").forEach((button) => {
    button.addEventListener("click", () => selectScenario(button.dataset.scenarioId));
  });
  elements.enterScenario.addEventListener("click", enterSelectedScenario);
  elements.changeScenario.addEventListener("click", showOrientation);

  const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (precisePointer.matches) {
    elements.orientation.addEventListener("pointermove", (event) => {
      const bounds = elements.orientation.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      elements.orientation.style.setProperty("--field-x", x.toFixed(3));
      elements.orientation.style.setProperty("--field-y", y.toFixed(3));
    });
    elements.orientation.addEventListener("pointerleave", () => {
      elements.orientation.style.setProperty("--field-x", "0");
      elements.orientation.style.setProperty("--field-y", "0");
    });
  }
}

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

function currentPhase() {
  return phases.find((phase) => state.step >= phase.start && state.step <= phase.end);
}

function currentModelStatus() {
  if (isHomeScenario()) {
    if (state.restored) return {label: "Core unchanged", state: "restored"};
    if (state.accepted) return {label: "Staged preview", state: "corrected"};
    if (state.step >= 4) return {label: "Not activated", state: "rejected"};
    if (state.step >= 3) return {label: "Runtime-ready", state: "proposed"};
    if (state.step >= 1) return {label: "Draft slice", state: "proposed"};
    return {label: "Core installed", state: "accepted"};
  }
  if (state.restored) return {label: "Restored", state: "restored"};
  if (state.accepted) return {label: "Corrected", state: "corrected"};
  if (state.step >= 4) return {label: "Rejected", state: "rejected"};
  if (state.step >= 1) return {label: "Proposed", state: "proposed"};
  return {label: "Accepted", state: "accepted"};
}

function buildStepNavigation() {
  elements.steps.replaceChildren();
  steps.forEach((step, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.step = String(index);
    button.dataset.phase = phases.find((phase) => index >= phase.start && index <= phase.end)?.name.toLowerCase() ?? "";
    button.innerHTML = `<span>${twoDigits(index + 1)}</span><strong>${step.name}</strong>`;
    button.addEventListener("click", () => goToStep(index));
    item.appendChild(button);
    elements.steps.appendChild(item);
  });
}

function currentAnswer() {
  if (isHomeScenario()) {
    if (state.restored) {
      return "Core v1 remains accepted. Home Maintenance remains an unpublished draft and is not activated.";
    }
    if (state.accepted) {
      return "Safe next move: review a schema-only staged change. Nothing has been activated, and activation would create 0 user facts.";
    }
    if (state.step >= 4) {
      return "Runtime-ready evidence does not authorize activation. The accepted schema is still Core v1.";
    }
    if (state.step >= 3) {
      return "The draft slice has tested compatibility evidence, but this live graph has not been inspected.";
    }
    if (state.step >= 1) {
      return "The Home Maintenance recipe is available for review; its vocabulary is not active.";
    }
    return "Everyday Life Core v1 is installed. Home Maintenance is a separate unpublished draft slice.";
  }
  if (state.restored) {
    return "Restored: D-17 again has no Core-valid source documenting the launch decision.";
  }
  if (state.accepted) {
    return "Launch is blocked by security review. Maya owns the next action. Resource R-22 documents Decision D-17.";
  }
  if (state.step >= 1) {
    return "A proposal exists, but its Decision source violates the Core documents contract.";
  }
  return "The model is incomplete. No Core-valid source documents Decision D-17.";
}

function updateRelationship() {
  const proposalVisible = state.step >= (isHomeScenario() ? 4 : 1) && !state.restored;
  const acceptedVisible = state.accepted && !state.restored;
  elements.relationshipChip.hidden = !proposalVisible;
  elements.proposalLine.style.opacity = proposalVisible ? "1" : "0";
  elements.proposalLine.setAttribute("d", isHomeScenario()
    ? acceptedVisible
      ? "M230 430 C340 370 540 330 630 244"
      : "M630 244 C540 330 340 370 230 430"
    : acceptedVisible
      ? "M230 430 C340 370 540 330 630 244"
      : "M630 244 C540 330 340 370 230 430");
  elements.relationshipChip.dataset.status = acceptedVisible ? "accepted" : state.step >= 4 ? "rejected" : "proposed";
  elements.relationshipState.textContent = acceptedVisible
    ? "Accepted"
    : state.step >= 4 ? "Rejected" : "Proposed";
  if (isHomeScenario()) {
    elements.relationshipLabel.textContent = acceptedVisible
      ? "Explicit review → staged schema-only change"
      : "Runtime-ready → automatic activation";
    elements.outlineRelationship.innerHTML = acceptedVisible
      ? "<strong>Selected path:</strong> inspect live schema → preview schema-only change → request approval"
      : !proposalVisible
        ? "<strong>Accepted state:</strong> catalog metadata only; no activation change is present"
      : state.step >= 4
        ? "<strong>Rejected shortcut:</strong> runtime-ready → automatic activation"
        : "<strong>Unsafe assumption:</strong> runtime-ready → automatic activation";
  } else {
    elements.relationshipLabel.textContent = acceptedVisible
      ? "Resource → documents → Decision"
      : "Decision → documents → Resource";
    elements.outlineRelationship.innerHTML = acceptedVisible
      ? "<strong>Accepted:</strong> Resource R-22 → documents → Decision D-17"
      : !proposalVisible
        ? "<strong>Accepted state:</strong> no documents relationship is recorded between Resource R-22 and Decision D-17"
      : state.step >= 4
        ? "<strong>Rejected proposal:</strong> Decision D-17 → documents → Resource R-22"
        : "<strong>Proposal:</strong> Decision D-17 → documents → Resource R-22";
  }
  document.body.dataset.relationship = acceptedVisible ? "accepted" : state.step >= 4 ? "rejected" : "proposed";
}

function renderAudit() {
  const events = isHomeScenario()
    ? [
      ["10:12", "Draft recipe discovered in catalog", "Recorded agent output"],
      ["10:13", "Runtime-ready repository evidence inspected", "Recorded agent output"],
      ["10:14", "Automatic-activation shortcut rejected", "Illustrative"],
      ["10:15", "Schema-only review path selected; activation not performed", "Browser-local"],
    ]
    : [
      ["09:42", "Decision → documents → Resource proposed", "Recorded agent output"],
      ["09:43", "Core source contract rejected proposal", "Illustrative"],
      ["09:44", "Visitor reversed the relationship direction", "Browser-local"],
      ["09:44", "Resource → documents → Decision accepted", "Illustrative"],
    ];
  elements.auditEvents.innerHTML = events.map(([time, event, source], index) => `
    <li class="${index === 3 && state.restored ? "muted" : ""}">
      <time>${time}</time><span><strong>${event}</strong><small>${source}</small></span>
    </li>
  `).join("");
}

function render() {
  const step = steps[state.step];
  const phase = currentPhase();
  const modelStatus = currentModelStatus();
  document.body.dataset.step = step.name.toLowerCase();
  elements.stepNumber.textContent = twoDigits(state.step + 1);
  elements.journeyPhase.textContent = phase.name;
  elements.journeyProgress.setAttribute("aria-valuenow", String(state.step + 1));
  elements.journeyProgressFill.style.width = `${((state.step + 1) / steps.length) * 100}%`;
  elements.stepKicker.textContent = `${twoDigits(state.step + 1)} · ${step.name}`;
  elements.title.textContent = step.title;
  elements.copy.textContent = step.copy;
  elements.provenancePill.textContent = step.provenance;
  elements.provenancePill.dataset.source = step.provenance.toLowerCase().replaceAll(" ", "-");
  elements.provenanceCopy.textContent = step.provenanceCopy;
  elements.actionContext.textContent = step.actionContext;
  elements.actionStep.textContent = state.step === steps.length - 1
    ? "Complete · Restart available"
    : `Next · ${steps[state.step + 1].name}`;
  elements.answer.textContent = currentAnswer();
  elements.modelStatus.textContent = modelStatus.label;
  elements.modelStatus.dataset.state = modelStatus.state;
  elements.previous.disabled = state.step === 0;
  elements.primary.textContent = state.step === 5 && state.correction
    ? "Confirm correction"
    : step.action;

  for (const button of elements.steps.querySelectorAll("button")) {
    const index = Number(button.dataset.step);
    button.classList.toggle("active", index === state.step);
    button.classList.toggle("complete", index < state.step);
    button.disabled = index > state.furthestStep;
    if (index === state.step) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  }

  document.querySelectorAll("[data-node]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.node === focusByStep[state.step]);
  });
  document.querySelectorAll("[data-governance-state]").forEach((item) => {
    item.classList.toggle("selected", item.dataset.governanceState === focusByStep[state.step]);
  });
  const focusedNode = workspaceConfig().nodes.find(
    (node) => node.key === focusByStep[state.step],
  );
  if (focusedNode) renderSchemaDetail(focusedNode.detailKind, focusedNode.detailKey);

  elements.validation.hidden = state.step !== 4;
  elements.correction.hidden = state.step !== 5;
  elements.audit.hidden = state.step < 7;
  elements.continuation.hidden = state.step !== 9;

  if (state.step === 4) {
    elements.stateTitle.textContent = "Accepted state unchanged";
    elements.stateCopy.textContent = isHomeScenario()
      ? "The schema token remains Core v1 before and after rejecting automatic activation."
      : "Prototype state tokens match before and after rejection. The generated fixture must later prove this with real checksums.";
  } else if (state.accepted && !state.restored) {
    elements.stateTitle.textContent = isHomeScenario()
      ? "Governed review path selected"
      : "Corrected state selected";
    elements.stateCopy.textContent = isHomeScenario()
      ? "The browser shows a schema-only staged preview. No activation or user-fact write occurred."
      : "The prototype now shows Resource R-22 documenting Decision D-17 in the valid Core direction.";
  } else if (state.restored) {
    elements.stateTitle.textContent = isHomeScenario()
      ? "Core-only checkpoint restored"
      : "Launch checkpoint restored";
    elements.stateCopy.textContent = isHomeScenario()
      ? "The staged preview is closed. The draft remains available, unpublished, and inactive."
      : "The correction is removed from the current local view; the original fixture remains immutable.";
  } else {
    elements.stateTitle.textContent = isHomeScenario()
      ? state.step >= 1 ? "Draft outside accepted schema" : "Core v1 installed"
      : state.step >= 1 ? "Proposal outside accepted state" : "Accepted state";
    elements.stateCopy.textContent = isHomeScenario()
      ? state.step >= 1
        ? "The optional slice remains inspectable without becoming active schema."
        : "The installed Core identity is the known starting checkpoint."
      : state.step >= 1
        ? "The dashed candidate edge remains inspectable without changing the model."
        : "The original synthetic fixture is immutable during the guided proof.";
  }

  updateRelationship();
  renderAudit();
}

function goToStep(nextStep) {
  const bounded = Math.max(0, Math.min(steps.length - 1, nextStep));
  if (bounded > state.furthestStep) return;
  state.step = bounded;
  if (state.step < 6) {
    state.accepted = false;
    state.restored = false;
  } else if (state.step < 9) {
    state.accepted = true;
    state.restored = false;
  } else {
    state.accepted = false;
    state.restored = true;
  }
  render();
}

function advanceToStep(nextStep) {
  const bounded = Math.max(0, Math.min(steps.length - 1, nextStep));
  state.furthestStep = Math.max(state.furthestStep, bounded);
  goToStep(bounded);
}

function handlePrimaryAction() {
  if (state.step === 5) {
    if (!state.correction) {
      elements.correctionFeedback.textContent = "Choose a direction before confirming the correction.";
      return;
    }
    if (state.correction !== workspaceConfig().validCorrection) {
      elements.correctionFeedback.textContent = isHomeScenario()
        ? "That path confuses evidence or discovery with activation authority."
        : "That direction does not satisfy the Core documents source contract.";
      return;
    }
    state.accepted = true;
    state.restored = false;
    advanceToStep(6);
    return;
  }
  if (state.step === 8) {
    state.accepted = false;
    state.restored = true;
    advanceToStep(9);
    return;
  }
  if (state.step === 9) {
    resetScenario();
    return;
  }
  advanceToStep(state.step + 1);
}

function resetScenario() {
  Object.assign(state, {
    step: 0,
    correction: null,
    accepted: false,
    restored: false,
    furthestStep: 0,
    localBranch: false,
  });
  document.querySelectorAll('input[name="correction"]').forEach((input) => {
    input.checked = false;
  });
  elements.correctionFeedback.textContent =
    workspaceConfig().correctionPrompt;
  elements.continuationStatus.textContent =
    "No browser-local branch has been created.";
  render();
}

function initializeModelControls() {
  elements.relationshipChip.addEventListener("click", () => {
    if (isHomeScenario()) {
      renderSchemaDetail("governance", "activation");
      return;
    }
    renderSchemaDetail("link", "documents");
  });

  document.querySelectorAll("[data-model-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.modelView = button.dataset.modelView;
      elements.modelStage.dataset.view = state.modelView;
      document.querySelectorAll("[data-model-view]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
    });
  });

  document.querySelectorAll("[data-node]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-node]").forEach((candidate) => candidate.classList.toggle("selected", candidate === button));
      const label = button.querySelector("strong")?.textContent ?? "Selected entity";
      elements.stateTitle.textContent = label;
      elements.stateCopy.textContent = `Selected ${button.dataset.node} in both the graph and textual model.`;
      renderSchemaDetail(button.dataset.detailKind, button.dataset.detailKey);
    });
  });

  document.querySelectorAll("[data-core-anchor]").forEach((button) => {
    button.addEventListener("click", () => renderSchemaDetail("anchor", button.dataset.coreAnchor));
  });

  document.querySelectorAll("[data-core-link]").forEach((button) => {
    button.addEventListener("click", () => renderSchemaDetail("link", button.dataset.coreLink));
  });

  document.querySelectorAll("[data-domain-anchor]").forEach((button) => {
    button.addEventListener("click", () => renderSchemaDetail("domain-anchor", button.dataset.domainAnchor));
  });

  document.querySelectorAll("[data-domain-link]").forEach((button) => {
    button.addEventListener("click", () => renderSchemaDetail("domain-link", button.dataset.domainLink));
  });
}

function renderSchemaDetail(kind, key) {
  const isCoreAnchor = kind === "anchor";
  const isCoreLink = kind === "link";
  const isDomainAnchor = kind === "domain-anchor";
  const isDomainLink = kind === "domain-link";
  const isGovernance = kind === "governance";
  const definition = isCoreAnchor
    ? EVERYDAY_LIFE_CORE.anchors[key]
    : isCoreLink
      ? EVERYDAY_LIFE_CORE.links[key]
      : isDomainAnchor
        ? HOME_MAINTENANCE_SLICE.anchors[key]
        : isDomainLink
          ? HOME_MAINTENANCE_SLICE.links[key]
          : HOME_MAINTENANCE_SLICE.governance[key];
  if (!definition) return;

  document.querySelectorAll("[data-core-anchor], [data-core-link], [data-domain-anchor], [data-domain-link]").forEach((button) => {
    const selected = isCoreAnchor
      ? button.dataset.coreAnchor === key
      : isCoreLink
        ? button.dataset.coreLink === key
        : isDomainAnchor
          ? button.dataset.domainAnchor === key
          : isDomainLink
            ? button.dataset.domainLink === key
            : false;
    button.setAttribute("aria-pressed", String(selected));
  });

  const selector = isCoreAnchor
    ? `[data-core-anchor="${key}"]`
    : isCoreLink
      ? `[data-core-link="${key}"]`
      : isDomainAnchor
        ? `[data-domain-anchor="${key}"]`
        : isDomainLink
          ? `[data-domain-link="${key}"]`
          : null;
  const activeButton = selector ? document.querySelector(selector) : null;
  const active = activeButton?.dataset.coreActive === "true";
  elements.schemaKind.textContent = isGovernance
    ? "Governance state · No automatic transition"
    : isDomainAnchor
      ? "Draft slice anchor · Unpublished"
      : isDomainLink
        ? "Draft slice link · Directed contract"
        : `${isCoreAnchor ? "Core anchor" : "Core link"} · ${active ? "Scenario active" : "Available, inactive"}`;
  elements.schemaTitle.textContent = isGovernance ? definition.title : key;
  elements.schemaDescription.textContent = definition.description;
  elements.schemaContract.textContent = isGovernance
    ? definition.contract
    : isCoreAnchor || isDomainAnchor
    ? `${definition.factsType} · ${definition.fields.join(" · ")}`
    : `${definition.source.join(" | ")} → ${definition.target.join(" | ")}${definition.cardinality ? ` · ${definition.cardinality}` : ""}`;
}

function createBranch() {
  state.localBranch = true;
  elements.continuationStatus.textContent = isHomeScenario()
    ? "Browser-local assessment created from the restored Core-only checkpoint."
    : "Browser-local branch created from the restored launch checkpoint.";
}

function exportBranch() {
  if (!state.localBranch) createBranch();
  const payload = {
    kind: "vellis-scenario-lab-unlisted-preview",
    fixture: state.selectedScenario,
    provenance: "browser-local",
    authoritative: false,
    state: state.restored ? "restored-checkpoint" : "prototype-branch",
    activation_performed: false,
    user_facts_created: 0,
    note: "Design-study export. This is not Vellis state.",
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vellis-scenario-lab-${state.selectedScenario}-assessment.json`;
  link.click();
  URL.revokeObjectURL(url);
  elements.continuationStatus.textContent = "Browser-local design-study branch exported. No data was uploaded.";
}

applyScenarioWorkspace();
initializeExperienceShell();
initializeModelControls();
elements.primary.addEventListener("click", handlePrimaryAction);
elements.previous.addEventListener("click", () => goToStep(state.step - 1));
document.getElementById("show-legend").addEventListener("click", () => elements.truthDialog.showModal());
elements.resetScenario.addEventListener("click", resetScenario);
document.getElementById("create-branch").addEventListener("click", createBranch);
document.getElementById("export-branch").addEventListener("click", exportBranch);
renderExperienceShell();
render();
