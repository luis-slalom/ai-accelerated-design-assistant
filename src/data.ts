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
  { id: 'ctx-heuristic',  code: '01-C', phaseCode: '01', title: 'Heuristic audit',              description: 'Evaluate existing product or touchpoints against recognised UX principles; produce a scored issue list with severity ratings', promptId: 'p-ctx-heuristic' },
  { id: 'ctx-competitive',code: '01-D', phaseCode: '01', title: 'Competitive & analogous review', description: 'Benchmark 3–5 competitors and 2–3 analogous experiences to identify patterns, gaps, and opportunities', promptId: 'p-ctx-competitive' },

  // 02 Capabilities — define user outcomes, not features
  { id: 'cap-jtbd',       code: '02-A', phaseCode: '02', title: 'Jobs-to-be-done mapping',    description: 'For each user type: the job, desired outcome, current pain point, and definition of done', promptId: 'p-cap-jtbd' },
  { id: 'cap-priority',   code: '02-B', phaseCode: '02', title: 'Outcome prioritisation',     description: 'MoSCoW or impact/effort sort with stakeholders; produces a ranked list of user outcomes',  promptId: 'p-cap-priority' },
  { id: 'cap-personas',   code: '02-C', phaseCode: '02', title: 'Persona & segment definition', description: 'Consolidate research into 2–4 validated archetypes with goals, frustrations, and behavioural tendencies', promptId: 'p-cap-personas' },
  { id: 'cap-blueprint',  code: '02-D', phaseCode: '02', title: 'Service blueprint (as-is)',   description: 'Map the current end-to-end experience across frontstage actions, backstage processes, and supporting systems', promptId: 'p-cap-blueprint' },

  // 03 Objects — identify core entities and relationships
  { id: 'obj-discovery',  code: '03-A', phaseCode: '03', title: 'Entity discovery workshop', description: 'Collaborative session to name core things the product creates, stores, or acts on',       promptId: 'p-obj-discovery' },
  { id: 'obj-relations',  code: '03-B', phaseCode: '03', title: 'Relationship mapping',       description: 'Draw how entities relate — ownership, containment, reference; agree cardinality',         promptId: 'p-obj-relations' },
  { id: 'obj-content',    code: '03-C', phaseCode: '03', title: 'Content inventory & audit',  description: 'Catalogue all content types (labels, copy, media) the product needs; flag gaps, duplicates, or tone inconsistencies', promptId: 'p-obj-content' },
  { id: 'obj-mentalmodel',code: '03-D', phaseCode: '03', title: 'Mental model mapping',       description: 'Align the user\'s conceptual model of the domain with the system\'s entity model to surface naming and structural conflicts', promptId: 'p-obj-mentalmodel' },

  // 04 Interactions — map flows, states, and edge cases
  { id: 'int-flows',      code: '04-A', phaseCode: '04', title: 'Flow mapping sessions',    description: 'Walk each capability end-to-end; map happy path then empty, error, permission, and loading states', promptId: 'p-int-flows' },
  { id: 'int-states',     code: '04-B', phaseCode: '04', title: 'State audit',              description: 'For every key object and UI component, enumerate all possible states and stress test with edge cases', promptId: 'p-int-states' },
  { id: 'int-wireframes', code: '04-C', phaseCode: '04', title: 'Wireframe / concept review', description: 'Present low-fidelity concepts to stakeholders and capture structured feedback before moving to high-fidelity', promptId: 'p-int-wireframes' },
  { id: 'int-a11y',       code: '04-D', phaseCode: '04', title: 'Accessibility & inclusion check', description: 'Audit flows against WCAG 2.2 AA criteria and document barriers for assistive technology or diverse user needs', promptId: 'p-int-a11y' },
  { id: 'int-usability',  code: '04-E', phaseCode: '04', title: 'Usability test synthesis',  description: 'Run or analyse 5+ task-based sessions and distil findings into a ranked list of friction points with design recommendations', promptId: 'p-int-usability' },

  // 05 Alignment — agree data contracts and API shapes
  { id: 'aln-manifest',   code: '05-A', phaseCode: '05', title: 'Data contract review',        description: 'Design presents what the UI needs per screen; engineering confirms what is available, missing, or costly', promptId: 'p-aln-manifest' },
  { id: 'aln-api',        code: '05-B', phaseCode: '05', title: 'API shape agreement',          description: 'Co-design session to agree request/response shapes and pagination before any code is written',            promptId: 'p-aln-api' },
  { id: 'aln-tokens',     code: '05-C', phaseCode: '05', title: 'Design token & component handoff', description: 'Define and agree the design token set (colours, type, spacing) and component inventory before build starts', promptId: 'p-aln-tokens' },
  { id: 'aln-signoff',    code: '05-D', phaseCode: '05', title: 'Prototype sign-off session',   description: 'Structured walkthrough of the high-fidelity prototype with client and engineering leads; capture open decisions and blockers', promptId: 'p-aln-signoff' },

  // 06 Build — generate code only within defined scope
  { id: 'bld-scope',      code: '06-A', phaseCode: '06', title: 'Scope boundary review',   description: 'Walk the spec and flag anything that exceeds what has been designed or contracted before build starts', promptId: 'p-bld-scope' },
  { id: 'bld-qa',         code: '06-B', phaseCode: '06', title: 'Incremental design QA',   description: 'Design reviews implementation against spec at component level throughout build, not just at the end',   promptId: 'p-bld-qa' },
  { id: 'bld-liveqa',     code: '06-C', phaseCode: '06', title: 'Live UX review',          description: 'Evaluate the deployed product against the approved prototype and log regressions before release', promptId: 'p-bld-liveqa' },
  { id: 'bld-metrics',    code: '06-D', phaseCode: '06', title: 'Analytics & success metrics setup', description: 'Confirm instrumentation for agreed KPIs (task completion, error rate, CSAT) is in place and firing correctly', promptId: 'p-bld-metrics' },
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

  {
    id: 'p-ctx-heuristic',
    level: '01 Context',
    code: '01-C',
    title: 'Heuristic audit',
    description: 'Evaluate existing product or touchpoints against recognised UX principles; produce a scored issue list with severity ratings.',
    tags: ['heuristics', 'audit', 'UX review'],
    body: `Conduct a heuristic audit of the existing product or touchpoint using Nielsen's 10 Usability Heuristics as the evaluation framework.

Product / touchpoint to audit: [FILL — e.g. "the client onboarding flow in the web app"]
How to access it: [FILL — URL, screenshots, recording, or walkthrough notes]
User type being evaluated for: [FILL]

For each heuristic, identify issues found:

| # | Heuristic | Issue found | Location | Severity (0–4) | Recommendation |
|---|-----------|-------------|----------|----------------|----------------|
| 1 | Visibility of system status | | | | |
| 2 | Match between system and real world | | | | |
| 3 | User control and freedom | | | | |
| 4 | Consistency and standards | | | | |
| 5 | Error prevention | | | | |
| 6 | Recognition rather than recall | | | | |
| 7 | Flexibility and efficiency of use | | | | |
| 8 | Aesthetic and minimalist design | | | | |
| 9 | Help users recognise, diagnose, recover from errors | | | | |
| 10 | Help and documentation | | | | |

Severity scale: 0 = not a problem, 1 = cosmetic, 2 = minor, 3 = major, 4 = catastrophic.

After the table, produce:
## Top 5 priority issues
Ranked by severity × frequency of encounter.

## Quick wins
Issues that can be fixed with minimal effort and high impact.

---
⛔ CHECKPOINT 01-C
Has the audit been reviewed by at least one other team member?
Do the severity scores reflect the actual user impact for this specific audience?
Reply YES to confirm, or adjust scores and recommendations.`,
  },

  {
    id: 'p-ctx-competitive',
    level: '01 Context',
    code: '01-D',
    title: 'Competitive & analogous review',
    description: 'Benchmark 3–5 competitors and 2–3 analogous experiences to identify patterns, gaps, and opportunities.',
    tags: ['competitive', 'benchmarking', 'discovery'],
    body: `Conduct a structured competitive and analogous review to identify design patterns, gaps, and opportunities.

Our product / context: [FILL — brief description of what we're building]
Competitors to review (3–5): [FILL — names or URLs]
Analogous experiences to review (2–3 from adjacent industries): [FILL — e.g. "Notion for document hierarchy", "Linear for project status"]
User goals we're evaluating for: [FILL — from JTBD mapping]

For each product reviewed, produce:

## [Product name]
**Type:** Competitor / Analogous
**What they do well:** (2–4 specific observations, not generalities)
**What they do poorly:** (2–4 specific observations)
**Design patterns worth adopting:** (name and describe the pattern)
**Anti-patterns to avoid:** (what they do that frustrates users)
**Unique differentiator:** (what only they do)

After all reviews, produce:

## Cross-product synthesis
**Common patterns** — what every product does (table stakes)
**Points of differentiation** — where the market diverges
**Gaps** — what no product does well that our users need
**Opportunities** — where we can credibly be better

---
⛔ CHECKPOINT 01-D
Does this review cover the right competitors?
Are there analogous industries or products we've missed that are more relevant?
Reply YES to confirm, or add missing products before we proceed.`,
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

  {
    id: 'p-cap-personas',
    level: '02 Capabilities',
    code: '02-C',
    title: 'Persona & segment definition',
    description: 'Consolidate research into 2–4 validated archetypes with goals, frustrations, and behavioural tendencies.',
    tags: ['personas', 'segments', 'users'],
    body: `Based on the research digest and JTBD mapping, help me define 2–4 user archetypes for this product.

Research inputs: [FILL — paste insight brief from 01-B and JTBD map from 02-A]
Number of archetypes to define: [FILL — recommended 2–4]

For each archetype, produce:

## [Archetype name — descriptive, not a fake first name]
**Who they are:** [role, context, relevant background — one paragraph]
**Primary goal:** [the one thing they most need to accomplish with this product]
**Secondary goals:** [2–3 supporting goals]
**Frustrations with the current experience:** [3–5 specific pain points, cited from research]
**Behaviours and habits:** [how they currently work — tools, workarounds, frequency]
**What success looks like for them:** [how they'll know the product is working]
**What would cause them to abandon or distrust the product:** [failure modes]
**Quote that captures their mindset:** [synthesised from research, not invented]

After all archetypes:
## Segment tensions
Where do the archetypes' needs conflict? Which conflicts require explicit design decisions?

## Primary vs secondary
Which archetype should we optimise for if we have to choose?

---
⛔ CHECKPOINT 02-C
Are these archetypes grounded in research — not invented?
Would your research participants recognise themselves in these descriptions?
Reply YES to confirm, or adjust before we proceed to service blueprinting.`,
  },

  {
    id: 'p-cap-blueprint',
    level: '02 Capabilities',
    code: '02-D',
    title: 'Service blueprint (as-is)',
    description: 'Map the current end-to-end experience across frontstage actions, backstage processes, and supporting systems.',
    tags: ['service blueprint', 'journey', 'as-is'],
    body: `Map the current end-to-end experience as a service blueprint — before we design any improvements.

Experience to map: [FILL — e.g. "a new client from first contact to first signed deliverable"]
Primary user archetype: [FILL — from 02-C]
Key touchpoints identified: [FILL — channels, moments of truth]

Produce a service blueprint with these swim lanes:

**USER ACTIONS** — what the user does at each step (their experience, their words)
**FRONTSTAGE** — what the user sees or interacts with (interfaces, people, communications)
**BACKSTAGE** — internal processes the user doesn't see (operations, decisions, tools)
**SUPPORT SYSTEMS** — technology, data, and infrastructure that enables the experience
**PAIN POINTS** — friction, delays, errors, or workarounds at each step (🔴 critical / 🟡 moderate / 🟢 minor)
**OPPORTUNITIES** — where improvement is possible (flag only, don't design yet)

For each step:
| Step | User action | Frontstage | Backstage | Support systems | Pain points | Opportunities |
|------|-------------|------------|-----------|-----------------|-------------|---------------|

After the blueprint:
## Moments of truth
Which 3–5 steps have the highest impact on user trust and satisfaction?

## Biggest systemic gaps
Where does the experience break down most severely — and why?

---
⛔ CHECKPOINT 02-D
Does this blueprint accurately reflect the current experience — not the ideal one?
Have we validated it with someone who lives this process daily?
Reply YES to confirm, or correct inaccuracies before we proceed.`,
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

  {
    id: 'p-obj-content',
    level: '03 Objects',
    code: '03-C',
    title: 'Content inventory & audit',
    description: 'Catalogue all content types (labels, copy, media) the product needs; flag gaps, duplicates, or tone inconsistencies.',
    tags: ['content', 'copy', 'IA'],
    body: `Produce a content inventory for the product and audit it for gaps, duplicates, and tone issues.

Product / scope to audit: [FILL — e.g. "the full web app" or "the onboarding flow"]
Existing content sources: [FILL — paste or link to screens, copy docs, or CMS export]
Target tone of voice: [FILL — or "to be defined"]

PART 1 — CONTENT INVENTORY
For each screen or section, catalogue:

| Screen / section | Content type | Label / copy (exact) | Owner | Status (✓ approved / ⚠ draft / ✕ missing) |
|-----------------|--------------|----------------------|-------|------------------------------------------|

Content types include: page titles, headings, body copy, CTAs, labels, error messages, empty states, tooltips, notifications, legal copy, imagery, icons.

PART 2 — AUDIT FLAGS
After the inventory, flag:

**Gaps** — content that is needed but doesn't exist yet
**Duplicates** — the same concept described differently in different places
**Inconsistencies** — same label used for different things
**Tone deviations** — copy that doesn't match the agreed voice
**Missing states** — screens or components with no copy for empty, error, or loading states

PART 3 — Priority fixes
Rank the top 10 content issues by user impact.

---
⛔ CHECKPOINT 03-C
Is any critical content type missing from this inventory?
Has the tone audit been reviewed by someone with sign-off on brand voice?
Reply YES to confirm.`,
  },

  {
    id: 'p-obj-mentalmodel',
    level: '03 Objects',
    code: '03-D',
    title: 'Mental model mapping',
    description: 'Align the user\'s conceptual model of the domain with the system\'s entity model to surface naming and structural conflicts.',
    tags: ['mental model', 'IA', 'naming'],
    body: `Map the user's mental model of this domain and compare it to the system's entity model to find conflicts and alignment risks.

Domain being modelled: [FILL — e.g. "project management for a design agency"]
User archetypes: [FILL — from 02-C]
System entity model: [FILL — paste from 03-A / 03-B]
Research sources: [FILL — transcripts, surveys, or user vocabulary list]

PART 1 — USER MENTAL MODEL
Based on the research, how do users think about this domain?

For each key concept users work with:
| User's term | What they mean by it | How they expect it to behave | Emotional association |
|-------------|---------------------|------------------------------|-----------------------|

PART 2 — SYSTEM MODEL
For each entity in the system:
| System entity | Technical definition | How it maps to user's term | Conflict? |
|---------------|----------------------|---------------------------|-----------|

PART 3 — CONFLICT ANALYSIS
For each conflict identified:
- **What the user expects** vs **what the system does**
- **Impact:** [how often this conflict will cause confusion]
- **Recommendation:** rename the entity / restructure the model / educate users / redesign the flow

PART 4 — Naming decisions needed
List every entity name that needs a design decision before implementation.

---
⛔ CHECKPOINT 03-D
Have we tested these mental model assumptions directly with users — not just inferred them?
Reply YES to confirm, or flag assumptions that need validation.`,
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

  {
    id: 'p-int-wireframes',
    level: '04 Interactions',
    code: '04-C',
    title: 'Wireframe / concept review',
    description: 'Present low-fidelity concepts to stakeholders and capture structured feedback before moving to high-fidelity.',
    tags: ['wireframes', 'feedback', 'review'],
    body: `Facilitate a structured wireframe or concept review with stakeholders. The goal is to gather actionable feedback — not a vote.

Concepts being reviewed: [FILL — list or attach wireframes, sketches, or lo-fi prototypes]
Review audience: [FILL — client stakeholders / internal team / both]
Questions we need answered from this review: [FILL — 2–4 specific open questions]

REVIEW STRUCTURE

PART 1 — Context setting (5 min)
Before showing anything, confirm:
- What problem are we solving? (restate from kickoff)
- What is the scope of this review? (lo-fi concepts, not final design)
- What kind of feedback is useful right now? (structure and flow, not colour or font)
- What feedback is NOT useful right now? (visual polish, brand — premature)

PART 2 — Concept walkthrough
For each concept or screen:
- What user goal is this addressing?
- Walk the flow without stopping for questions
- Then open for structured feedback using:

| Screen | What's working | What's confusing | What's missing | Open question answered? |
|--------|----------------|-----------------|----------------|------------------------|

PART 3 — Synthesis
After the review:
**Consensus decisions** — what everyone agreed on
**Unresolved disagreements** — what needs a follow-up decision
**Changes to make before high-fidelity** — specific, actionable list
**What we will NOT change** — document explicitly to prevent revisiting

---
⛔ CHECKPOINT 04-C
Has every open question from Part 1 been answered or formally deferred?
Have stakeholders confirmed the structure before visual design begins?
Reply YES to confirm sign-off on the wireframe direction.`,
  },

  {
    id: 'p-int-a11y',
    level: '04 Interactions',
    code: '04-D',
    title: 'Accessibility & inclusion check',
    description: 'Audit flows against WCAG 2.2 AA criteria and document barriers for assistive technology or diverse user needs.',
    tags: ['accessibility', 'WCAG', 'inclusion'],
    body: `Audit this flow or set of components against WCAG 2.2 AA and inclusive design principles.

Flow / screens to audit: [FILL]
Assistive technologies to consider: [FILL — screen reader, keyboard-only, voice control, magnification]
Known diverse user needs for this audience: [FILL — e.g. low vision, motor impairment, cognitive load, non-native language]

PART 1 — WCAG 2.2 AA CHECKLIST

For each screen or component:

**Perceivable**
- [ ] All non-text content has a text alternative (1.1.1)
- [ ] Colour is not the only means of conveying information (1.4.1)
- [ ] Colour contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text (1.4.3)
- [ ] Text can be resized to 200% without loss of content (1.4.4)
- [ ] Content doesn't rely on sensory characteristics alone (1.3.3)

**Operable**
- [ ] All functionality is available via keyboard (2.1.1)
- [ ] No keyboard traps (2.1.2)
- [ ] Focus visible and logical (2.4.7, 2.4.3)
- [ ] Skip links present (2.4.1)
- [ ] Touch targets ≥ 24×24px (2.5.8)
- [ ] Pointer gestures have single-pointer alternatives (2.5.1)

**Understandable**
- [ ] Page language declared (3.1.1)
- [ ] Labels or instructions present for all inputs (3.3.2)
- [ ] Error messages identify the field and suggest a fix (3.3.1, 3.3.3)
- [ ] Consistent navigation and labelling (3.2.3, 3.2.4)

**Robust**
- [ ] Name, role, value programmatically available for all UI components (4.1.2)
- [ ] Status messages don't require focus (4.1.3)

PART 2 — BARRIERS LOG
For each failure:
| Issue | WCAG criterion | Severity | Affected users | Recommended fix | Owner |
|-------|----------------|----------|----------------|-----------------|-------|

PART 3 — INCLUSION NOTES
Beyond WCAG: are there cognitive, linguistic, or situational barriers not covered by the checklist?

---
⛔ CHECKPOINT 04-D
Have critical and major barriers been resolved or formally accepted with a plan to fix post-launch?
Reply YES to confirm the accessibility review is complete.`,
  },

  {
    id: 'p-int-usability',
    level: '04 Interactions',
    code: '04-E',
    title: 'Usability test synthesis',
    description: 'Run or analyse 5+ task-based sessions and distil findings into a ranked list of friction points with design recommendations.',
    tags: ['usability', 'testing', 'synthesis'],
    body: `Synthesise findings from a round of usability testing into a prioritised action list.

Test method: [FILL — moderated / unmoderated / remote / in-person]
Number of participants: [FILL — minimum 5 recommended]
Tasks tested: [FILL — list the task scenarios used]
Raw notes or recordings: [FILL — paste observation notes, timestamps, or key quotes]

PART 1 — TASK PERFORMANCE SUMMARY
For each task:
| Task | Completion rate | Avg time | Error rate | Satisfaction (1–5) |
|------|----------------|----------|------------|-------------------|

PART 2 — FRICTION POINT CATALOGUE
For each observed problem:
| Issue | Where it happened | How many participants | Severity (critical / major / minor) | Root cause hypothesis | Quote |
|-------|-------------------|----------------------|--------------------------------------|-----------------------|-------|

PART 3 — RANKED ACTION LIST
Sort by: severity × frequency × ease of fix.

For each recommendation:
- **Problem:** [what users struggled with]
- **Observed behaviour:** [what they actually did]
- **Design recommendation:** [specific change to make]
- **Priority:** P1 (fix before launch) / P2 (fix in next iteration) / P3 (monitor)

PART 4 — WHAT WORKED WELL
Document what performed well — so we don't accidentally remove it.

---
⛔ CHECKPOINT 04-E
Do the recommendations address root causes — not just surface symptoms?
Has the client reviewed and agreed to the priority rankings?
Reply YES to confirm the synthesis is actionable and approved.`,
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

  {
    id: 'p-aln-tokens',
    level: '05 Alignment',
    code: '05-C',
    title: 'Design token & component handoff',
    description: 'Define and agree the design token set (colours, type, spacing) and component inventory before build starts.',
    tags: ['tokens', 'design system', 'handoff'],
    body: `Define the design token set and component inventory that engineering will implement. Nothing should be built before this is agreed.

Design file / source: [FILL — Figma link or attach]
Tech stack: [FILL — e.g. React + Tailwind / CSS custom properties / Style Dictionary]
Existing design system or component library in use: [FILL — or "none"]

PART 1 — DESIGN TOKENS

**Colour tokens**
| Token name | Value | Usage |
|------------|-------|-------|
| color.primary | | |
| color.surface | | |
| color.text.primary | | |
| color.border | | |
| (add all tokens) | | |

**Typography tokens**
| Token name | Font / size / weight / line height | Usage |
|------------|-----------------------------------|-------|

**Spacing tokens**
| Token name | Value | Usage |
|------------|-------|-------|

**Radius, shadow, motion tokens** (as applicable)

PART 2 — COMPONENT INVENTORY
For each UI component:
| Component | Variants | States | Source (new / existing / modified) | Figma frame | Agreed? |
|-----------|----------|--------|-------------------------------------|-------------|---------|

PART 3 — OPEN DECISIONS
- Any token that hasn't been agreed with engineering
- Any component that doesn't exist in the current library and needs to be built
- Any animation or motion spec that hasn't been defined

---
⛔ CHECKPOINT 05-C
Engineering must confirm the token names match their implementation format.
No component should be built until it appears in this inventory.
Reply YES when both design and engineering have signed off.`,
  },

  {
    id: 'p-aln-signoff',
    level: '05 Alignment',
    code: '05-D',
    title: 'Prototype sign-off session',
    description: 'Structured walkthrough of the high-fidelity prototype with client and engineering leads; capture open decisions and blockers.',
    tags: ['prototype', 'sign-off', 'client review'],
    body: `Facilitate a prototype sign-off session. The goal is explicit approval from the client before build begins — not just a walkthrough.

Prototype: [FILL — Figma link or recording]
Attendees: [FILL — client stakeholders, engineering lead, design lead]
Outstanding open questions from previous phases: [FILL — paste from decision log or alignment notes]

SESSION STRUCTURE

PART 1 — Pre-meeting checklist
Before the session, confirm:
- [ ] Prototype covers all agreed capabilities from Phase 02
- [ ] All states (empty, error, loading) are represented
- [ ] Accessibility audit (04-D) findings have been addressed
- [ ] Open questions from wireframe review (04-C) have been resolved

PART 2 — Walkthrough notes
For each flow or section reviewed:
| Flow | Client feedback | Engineering concern | Decision made | Owner |
|------|----------------|---------------------|---------------|-------|

PART 3 — Sign-off decision matrix
| Item | Status | Notes |
|------|--------|-------|
| Overall direction approved | ✓ / ✗ / ⚠ pending | |
| Scope confirmed (nothing added) | ✓ / ✗ / ⚠ pending | |
| Data availability confirmed | ✓ / ✗ / ⚠ pending | |
| Accessibility requirements met | ✓ / ✗ / ⚠ pending | |
| Content approved | ✓ / ✗ / ⚠ pending | |

PART 4 — Blockers
List any item that prevents build from starting. Each blocker needs an owner and a resolution date.

---
⛔ CHECKPOINT 05-D
Build must not begin until every blocker is resolved and the client has given explicit written approval.
Reply YES only when all items in the sign-off matrix are confirmed.`,
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

  {
    id: 'p-bld-liveqa',
    level: '06 Build',
    code: '06-C',
    title: 'Live UX review',
    description: 'Evaluate the deployed product against the approved prototype and log regressions before release.',
    tags: ['QA', 'live review', 'regression'],
    body: `Compare the deployed product against the approved prototype and document all regressions before release.

Environment to review: [FILL — staging URL or build]
Approved prototype: [FILL — Figma link]
Scope of this review: [FILL — specific flows or the full product]
Reference: incremental design QA log from 06-B

PART 1 — FLOW-BY-FLOW COMPARISON
For each key flow:
| Screen | Prototype | Deployed | Match? | Regression type | Severity | Owner |
|--------|-----------|----------|--------|-----------------|----------|-------|

Regression types: Visual / Behaviour / Content / Performance / Accessibility

PART 2 — END-TO-END SMOKE TEST
Walk each core user task end-to-end on the live environment:
| Task | Can user complete it? | Blockers | Notes |
|------|-----------------------|----------|-------|

PART 3 — REGRESSION LOG
For every regression found:
- **Description:** [what is wrong]
- **Expected (from prototype):** [what it should do]
- **Actual (on live):** [what it does]
- **Severity:** Critical (blocks release) / Major (fix before launch) / Minor (next sprint)
- **Screenshot or recording:** [attach]
- **Assigned to:** [engineer]
- **Target fix date:** [date]

---
⛔ CHECKPOINT 06-C
All critical regressions must be resolved before release.
Major regressions must have a committed fix date.
Reply YES only when the release candidate is approved by design.`,
  },

  {
    id: 'p-bld-metrics',
    level: '06 Build',
    code: '06-D',
    title: 'Analytics & success metrics setup',
    description: 'Confirm instrumentation for agreed KPIs (task completion, error rate, CSAT) is in place and firing correctly.',
    tags: ['analytics', 'metrics', 'KPIs'],
    body: `Confirm that the agreed success metrics are instrumented, firing correctly, and visible in the analytics platform before launch.

Analytics platform: [FILL — e.g. Mixpanel, GA4, Amplitude, PostHog]
KPIs agreed in project brief: [FILL — paste from Phase 01 kickoff summary]
Events to track: [FILL — or list below]

PART 1 — KPI → EVENT MAPPING
For each KPI, define the events needed to measure it:

| KPI | How it's measured | Events required | Property required | Dashboard / report |
|-----|-------------------|-----------------|-------------------|--------------------|
| Task completion rate | | | | |
| Error rate | | | | |
| Time on task | | | | |
| Drop-off by step | | | | |
| CSAT / NPS | | | | |
| (add project-specific KPIs) | | | | |

PART 2 — INSTRUMENTATION CHECKLIST
For each event:
- [ ] Event fires on correct user action
- [ ] Properties are correctly populated (not null, not mistyped)
- [ ] Event is visible in the analytics dashboard
- [ ] Test recording available (session replay or QA log)

PART 3 — BASELINE CAPTURE
Before launch, document current baselines (if applicable) so we can measure change:
| Metric | Baseline value | Source | Date captured |
|--------|----------------|--------|---------------|

PART 4 — REVIEW CADENCE
Who reviews these metrics, how often, and what triggers an action?

---
⛔ CHECKPOINT 06-D
Instrumentation must be verified in staging before launch — not assumed.
Reply YES only when every KPI has a confirmed, tested event and is visible in the dashboard.`,
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
