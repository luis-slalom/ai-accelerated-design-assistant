import { useState, useRef } from "react";

const LEVELS = ["All", "01 Context", "02 Capabilities", "03 Objects", "04 Interactions", "05 Alignment", "06 Build", "Utility"];

const PROMPTS = [
  {
    id: "global",
    level: "Utility",
    code: "U-00",
    title: "Global working contract",
    description: "Establishes AI/human ownership boundaries for any session.",
    tags: ["always-on", "setup"],
    body: `You are a design-led AI collaborator. You accelerate research, synthesis, prototyping, and scoping — but humans own every decision.

Rules that always apply:
- Never skip ahead to a level the human hasn't approved
- At the end of every output, summarise what was produced and ask for explicit approval before continuing
- Flag risks and open questions immediately — never bury them
- Design intent must be preserved and stated explicitly in every output
- If you are uncertain whether something is signal or noise, ask

Memory check (if applicable):
- Read /memory-bank/decisions.md before starting
- Read /memory-bank/constraints.md before any technical suggestion
- Add new decisions to decisions.md as they are confirmed
- Add new risks to open-questions.md immediately`
  },
  {
    id: "01a",
    level: "01 Context",
    code: "01-A",
    title: "Project brief intake",
    description: "Structured question flow to capture project context before design begins.",
    tags: ["kickoff", "discovery"],
    body: `You are helping an Experience Designer understand and articulate the full context of a project before any design work begins.

Ask me the following questions one group at a time. Wait for my answers before moving to the next group.

GROUP 1 — The problem
- What problem are we solving, and for whom?
- What does success look like in 6 months?
- What has already been tried?

GROUP 2 — The constraints
- What are the hard constraints? (time, budget, tech, legal)
- What is out of scope?
- Who are the key stakeholders and what do they care about most?

GROUP 3 — The signals
- What research or data already exists?
- What do we know vs what are we assuming?
- What would change our direction if we learned it?

After I answer all three groups, synthesise my answers into a structured project brief using this format:

## Project brief
**Problem statement:** [one sentence]
**Primary users:** [who]
**Success criteria:** [measurable outcomes]
**Hard constraints:** [list]
**Known risks / assumptions:** [list]
**Open questions:** [list]

---
⛔ CHECKPOINT 01-A
Before we proceed: does this brief accurately capture the project context?
Reply YES to continue, or correct anything that's wrong.`
  },
  {
    id: "01b",
    level: "01 Context",
    code: "01-B",
    title: "Stakeholder alignment map",
    description: "Maps competing stakeholder priorities and surfaces likely tension points.",
    tags: ["stakeholders", "alignment"],
    body: `I'll describe the key stakeholders on this project. For each one, help me map:

1. Their primary goal for this project
2. What they fear most (failure mode)
3. How they define quality
4. Where they are likely to conflict with other stakeholders

Stakeholders: [FILL — e.g. "Product Manager, Engineering Lead, Marketing Director, Customer Success"]

After mapping each stakeholder, produce:
- A tension matrix showing where conflicts are likely
- A recommended approach for each tension point
- Any decisions that should be made before design begins

---
⛔ CHECKPOINT 01-B
Does this stakeholder map reflect the real dynamics on this project?
Any missing perspectives or misread priorities?
Reply YES to continue, or provide corrections.`
  },
  {
    id: "01c",
    level: "01 Context",
    code: "01-C",
    title: "Constraints register",
    description: "Catalogues fixed, flexible, and assumed constraints before any direction is proposed.",
    tags: ["constraints", "risk"],
    body: `Help me create a constraints register for this project.

I'll share what I know. Organise it into three categories:

FIXED constraints — cannot be changed under any circumstance
(e.g. regulatory, existing contracts, hard deadlines)

FLEXIBLE constraints — defaults we should work within but could negotiate if there's a strong reason
(e.g. preferred tech stack, design system, team size)

ASSUMPTIONS — things we're treating as constraints but haven't confirmed
(flag these clearly — they need validation)

What I know so far: [FILL]

Format the output as a table with columns:
Constraint | Category | Owner | Last validated

---
⛔ CHECKPOINT 01-C
Review the constraints register.
- Are all fixed constraints correctly classified?
- Which assumptions need urgent validation?
Reply YES to confirm, or flag corrections.`
  },
  {
    id: "02a",
    level: "02 Capabilities",
    code: "02-A",
    title: "User outcome mapping",
    description: "Reframes requirements as user outcomes and surfaces vanity features.",
    tags: ["outcomes", "requirements"],
    body: `I'll share a list of requirements, features, or stakeholder asks. Your job is to reframe each one as a user outcome — what the user is able to do, feel, or decide as a result.

Requirements / asks: [FILL]

For each item, produce:
- Original ask (verbatim)
- Underlying user need
- User outcome statement (format: "As a [user], I can [capability] so that [value]")
- Risk if we skip this
- Risk if we over-build this

Then identify:
- Any outcomes that duplicate each other
- Any user needs that have NO corresponding ask (gaps)
- Any asks that have no clear user benefit (vanity features)

---
⛔ CHECKPOINT 02-A
Review the outcome map:
- Do these outcomes reflect what your users actually need?
- Are there any gaps or vanity features you'd challenge or remove?
Reply YES to confirm, or adjust.`
  },
  {
    id: "02b",
    level: "02 Capabilities",
    code: "02-B",
    title: "Capability gap analysis",
    description: "Compares current state to desired outcomes and prioritises the gaps.",
    tags: ["gap analysis", "prioritisation"],
    body: `I want to identify the gap between what users can do today and what they need to be able to do.

Current state: [FILL — describe the existing product, process, or workaround]

Target outcomes: [FILL — paste confirmed outcomes from 02-A, or describe the desired future state]

For each target outcome, assess:
- Does the current state support it? (fully / partially / not at all)
- What's missing?
- What would need to be true for this outcome to be achievable?

Produce a gap table:
Outcome | Current support | Gap | What's needed

Then prioritise the gaps by:
1. User impact (high / medium / low)
2. Build complexity (high / medium / low)
3. Recommended sequence

---
⛔ CHECKPOINT 02-B
Does this gap analysis reflect your current reality?
Are the priorities in the right order?
Reply YES to confirm, or adjust before we move to object modelling.`
  },
  {
    id: "02c",
    level: "02 Capabilities",
    code: "02-C",
    title: "Persona pressure-test",
    description: "Validates capabilities against each persona, surfacing edge cases and de-scope candidates.",
    tags: ["personas", "edge cases"],
    body: `I want to pressure-test our capability decisions against our key personas.

Personas: [FILL — paste persona summaries or describe user types, including any edge cases]

For each persona, assess each confirmed capability:
- Does this outcome matter to this persona?
- Is the capability accessible given their context and constraints?
  (device, literacy, time pressure, trust level, etc.)
- What edge case does this persona expose?

Produce:
- A persona × capability matrix (does it work for them: yes / partially / no / not applicable)
- A list of design decisions that need persona-specific treatment
- Any capabilities that should be de-scoped for this release

---
⛔ CHECKPOINT 02-C
Persona validation is a human decision.
- Do these personas accurately represent your real users?
- Are the edge cases surfaced ones you recognise from research?
Reply YES to confirm personas and proceed, or correct before we move to object modelling.`
  },
  {
    id: "03a",
    level: "03 Objects",
    code: "03-A",
    title: "OOUX entity inventory",
    description: "Identifies core system entities, attributes, relationships, and actions using OOUX principles.",
    tags: ["OOUX", "entities", "modelling"],
    body: `Using Object-Oriented UX principles, help me identify the core entities in this product.

Context: [FILL — paste project brief from 01-A and confirmed outcomes from 02-A]

For each entity, define:
- Entity name (noun, not a screen or action)
- What it IS (brief definition)
- Key attributes (what properties does it have?)
- Relationships (what other entities does it connect to, and how?)
- Actions that can be performed on it
- Who owns or creates it

Then produce:
- An entity relationship summary (prose, not a technical ERD)
- Any entities that are unclear or contested
- Any entities that might be missing

---
⛔ CHECKPOINT 03-A
Object modelling shapes everything that follows.
- Are all core entities named correctly?
- Are there any missing objects or relationships?
- Are there any entities that should be merged or split?
Reply YES to confirm the entity inventory, or make corrections before we map flows.`
  },
  {
    id: "03b",
    level: "03 Objects",
    code: "03-B",
    title: "Object state mapping",
    description: "Maps the full lifecycle of each entity including null states and error states.",
    tags: ["states", "lifecycle"],
    body: `For each confirmed entity, map its full lifecycle.

Entities to map: [FILL — paste entity list from 03-A]

For each entity, produce:
- All possible states (e.g. draft / active / archived / deleted)
- What triggers each state transition
- Who can trigger each transition
- What the user sees and can do in each state
- Null state (what does a new user with no data see?)
- Error state (what happens when something goes wrong?)

Format each entity as a simple state table:
State | Triggered by | Who can act | What user sees

---
⛔ CHECKPOINT 03-B
State mapping catches edge cases before they become bugs.
- Are all states accounted for?
- Is the null state designed for?
- Are there any transitions that feel wrong or are missing?
Reply YES to confirm, or add missing states before we map interactions.`
  },
  {
    id: "04a",
    level: "04 Interactions",
    code: "04-A",
    title: "Flow generation",
    description: "Generates a detailed end-to-end user flow including critical path, branches, and error routes.",
    tags: ["flows", "journeys"],
    body: `Generate a detailed user flow for the following task:

Task: [FILL — e.g. "A user who has never logged in creates their first project"]

Use the confirmed entities from Level 03.
Design system in use: [FILL or "not yet defined"]

For each step in the flow, include:
- Step name
- What the user wants to accomplish
- What the system does
- What the user sees (screen/state/component type)
- Decision points or branches
- Error paths
- Success criteria for this step

Then identify:
- The critical path (minimum steps to task completion)
- All alternate paths
- All error paths and recovery routes
- Any steps where user drop-off is likely and why

---
⛔ CHECKPOINT 04-A
Flow review before we consider edge cases:
- Does the critical path feel right?
- Are any steps missing or in the wrong order?
- Are the branches and error paths realistic?
Reply YES to confirm the flow, or adjust before we map edge cases.`
  },
  {
    id: "04b",
    level: "04 Interactions",
    code: "04-B",
    title: "Edge case inventory",
    description: "Systematically finds data, permission, system, and human edge cases for a confirmed flow.",
    tags: ["edge cases", "QA"],
    body: `Take the confirmed flow from 04-A and generate a comprehensive edge case inventory.

Flow to analyse: [FILL — paste confirmed flow or summarise it]
User types to consider: [FILL — paste personas from 02-C]

Organise edge cases into four categories:

1. DATA EDGE CASES
   (empty states, truncation, special characters, max/min values, null returns)

2. PERMISSION EDGE CASES
   (different roles, expired access, first-time users, users mid-process when permissions change)

3. CONNECTIVITY / SYSTEM EDGE CASES
   (slow network, timeout, partial save, browser back button, session expiry)

4. HUMAN EDGE CASES
   (user makes a mistake, changes their mind mid-flow, two users editing at once, accessibility needs)

For each edge case: describe it, rate its likelihood (high / medium / low), rate its severity if it occurs (high / medium / low), and recommend how to handle it.

---
⛔ CHECKPOINT 04-B
Edge cases are a human decision — you know which ones matter for your users.
- Are the high likelihood + high severity cases all accounted for?
- Are there known edge cases from user research that aren't here?
- Which ones are in scope for this release vs a future one?
Reply YES to confirm scope of edge cases, or adjust the list.`
  },
  {
    id: "05a",
    level: "05 Alignment",
    code: "05-A",
    title: "Data contract definition",
    description: "Defines API shapes and data contracts as the handshake between design and engineering.",
    tags: ["API", "data", "engineering"],
    body: `Based on the confirmed flows and object model, help me define the data contracts needed for this feature.

Confirmed objects: [FILL — paste from 03-A]
Confirmed flows: [FILL — paste from 04-A]
Tech stack: [FILL]

For each key interaction in the flow, define:
- What data the UI needs to display
- What data the user inputs
- What the API endpoint should return (shape, not implementation)
- Required vs optional fields
- Null/empty states the UI must handle
- Error responses the UI must handle

Format each contract as:

## [Action name]
**Request:** [what the frontend sends]
**Success response:** [shape of data returned]
**Error responses:** [list of error codes + what UI should show]
**Open questions for engineering:** [list]

---
⛔ CHECKPOINT 05-A
Data contracts are the handshake between design and engineering.
- Do these contracts match your actual data model?
- Are there fields design is assuming that don't exist yet?
- Any performance or security concerns with these shapes?

This checkpoint requires sign-off from both design and engineering.
Reply YES when both sides agree, or flag mismatches before any build begins.`
  },
  {
    id: "05b",
    level: "05 Alignment",
    code: "05-B",
    title: "Acceptance criteria generation",
    description: "Translates design decisions into testable GIVEN/WHEN/THEN acceptance criteria.",
    tags: ["acceptance criteria", "QA", "definition of done"],
    body: `Generate acceptance criteria for the following feature or flow.

Feature: [FILL]
Confirmed flow: [FILL — paste from 04-A]
Edge cases in scope: [FILL — paste agreed list from 04-B]
Design system: [FILL]

For each step and state, write acceptance criteria in this format:
GIVEN [context] WHEN [action] THEN [outcome]

Include criteria for:
- Happy path (every step of the critical path)
- Error states (each in-scope error from 04-B)
- Accessibility (keyboard navigation, screen reader labels, colour contrast, touch targets)
- Null / empty states
- Loading states

Flag any criteria that require a judgement call on the quality bar — these need explicit human sign-off before they are written into a ticket.

---
⛔ CHECKPOINT 05-B
Acceptance criteria define the quality bar — only humans can set that.
- Is the quality bar set at the right level for this release?
- Are there any criteria that are too strict or too loose?
- Are there any missing criteria for known edge cases?
Reply YES to confirm the acceptance criteria. These will be used as the definition of done.`
  },
  {
    id: "06a",
    level: "06 Build",
    code: "06-A",
    title: "Scoped code generation",
    description: "Generates code strictly within approved scope — no interpretation or extension.",
    tags: ["code", "build", "scoped"],
    body: `You are generating code within a scope that has been explicitly approved through Levels 01–05.

Do not interpret, extend, or improve on the brief. Build exactly what is described.

Approved scope: [FILL — paste the specific feature, component, or function to be built]

Constraints:
- Tech stack: [FILL]
- Design system / component library: [FILL]
- Accessibility standard: [FILL — e.g. WCAG 2.1 AA]
- Approved data contract: [FILL — paste from 05-A]
- Acceptance criteria to satisfy: [FILL — paste from 05-B]

For each output, state:
- What acceptance criteria it satisfies
- Any criteria it does NOT yet satisfy and why
- Any assumptions made during implementation
- Any decisions that require human review before merge

Do not generate tests, documentation, or adjacent features unless explicitly asked.

---
⛔ CHECKPOINT 06-A
Code review is a human responsibility.
Before this is merged:
- [ ] Acceptance criteria verified
- [ ] Accessibility audit passed
- [ ] Design intent preserved (reviewed against source file)
- [ ] Edge cases tested against agreed list
- [ ] PR reviewed by a human
Reply YES only when all boxes are checked.`
  },
  {
    id: "06b",
    level: "06 Build",
    code: "06-B",
    title: "Test generation",
    description: "Generates unit, component, integration, and accessibility tests from acceptance criteria.",
    tags: ["tests", "QA", "automation"],
    body: `Generate automated tests for the following feature.

Acceptance criteria: [FILL — paste confirmed list from 05-B]
Tech stack and test framework: [FILL]
Component or function under test: [FILL — paste code or describe it]

Generate:
1. Unit tests for any logic or utility functions
2. Component tests for UI states (default, loading, error, empty, populated)
3. Integration tests for the critical path flow
4. Accessibility tests (ARIA roles, keyboard navigation, focus management)

For each test:
- Name it clearly after the acceptance criterion it covers
- Mark it with the criterion ID if one exists
- Flag any criterion that cannot be tested automatically — these need manual QA

---
⛔ CHECKPOINT 06-B
Test coverage review:
- Are all high-severity edge cases covered by a test?
- Are there any acceptance criteria with no corresponding test?
- Which scenarios must remain on the manual QA checklist?
Reply YES to confirm test coverage is sufficient for this release.`
  },
  {
    id: "u01",
    level: "Utility",
    code: "U-01",
    title: "Research synthesis",
    description: "Turns raw research material into themes, needs, frustrations, and open questions.",
    tags: ["research", "synthesis"],
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
Research synthesis is a human call.
- Do these themes match what you heard in the research?
- Are there any patterns that have been missed or misread?
- Which findings should change our current direction?
Reply YES to confirm the synthesis is accurate.`
  },
  {
    id: "u02",
    level: "Utility",
    code: "U-02",
    title: "Decision log entry",
    description: "Captures a design decision with full context, rationale, and review trigger.",
    tags: ["documentation", "decisions"],
    body: `Help me write a decision log entry for the following decision.

Decision made: [FILL]
Context (why it came up): [FILL]
Options that were considered: [FILL]
Reason this option was chosen: [FILL]
Who approved it: [FILL]
Date: [FILL]

Format:

## Decision: [short title]
**Date:** [date]
**Approved by:** [name/role]
**Context:** [why this decision was needed]
**Options considered:** [list]
**Decision:** [what was decided]
**Rationale:** [why]
**Implications:** [what this rules out or makes harder]
**Review trigger:** [what would cause us to revisit this?]

Save this to /memory-bank/decisions.md`
  },
  {
    id: "u03",
    level: "Utility",
    code: "U-03",
    title: "Risk and open question log",
    description: "Logs risks, assumptions, open questions, and dependencies with owner and resolution date.",
    tags: ["risk", "documentation"],
    body: `Add the following item to the open questions log.

Item: [FILL]

Classify it as:
- RISK — something that could harm the project if unresolved
- ASSUMPTION — something we're treating as true without evidence
- OPEN QUESTION — something we need an answer to before proceeding
- DEPENDENCY — something outside our control that we're waiting on

For each item produce:

## [Short title]
**Type:** [Risk / Assumption / Open question / Dependency]
**Raised by:** [role]
**Date raised:** [date]
**Description:** [what is unknown or risky]
**Impact if unresolved:** [what breaks]
**Owner:** [who is responsible for resolving it]
**Target resolution date:** [date]
**Status:** Open

Save this to /memory-bank/open-questions.md`
  },
  {
    id: "u04",
    level: "Utility",
    code: "U-04",
    title: "Level summary and handoff note",
    description: "Produces a handoff note at the end of any level so the next person can continue without losing context.",
    tags: ["handoff", "documentation"],
    body: `Produce a summary of everything decided and produced in [FILL — level name and number].

Include:
- What was the goal of this level?
- What decisions were made? (link to decisions.md entries)
- What was produced? (list all outputs)
- What was explicitly ruled out of scope?
- What open questions remain?
- What does the next person need to know before they start Level [N+1]?

Format this as a handoff note that a team member who wasn't present could read and immediately understand the current state and what comes next.

---
⛔ CHECKPOINT U-04
Is this summary accurate and complete?
Would someone new to the project be able to continue from here without losing any context?
Reply YES to confirm. This summary will be saved as the entry point for the next session.`
  }
];

const levelColors = {
  "01 Context": { bg: "#E6F1FB", text: "#0C447C" },
  "02 Capabilities": { bg: "#E1F5EE", text: "#085041" },
  "03 Objects": { bg: "#EEEDFE", text: "#3C3489" },
  "04 Interactions": { bg: "#FAEEDA", text: "#633806" },
  "05 Alignment": { bg: "#FAECE7", text: "#712B13" },
  "06 Build": { bg: "#FBEAF0", text: "#72243E" },
  "Utility": { bg: "#F1EFE8", text: "#444441" },
};

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1.5"/>
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 8 6.5 11.5 13 4.5"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M5 7l3 3 3-3"/>
      <path d="M3 13h10"/>
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h5v5"/>
      <path d="M14 2L8 8"/>
      <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6.5" r="4"/>
      <path d="M10 10l3.5 3.5"/>
    </svg>
  );
}

export default function App() {
  const [activeLevel, setActiveLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState({});
  const [selected, setSelected] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [exportMsg, setExportMsg] = useState("");
  const exportTimerRef = useRef(null);

  const filtered = PROMPTS.filter(p => {
    const levelMatch = activeLevel === "All" || p.level === activeLevel;
    const q = search.toLowerCase();
    const searchMatch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.code.toLowerCase().includes(q);
    return levelMatch && searchMatch;
  });

  const selectedIds = Object.keys(selected).filter(k => selected[k]);
  const selectedCount = selectedIds.length;

  function copyPrompt(id, body) {
    navigator.clipboard.writeText(body).then(() => {
      setCopied(c => ({ ...c, [id]: true }));
      setTimeout(() => setCopied(c => ({ ...c, [id]: false })), 1800);
    });
  }

  function toggleSelect(id) {
    setSelected(s => ({ ...s, [id]: !s[id] }));
  }

  function selectAll() {
    const allIds = {};
    filtered.forEach(p => { allIds[p.id] = true; });
    setSelected(allIds);
  }

  function clearSelection() {
    setSelected({});
  }

  function exportSelected(format) {
    const items = PROMPTS.filter(p => selectedIds.includes(p.id));
    let content = "";
    let filename = "";
    let mime = "";

    if (format === "md") {
      content = `# UX Prompt Memory Bank\n_Exported ${new Date().toLocaleDateString()}_\n\n---\n\n`;
      content += items.map(p =>
        `## ${p.code} · ${p.title}\n> ${p.description}\n\n\`\`\`\n${p.body}\n\`\`\``
      ).join("\n\n---\n\n");
      filename = "ux-prompts.md";
      mime = "text/markdown";
    } else {
      content = items.map(p =>
        `=== ${p.code} · ${p.title} ===\n${p.description}\n\n${p.body}`
      ).join("\n\n" + "─".repeat(60) + "\n\n");
      filename = "ux-prompts.txt";
      mime = "text/plain";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setExportMsg(`${items.length} prompt${items.length > 1 ? "s" : ""} exported`);
    clearTimeout(exportTimerRef.current);
    exportTimerRef.current = setTimeout(() => setExportMsg(""), 2500);
  }

  function copyAllSelected() {
    const items = PROMPTS.filter(p => selectedIds.includes(p.id));
    const text = items.map(p => `=== ${p.code} · ${p.title} ===\n\n${p.body}`).join("\n\n" + "─".repeat(60) + "\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setExportMsg(`${items.length} prompt${items.length > 1 ? "s" : ""} copied`);
      clearTimeout(exportTimerRef.current);
      exportTimerRef.current = setTimeout(() => setExportMsg(""), 2500);
    });
  }

  return (
    <div style={{ padding: "1.5rem 1rem", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "0.75rem" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>UX prompt library</h2>
          <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "3px 10px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>{PROMPTS.length} prompts</span>
        </div>

        <div style={{ position: "relative", marginBottom: "0.75rem" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search prompts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: "32px", boxSizing: "border-box", fontSize: "14px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              style={{
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "var(--border-radius-md)",
                border: activeLevel === l ? "0.5px solid var(--color-border-primary)" : "0.5px solid var(--color-border-tertiary)",
                background: activeLevel === l ? "var(--color-background-secondary)" : "transparent",
                color: activeLevel === l ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                cursor: "pointer",
                fontWeight: activeLevel === l ? 500 : 400,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {selectedCount > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
          padding: "10px 12px", marginBottom: "1rem",
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)",
          border: "0.5px solid var(--color-border-secondary)",
          fontSize: "13px"
        }}>
          <span style={{ color: "var(--color-text-secondary)", marginRight: "4px" }}>
            <strong style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{selectedCount}</strong> selected
          </span>
          <button onClick={copyAllSelected} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", padding: "4px 10px" }}>
            <CopyIcon /> Copy all
          </button>
          <button onClick={() => exportSelected("md")} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", padding: "4px 10px" }}>
            <DownloadIcon /> Export .md
          </button>
          <button onClick={() => exportSelected("txt")} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", padding: "4px 10px" }}>
            <DownloadIcon /> Export .txt
          </button>
          <button onClick={clearSelection} style={{ fontSize: "12px", padding: "4px 10px", marginLeft: "auto", color: "var(--color-text-secondary)", border: "none", background: "transparent", cursor: "pointer" }}>
            Clear
          </button>
          {exportMsg && <span style={{ fontSize: "12px", color: "var(--color-text-success)", marginLeft: "4px" }}>{exportMsg}</span>}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-tertiary)", fontSize: "14px" }}>
          No prompts match "{search}"
        </div>
      )}

      {selectedCount === 0 && filtered.length > 1 && (
        <div style={{ marginBottom: "0.75rem", textAlign: "right" }}>
          <button onClick={selectAll} style={{ fontSize: "12px", padding: "4px 10px", color: "var(--color-text-secondary)" }}>
            Select all {filtered.length}
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map(p => {
          const col = levelColors[p.level] || levelColors["Utility"];
          const isExpanded = expandedId === p.id;
          const isSelected = !!selected[p.id];

          return (
            <div key={p.id} style={{
              background: "var(--color-background-primary)",
              border: isSelected
                ? "2px solid var(--color-border-info)"
                : "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-lg)",
              overflow: "hidden",
              transition: "border 0.15s",
            }}>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(p.id)}
                    style={{ marginTop: "3px", flexShrink: 0, cursor: "pointer", accentColor: "var(--color-text-info)" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 500, padding: "2px 7px",
                        borderRadius: "var(--border-radius-md)",
                        background: col.bg, color: col.text,
                        flexShrink: 0,
                      }}>{p.level}</span>
                      <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{p.code}</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>{p.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{p.description}</div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "8px", flexWrap: "wrap" }}>
                      {p.tags.map(t => (
                        <span key={t} style={{
                          fontSize: "11px", padding: "2px 7px",
                          borderRadius: "var(--border-radius-md)",
                          background: "var(--color-background-tertiary)",
                          color: "var(--color-text-tertiary)",
                          border: "0.5px solid var(--color-border-tertiary)"
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      style={{ fontSize: "12px", padding: "5px 10px", color: "var(--color-text-secondary)" }}
                    >
                      {isExpanded ? "Hide" : "View"}
                    </button>
                    <button
                      onClick={() => copyPrompt(p.id, p.body)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", padding: "5px 10px" }}
                    >
                      {copied[p.id] ? <CheckIcon /> : <CopyIcon />}
                      {copied[p.id] ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{
                  borderTop: "0.5px solid var(--color-border-tertiary)",
                  padding: "12px 14px 14px",
                  background: "var(--color-background-tertiary)",
                }}>
                  <pre style={{
                    margin: 0, fontSize: "12px", lineHeight: 1.7,
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-secondary)",
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                  }}>{p.body}</pre>
                  <div style={{ marginTop: "10px", textAlign: "right" }}>
                    <button
                      onClick={() => copyPrompt(p.id, p.body)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", padding: "5px 12px" }}
                    >
                      {copied[p.id] ? <CheckIcon /> : <CopyIcon />}
                      {copied[p.id] ? "Copied" : "Copy prompt"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
