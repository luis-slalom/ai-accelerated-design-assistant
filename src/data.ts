import type { Phase, Prompt } from './types';

export interface ActivityDef {
  id: string;
  code: string;
  title: string;
  description: string;
  promptId?: string; // matches a Prompt.id in DEFAULT_PROMPTS
  phaseCode: string;
}

export const ACTIVITY_DEFS: ActivityDef[] = [
  // 01 Context — understand project, users, constraints
  { id: 'ctx-kickoff',    code: '01-A', phaseCode: '01', title: 'Stakeholder kickoff',          description: 'Structured interview to capture goals, risks, non-negotiables, and definition of success', promptId: 'p-ctx-kickoff' },
  { id: 'ctx-research',   code: '01-B', phaseCode: '01', title: 'User research digest',         description: 'Synthesise existing research or lightweight interviews into a 1-page insight brief',       promptId: 'p-ctx-research' },
  { id: 'ctx-heuristic',  code: '01-C', phaseCode: '01', title: 'Heuristic audit',              description: 'Evaluate existing product or touchpoints against recognised UX principles; produce a scored issue list with severity ratings' },
  { id: 'ctx-competitive',code: '01-D', phaseCode: '01', title: 'Competitive & analogous review', description: 'Benchmark 3–5 competitors and 2–3 analogous experiences to identify patterns, gaps, and opportunities' },

  // 02 Capabilities — define user outcomes, not features
  { id: 'cap-jtbd',       code: '02-A', phaseCode: '02', title: 'Jobs-to-be-done mapping',    description: 'For each user type: the job, desired outcome, current pain point, and definition of done', promptId: 'p-cap-jtbd' },
  { id: 'cap-priority',   code: '02-B', phaseCode: '02', title: 'Outcome prioritisation',     description: 'MoSCoW or impact/effort sort with stakeholders; produces a ranked list of user outcomes',  promptId: 'p-cap-priority' },
  { id: 'cap-personas',   code: '02-C', phaseCode: '02', title: 'Persona & segment definition', description: 'Consolidate research into 2–4 validated archetypes with goals, frustrations, and behavioural tendencies' },
  { id: 'cap-blueprint',  code: '02-D', phaseCode: '02', title: 'Service blueprint (as-is)',   description: 'Map the current end-to-end experience across frontstage actions, backstage processes, and supporting systems' },

  // 03 Objects — identify core entities and relationships
  { id: 'obj-discovery',  code: '03-A', phaseCode: '03', title: 'Entity discovery workshop', description: 'Collaborative session to name core things the product creates, stores, or acts on',       promptId: 'p-obj-discovery' },
  { id: 'obj-relations',  code: '03-B', phaseCode: '03', title: 'Relationship mapping',       description: 'Draw how entities relate — ownership, containment, reference; agree cardinality',         promptId: 'p-obj-relations' },
  { id: 'obj-content',    code: '03-C', phaseCode: '03', title: 'Content inventory & audit',  description: 'Catalogue all content types (labels, copy, media) the product needs; flag gaps, duplicates, or tone inconsistencies' },
  { id: 'obj-mentalmodel',code: '03-D', phaseCode: '03', title: 'Mental model mapping',       description: 'Align the user\'s conceptual model of the domain with the system\'s entity model to surface naming and structural conflicts' },

  // 04 Interactions — map flows, states, and edge cases
  { id: 'int-flows',      code: '04-A', phaseCode: '04', title: 'Flow mapping sessions',    description: 'Walk each capability end-to-end; map happy path then empty, error, permission, and loading states', promptId: 'p-int-flows' },
  { id: 'int-states',     code: '04-B', phaseCode: '04', title: 'State audit',              description: 'For every key object and UI component, enumerate all possible states and stress test with edge cases', promptId: 'p-int-states' },
  { id: 'int-wireframes', code: '04-C', phaseCode: '04', title: 'Wireframe / concept review', description: 'Present low-fidelity concepts to stakeholders and capture structured feedback before moving to high-fidelity' },
  { id: 'int-a11y',       code: '04-D', phaseCode: '04', title: 'Accessibility & inclusion check', description: 'Audit flows against WCAG 2.2 AA criteria and document barriers for assistive technology or diverse user needs' },
  { id: 'int-usability',  code: '04-E', phaseCode: '04', title: 'Usability test synthesis',  description: 'Run or analyse 5+ task-based sessions and distil findings into a ranked list of friction points with design recommendations' },

  // 05 Alignment — agree data contracts and API shapes
  { id: 'aln-manifest',   code: '05-A', phaseCode: '05', title: 'Data contract review',        description: 'Design presents what the UI needs per screen; engineering confirms what is available, missing, or costly', promptId: 'p-aln-manifest' },
  { id: 'aln-api',        code: '05-B', phaseCode: '05', title: 'API shape agreement',          description: 'Co-design session to agree request/response shapes and pagination before any code is written',            promptId: 'p-aln-api' },
  { id: 'aln-tokens',     code: '05-C', phaseCode: '05', title: 'Design token & component handoff', description: 'Define and agree the design token set (colours, type, spacing) and component inventory before build starts' },
  { id: 'aln-signoff',    code: '05-D', phaseCode: '05', title: 'Prototype sign-off session',   description: 'Structured walkthrough of the high-fidelity prototype with client and engineering leads; capture open decisions and blockers' },

  // 06 Build — generate code only within defined scope
  { id: 'bld-scope',      code: '06-A', phaseCode: '06', title: 'Scope boundary review',   description: 'Walk the spec and flag anything that exceeds what has been designed or contracted before build starts', promptId: 'p-bld-scope' },
  { id: 'bld-qa',         code: '06-B', phaseCode: '06', title: 'Incremental design QA',   description: 'Design reviews implementation against spec at component level throughout build, not just at the end',   promptId: 'p-bld-qa' },
  { id: 'bld-liveqa',     code: '06-C', phaseCode: '06', title: 'Live UX review',          description: 'Evaluate the deployed product against the approved prototype and log regressions before release' },
  { id: 'bld-metrics',    code: '06-D', phaseCode: '06', title: 'Analytics & success metrics setup', description: 'Confirm instrumentation for agreed KPIs (task completion, error rate, CSAT) is in place and firing correctly' },
];

export const PHASE_TEMPLATES: Omit<Phase, 'id' | 'deliverables' | 'checkpoints' | 'activities' | 'customActivities' | 'notes' | 'status' | 'startedAt' | 'completedAt'>[] = [
  { code: '01', label: 'Context',      description: 'Understand the project, its users, and its constraints before any design work begins' },
  { code: '02', label: 'Capabilities', description: 'Define what users need to be able to do — in outcomes, not features' },
  { code: '03', label: 'Objects',      description: 'Identify and agree the core entities the product creates, stores, and acts on' },
  { code: '04', label: 'Interactions', description: 'Map user flows, component states, and edge cases end-to-end' },
  { code: '05', label: 'Alignment',    description: 'Agree data contracts and API shapes between design and engineering before build' },
  { code: '06', label: 'Build',        description: 'Generate and review code only within the scope that has been designed and contracted' },
  { code: 'U',  label: 'Utility',      description: 'Cross-cutting: research synthesis, decision logs, risk register, retrospectives' },
];

// Expected deliverables per phase — shown as hints in the sidebar
export const PHASE_DELIVERABLE_HINTS: Record<string, string[]> = {
  '01': ['Project brief', 'Assumption register', 'Heuristic audit report', 'Competitive review'],
  '02': ['Capability map', 'Out-of-scope log', 'Personas', 'As-is service blueprint'],
  '03': ['Object model', 'Domain glossary', 'Content inventory', 'Mental model diagram'],
  '04': ['Flow diagrams', 'State inventory', 'Wireframes', 'Accessibility audit', 'Usability report'],
  '05': ['Screen data manifest', 'Contract spec', 'Design tokens', 'Prototype sign-off notes'],
  '06': ['Annotated design specs', 'Deviation log', 'Live UX review report', 'Analytics setup doc'],
  'U':  [],
};

export const PHASE_COLORS: Record<string, { bg: string; text: string }> = {
  '01': { bg: '#E6F1FB', text: '#0C447C' },
  '02': { bg: '#E1F5EE', text: '#085041' },
  '03': { bg: '#EEEDFE', text: '#3C3489' },
  '04': { bg: '#FAEEDA', text: '#633806' },
  '05': { bg: '#FAECE7', text: '#712B13' },
  '06': { bg: '#FBEAF0', text: '#72243E' },
  'U':  { bg: '#F1EFE8', text: '#444441' },
};


export const DEFAULT_PROMPTS: Prompt[] = [

  // ── 01 Context ─────────────────────────────────────────────────────────

  {
    id: 'p-ctx-kickoff',
    level: '01 Context',
    code: '01-A',
    title: 'Stakeholder kickoff',
    description: 'Structured interview to capture goals, risks, non-negotiables, and definition of success.',
    tags: ['kickoff', 'stakeholders', 'discovery'],
    body: `You are facilitating a structured stakeholder kickoff interview. Your goal is to surface goals, risks, non-negotiables, and what success looks like — before any design work begins.

Ask these questions one group at a time. Wait for answers before continuing.

GROUP 1 — Goals and context
- What does success look like in 3 months? In 12 months?
- What problem are we solving, and why does it matter now?
- What has already been tried, and why didn't it work?

GROUP 2 — Risks and non-negotiables
- What would make this project a failure?
- What decisions have already been made that we cannot reverse?
- What are the hard constraints? (deadline, budget, technology, regulatory)

GROUP 3 — Stakeholders and definition of done
- Who has final sign-off on design decisions?
- Who will object to this project, and what will they say?
- How will we know when this phase is complete?

After all answers, produce:

## Stakeholder kickoff summary
**Goals:** [what they want to achieve]
**Non-negotiables:** [what cannot change]
**Key risks:** [what could derail this]
**Definition of success:** [how they'll measure it]
**Open questions:** [what we still don't know]

---
⛔ CHECKPOINT 01-A
Does this summary accurately reflect what was discussed?
Reply YES to confirm, or correct anything before moving forward.`,
  },

  {
    id: 'p-ctx-research',
    level: '01 Context',
    code: '01-B',
    title: 'User research digest',
    description: 'Synthesise existing research or lightweight interviews into a 1-page insight brief.',
    tags: ['research', 'synthesis', 'discovery'],
    body: `Help me synthesise existing research or lightweight interview notes into a 1-page insight brief.

Research type: [FILL — interviews / surveys / support tickets / analytics / usability test notes]
Raw material: [FILL — paste notes, transcripts, or summaries]

Produce the following:

## 1-page insight brief

**Who we're designing for:** [user types, brief description of each]

**What they're trying to do:** [top 3–5 goals or jobs, in their words]

**What's getting in the way:** [friction, workarounds, pain points — ranked by frequency]

**What they value most:** [explicit and implicit priorities]

**What would change their behaviour:** [triggers, motivators, or conditions for adoption]

**Gaps in our knowledge:** [what we still don't know and need to find out]

Keep this to one page. Cite evidence for every claim. Do not make design recommendations — synthesis only.

---
⛔ CHECKPOINT 01-B
Does this brief accurately reflect what the research shows?
Are there any misreadings or missing signals?
Reply YES to confirm.`,
  },

  // ── 02 Capabilities ────────────────────────────────────────────────────

  {
    id: 'p-cap-jtbd',
    level: '02 Capabilities',
    code: '02-A',
    title: 'Jobs-to-be-done mapping',
    description: 'For each user type: the job, desired outcome, current pain point, and definition of done.',
    tags: ['JTBD', 'outcomes', 'users'],
    body: `For each key user type, help me articulate the job they are hiring this product to do.

User types: [FILL — list the user types from your research digest]

For each user type, produce:

## [User type]
**The job:** When [situation], I want to [motivation], so I can [desired outcome].
**Current approach:** How do they do this today? (workarounds, tools, manual steps)
**Pain points:** What is slow, unreliable, expensive, or frustrating about the current approach?
**Definition of done:** How will they know the job is complete?
**Unmet needs:** What do they want that nothing currently provides?

After mapping all user types, identify:
- Where jobs overlap across user types (shared needs)
- Where jobs conflict (design tension points)
- Which jobs are most urgent or highest value

---
⛔ CHECKPOINT 02-A
Do these job statements reflect what users actually said or did — not what we assume?
Reply YES to confirm, or adjust before moving to prioritisation.`,
  },

  {
    id: 'p-cap-priority',
    level: '02 Capabilities',
    code: '02-B',
    title: 'Outcome prioritisation',
    description: 'MoSCoW or impact/effort sort with stakeholders; produces a ranked list of user outcomes.',
    tags: ['prioritisation', 'MoSCoW', 'outcomes'],
    body: `Help me run an outcome prioritisation with stakeholders.

User outcomes to prioritise: [FILL — paste job statements from 02-A or list the outcomes]
Prioritisation method: [FILL — MoSCoW / Impact × Effort / RICE / simple dot-voting]
Stakeholders in the room: [FILL]

For each outcome, assess:
- Business value (high / medium / low)
- User value (high / medium / low)
- Implementation complexity (high / medium / low)
- Risk if we skip it (high / medium / low)

Produce:
1. A ranked list of user outcomes with rationale
2. Must-have outcomes for this iteration (non-negotiable)
3. Should-have outcomes (strong value, still in scope)
4. Could-have outcomes (defer if time is tight)
5. Explicitly out-of-scope outcomes (important to document)

---
⛔ CHECKPOINT 02-B
Has everyone with sign-off authority agreed to this prioritisation?
Any outcomes that feel mis-ranked?
Reply YES to confirm the list is locked, or adjust before we move to object modelling.`,
  },

  // ── 03 Objects ─────────────────────────────────────────────────────────

  {
    id: 'p-obj-discovery',
    level: '03 Objects',
    code: '03-A',
    title: 'Entity discovery workshop',
    description: 'Collaborative session to name core things the product creates, stores, or acts on.',
    tags: ['entities', 'OOUX', 'modelling'],
    body: `Facilitate a collaborative entity discovery session with design, engineering, and product.

Context: [FILL — paste the project brief and capability map]

Our goal is to name every core thing the product creates, stores, or acts on — before designing any screens.

STEP 1 — Noun harvest
List every noun that comes up when describing what the product does. Cast wide — include edge cases.
Nouns identified: [FILL — paste brainstorm output]

STEP 2 — Entity refinement
For each candidate noun, classify it:
- Core entity — has its own lifecycle and identity (keep)
- Attribute — belongs to another entity (assign to parent)
- Role or permission — a person in a context (flag separately)
- Event or action — something that happens, not a thing (discard or model separately)

For each confirmed entity, produce:
- Entity name (singular noun, agreed by all)
- One-line definition
- Key attributes (3–5, not exhaustive)
- Who creates it / who owns it

STEP 3 — Gap check
- Is anything missing from this list?
- Is anything duplicated under different names?
- Does engineering see any entities that design hasn't named?

---
⛔ CHECKPOINT 03-A
Engineering and design must agree on entity names before proceeding.
Reply YES when everyone in the room has confirmed this list.`,
  },

  {
    id: 'p-obj-relations',
    level: '03 Objects',
    code: '03-B',
    title: 'Relationship mapping',
    description: 'Draw how entities relate — ownership, containment, reference; agree cardinality.',
    tags: ['relationships', 'cardinality', 'modelling'],
    body: `For each confirmed entity, map how it relates to every other entity.

Entities to map: [FILL — paste entity list from 03-A]

For each relationship, define:
- Entity A → Entity B
- Relationship type: ownership (A contains B) / reference (A points to B) / membership (A belongs to B)
- Cardinality: one-to-one / one-to-many / many-to-many
- Direction: who creates or controls the relationship?
- Delete behaviour: what happens to B if A is deleted?

Produce:
1. A relationship table:
   Entity A | Relationship | Entity B | Cardinality | Delete behaviour
2. A plain-language description of the model — as if explaining it to a new team member
3. A list of contested or unclear relationships that need a decision

---
⛔ CHECKPOINT 03-B
Relationship mapping has direct implications for data modelling and UI architecture.
Engineering must sign off on cardinality and delete behaviour before we proceed.
Reply YES when both design and engineering agree.`,
  },

  // ── 04 Interactions ────────────────────────────────────────────────────

  {
    id: 'p-int-flows',
    level: '04 Interactions',
    code: '04-A',
    title: 'Flow mapping sessions',
    description: 'Walk each capability end-to-end; map happy path then empty, error, permission, and loading states.',
    tags: ['flows', 'journeys', 'happy path'],
    body: `Walk a capability end-to-end. Map the happy path first, then introduce failure modes.

Capability to map: [FILL — e.g. "A user creates and submits a project brief for the first time"]
User type: [FILL]
Relevant entities: [FILL — paste from object model]

STEP 1 — Happy path
For each step:
- What does the user want to accomplish?
- What does the system do?
- What does the user see? (name the screen state, not a visual design)
- What decision does the user make next?

STEP 2 — Failure modes
For each step, add:
- Empty state — user has no data yet
- Loading state — system is working
- Error state — something went wrong
- Permission state — user cannot do this
- Recovery path — how does the user get back on track?

STEP 3 — Drop-off analysis
Which steps are most likely to cause abandonment, confusion, or error — and why?

Produce a flow table:
Step | User action | System response | Screen state | Failure mode | Recovery

---
⛔ CHECKPOINT 04-A
Happy path and failure modes confirmed?
No steps missing or in the wrong order?
Reply YES to confirm, or adjust.`,
  },

  {
    id: 'p-int-states',
    level: '04 Interactions',
    code: '04-B',
    title: 'State audit',
    description: 'For every key object and UI component, enumerate all possible states and stress test with edge cases.',
    tags: ['states', 'edge cases', 'components'],
    body: `For every key object and UI component in this flow, enumerate all possible states.

Objects and components to audit: [FILL — paste from flow map and object model]

For each, produce a state table:

## [Object or component name]

| State | What triggers it | What the user sees | What the user can do |
|-------|-----------------|-------------------|---------------------|
| Empty | No data exists yet | | |
| Loading | Request in flight | | |
| Populated | Data available | | |
| Error | Request failed | | |
| Partial | Some data, not all | | |
| Locked | No permission | | |
| Archived / Deleted | Object removed | | |

After completing all tables:
- Flag any states that have no design treatment yet
- Flag any states that are technically possible but have no UX decision
- Flag any states that affect other components downstream

---
⛔ CHECKPOINT 04-B
State audit is a joint design + engineering decision.
Every state listed needs a design treatment before any ticket is written.
Reply YES when both sides confirm completeness.`,
  },

  // ── 05 Alignment ───────────────────────────────────────────────────────

  {
    id: 'p-aln-manifest',
    level: '05 Alignment',
    code: '05-A',
    title: 'Data contract review',
    description: 'Design presents what the UI needs per screen; engineering confirms what is available, missing, or costly.',
    tags: ['data', 'API', 'alignment'],
    body: `Design presents what the UI needs per screen. Engineering confirms what is available, what is missing, and what is expensive.

Screen or flow to review: [FILL]
Relevant entities: [FILL — paste from object model]

For each screen, produce a screen data manifest:

## [Screen name]

| Field | Source (API / local / derived) | Required? | Loading behaviour | Fallback if missing |
|-------|-------------------------------|-----------|-------------------|---------------------|

After completing all screens:
- Flag every field that engineering cannot currently provide
- Flag every field that would require a new endpoint or schema change
- Flag every field where the loading or error behaviour is undecided
- List open questions for engineering

---
⛔ CHECKPOINT 05-A
This manifest must be reviewed by engineering before any API work begins.
Design must not assume a field exists until engineering confirms it.
Reply YES when both sides have reviewed and agreed. Disagreements must be documented.`,
  },

  {
    id: 'p-aln-api',
    level: '05 Alignment',
    code: '05-B',
    title: 'API shape agreement',
    description: 'Co-design session to agree request/response shapes and pagination before any code is written.',
    tags: ['API', 'contracts', 'engineering'],
    body: `Co-design the API request/response shapes before any code is written.

Confirmed screens and data manifest: [FILL — paste from 05-A]
Tech stack: [FILL]
Authentication pattern: [FILL]

For each endpoint, define:

## [Action name — e.g. "Create project brief"]

**Endpoint:** [METHOD /path]
**Auth required:** [yes / no / conditional]
**Request payload:** [fields, types, required / optional]
**Success response:** [shape of data returned — fields and types]
**Error responses:** [status code | message | what the UI should show]
**Pagination:** [if applicable — pattern, default page size]
**Open questions for engineering:** [anything unresolved]

After all endpoints are defined:
- Confirm no endpoint requires data that doesn't exist in the object model
- Confirm response shapes match what the UI manifest expects
- Document any endpoints that need a backend schema change

---
⛔ CHECKPOINT 05-B
API shapes must be signed off by both design and engineering.
No build should begin on any endpoint until this contract is agreed.
Reply YES when both sides confirm. Open questions must be resolved first.`,
  },

  // ── 06 Build ───────────────────────────────────────────────────────────

  {
    id: 'p-bld-scope',
    level: '06 Build',
    code: '06-A',
    title: 'Scope boundary review',
    description: 'Walk the spec and flag anything that exceeds what has been designed or contracted before build starts.',
    tags: ['scope', 'review', 'pre-build'],
    body: `Before build begins, walk the full spec and flag anything that exceeds what has been designed, contracted, or agreed.

Spec to review: [FILL — paste handoff notes, annotated designs, or feature description]
Agreed data contracts: [FILL — paste from 05-B]
Accepted user stories / tickets: [FILL]

For each item in the spec, confirm:
- Is this within the agreed object model? (yes / no / edge case)
- Is this supported by an agreed data contract? (yes / no / partial)
- Has a design treatment been agreed for every state? (yes / no)
- Is this within the acceptance criteria? (yes / no)

Flag every item where the answer is no or partial.

For each flagged item:
- Describe the gap
- Recommend: descope / design first / add to contract / accept risk
- Owner for the decision

---
⛔ CHECKPOINT 06-A
Scope boundary review must be completed before a single line of build code is written.
Every flagged item must have a documented resolution.
Reply YES only when all flags are resolved or formally accepted.`,
  },

  {
    id: 'p-bld-qa',
    level: '06 Build',
    code: '06-B',
    title: 'Incremental design QA',
    description: 'Design reviews implementation against spec at component level throughout build, not just at the end.',
    tags: ['QA', 'design review', 'accessibility'],
    body: `Review implementation against spec at the component level. Do not wait until the end.

Component or feature under review: [FILL]
Agreed design spec: [FILL — link or paste annotated designs]
Agreed acceptance criteria: [FILL — paste from alignment phase]

For each component, check:

VISUAL FIDELITY
- [ ] Spacing matches spec (padding, margin, gap)
- [ ] Typography matches (size, weight, line height, colour)
- [ ] Colour tokens correct (no hardcoded values)
- [ ] Icons and assets match spec

BEHAVIOUR
- [ ] All states implemented (empty, loading, error, populated, locked)
- [ ] Interactions match spec (hover, focus, active, disabled)
- [ ] Transitions and motion match spec (or have an agreed deviation)

CONTENT
- [ ] All copy matches approved content
- [ ] Error messages match agreed copy
- [ ] Truncation and overflow handled correctly

ACCESSIBILITY
- [ ] Keyboard navigable
- [ ] Screen reader labels present and correct
- [ ] Colour contrast passes WCAG AA
- [ ] Touch targets ≥ 44px

For every item that fails: document it in the deviation log with severity (critical / major / minor) and an owner.

---
⛔ CHECKPOINT 06-B
Design QA sign-off is required before this component is merged.
Reply YES only when all critical and major items are resolved.`,
  },

  // ── Utility ────────────────────────────────────────────────────────────

  {
    id: 'u-global',
    level: 'Utility',
    code: 'U-00',
    title: 'Global working contract',
    description: 'Establishes AI/human ownership boundaries for any session.',
    tags: ['always-on', 'setup'],
    body: `You are a design-led AI collaborator. You accelerate research, synthesis, prototyping, and scoping — but humans own every decision.

Rules that always apply:
- Never skip ahead to a phase the human hasn't approved
- At the end of every output, summarise what was produced and ask for explicit approval before continuing
- Flag risks and open questions immediately — never bury them
- Design intent must be preserved and stated explicitly in every output
- If you are uncertain whether something is signal or noise, ask`,
  },

  {
    id: 'u-synthesis',
    level: 'Utility',
    code: 'U-01',
    title: 'Research synthesis',
    description: 'Turns raw research material into themes, needs, frustrations, and open questions.',
    tags: ['research', 'synthesis'],
    body: `I have raw research material I need to synthesise.

Research type: [FILL — e.g. user interview transcripts, survey responses, support tickets, usability test notes]

Material: [FILL — paste or attach]

Produce:
1. THEMES — recurring patterns across participants (quote evidence for each)
2. NEEDS — what users are trying to accomplish (separate from what they said they want)
3. FRUSTRATIONS — pain points and friction, ranked by frequency
4. SURPRISES — anything unexpected or that contradicts our current assumptions
5. OPEN QUESTIONS — what we still don't know

Do not make design recommendations. Synthesis only — decisions are made by the designer.

---
⛔ CHECKPOINT U-01
- Do these themes match what you heard in the research?
- Are there any patterns that have been missed or misread?
- Which findings should change our current direction?
Reply YES to confirm the synthesis is accurate.`,
  },

  {
    id: 'u-decision',
    level: 'Utility',
    code: 'U-02',
    title: 'Decision log entry',
    description: 'Captures a design decision with full context, rationale, and review trigger.',
    tags: ['documentation', 'decisions'],
    body: `Help me write a decision log entry for the following decision.

Decision made: [FILL]
Context (why it came up): [FILL]
Options that were considered: [FILL]
Reason this option was chosen: [FILL]
Who approved it: [FILL]
Date: [FILL]

## Decision: [short title]
**Date:** [date]
**Approved by:** [name/role]
**Context:** [why this decision was needed]
**Options considered:** [list]
**Decision:** [what was decided]
**Rationale:** [why]
**Implications:** [what this rules out or makes harder]
**Review trigger:** [what would cause us to revisit this?]`,
  },

  {
    id: 'u-risk',
    level: 'Utility',
    code: 'U-03',
    title: 'Risk and open question log',
    description: 'Logs risks, assumptions, open questions, and dependencies with owner and resolution date.',
    tags: ['risk', 'assumptions', 'documentation'],
    body: `Add the following item to the open questions log.

Item: [FILL]

Classify it as:
- RISK — something that could harm the project if unresolved
- ASSUMPTION — something we're treating as true without evidence
- OPEN QUESTION — something we need an answer to before proceeding
- DEPENDENCY — something outside our control that we're waiting on

## [Short title]
**Type:** [Risk / Assumption / Open question / Dependency]
**Raised by:** [role]
**Date raised:** [date]
**Description:** [what is unknown or risky]
**Impact if unresolved:** [what breaks]
**Owner:** [who is responsible for resolving it]
**Target resolution date:** [date]
**Status:** Open`,
  },

  {
    id: 'u-handoff',
    level: 'Utility',
    code: 'U-04',
    title: 'Phase handoff note',
    description: 'Produces a handoff note at the end of any phase so the next person can continue without losing context.',
    tags: ['handoff', 'documentation'],
    body: `Produce a summary of everything decided and produced in [FILL — phase name and number].

Include:
- What was the goal of this phase?
- What decisions were made? (link to decision log entries)
- What was produced? (list all outputs)
- What was explicitly ruled out of scope?
- What open questions remain?
- What does the next person need to know before they start Phase [N+1]?

Format this as a handoff note that a team member who wasn't present could read and immediately understand the current state and what comes next.

---
⛔ CHECKPOINT U-04
Is this summary accurate and complete?
Would someone new to the project be able to continue from here without losing any context?
Reply YES to confirm. This summary will be saved as the entry point for the next session.`,
  },
];
