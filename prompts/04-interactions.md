# Stage 04 — Interactions

> Map user flows, component states, and edge cases end-to-end.

**Deliverables:** Flow diagrams · State inventory · Wireframes · Accessibility audit · Usability report · Ideation outputs · Concept test report

---

## 04-A — Flow Mapping Sessions

**Activity:** Walk each capability end-to-end; map happy path then empty, error, permission, and loading states.  
**Tags:** flows · journeys · happy path

```
Walk a capability end-to-end. Map the happy path first, then introduce failure modes.

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
| Step | User action | System response | Screen state | Failure mode | Recovery |
|------|-------------|-----------------|--------------|--------------|----------|

---
⛔ CHECKPOINT 04-A
Happy path and failure modes confirmed?
No steps missing or in the wrong order?
Reply YES to confirm, or adjust.
```

---

## 04-B — State Audit

**Activity:** For every key object and UI component, enumerate all possible states and stress test with edge cases.  
**Tags:** states · edge cases · components

```
For every key object and UI component in this flow, enumerate all possible states.

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
Reply YES when both sides confirm completeness.
```

---

## 04-C — Wireframe / Concept Review

**Activity:** Present low-fidelity concepts to stakeholders and capture structured feedback before moving to high-fidelity.  
**Tags:** wireframes · feedback · review

```
Facilitate a structured wireframe or concept review with stakeholders. The goal is to gather actionable feedback — not a vote.

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
Reply YES to confirm sign-off on the wireframe direction.
```

---

## 04-D — Accessibility & Inclusion Check

**Activity:** Audit flows against WCAG 2.2 AA criteria and document barriers for assistive technology or diverse user needs.  
**Tags:** accessibility · WCAG · inclusion

```
Audit this flow or set of components against WCAG 2.2 AA and inclusive design principles.

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
Reply YES to confirm the accessibility review is complete.
```

---

## 04-E — Usability Test Synthesis

**Activity:** Run or analyse 5+ task-based sessions and distil findings into a ranked list of friction points with design recommendations.  
**Tags:** usability · testing · synthesis

```
Synthesise findings from a round of usability testing into a prioritised action list.

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
Reply YES to confirm the synthesis is actionable and approved.
```

---

## 04-F — Ideation Workshop

**Activity:** Generate a wide range of design concepts before committing to a direction; score and select concepts to take forward.  
**Tags:** ideation · concepts · design thinking · workshop

```
Generate a wide range of design concepts before committing to any direction. Quantity before quality — defer judgement until after generation.

HMW statements to ideate against: [FILL — paste top 5–8 HMWs from 02-E]
Design principles: [FILL — paste from 02-F]
Constraints to design within: [FILL — technical, time, budget, regulatory]
Participants: [FILL — roles in the room]

PART 1 — WARM-UP (10 min)
Run a quick non-judgement exercise: generate 10 ideas in 5 minutes for a completely different problem.
Goal: get people out of analytical mode and into generative mode.
Ground rule for the whole session: no evaluation, no feasibility filtering, no "but" — defer all judgement.

PART 2 — CONCEPT GENERATION (50 min)
Run 2–3 of the following techniques. Mix individual and group modes. Pick techniques that suit the problem type.

TECHNIQUE A — Crazy 8s (8 min)
Each person folds a sheet of paper into 8 panels.
Set a timer: 1 minute per panel.
Sketch one distinct concept per panel — no words unless essential.
Goal: volume and speed. Silence the inner critic.

TECHNIQUE B — Analogous world (10 min)
Pick 2–3 industries or domains with a structurally similar challenge.
For each analogy: "How would a [hospital / airline / video game / bank] solve our HMW?"
For each analogy, name the mechanism, then translate it directly to our context.
Strong analogies produce concepts that are familiar in feel but novel in application.

TECHNIQUE C — Worst possible idea (8 min)
Generate the worst, most user-hostile, most catastrophic versions of the product.
For each terrible idea, write the direct inversion: what is the exact opposite?
This technique unlocks concepts conventional thinking would skip.

TECHNIQUE D — SCAMPER remix (10 min)
Take an existing product, flow, or concept and systematically apply:
S — Substitute: replace a key element with something else
C — Combine: merge two existing ideas or flows
A — Adapt: borrow a mechanism from another domain
M — Modify / Magnify: exaggerate or minimise one feature
P — Put to other use: repurpose for a different user or moment
E — Eliminate: remove the biggest source of friction entirely
R — Reverse: flip the direction of the interaction or relationship

TECHNIQUE E — "Yes, and…" build (10 min)
Start with one rough concept. Each person adds to it with "yes, and…" — never "but" or "what if instead."
Run for 3 rounds. Document the evolution of the concept after each round.
This technique develops depth rather than breadth — use it on a promising seed concept.

PART 3 — SHARE & BUILD (20 min)
For each concept shared:
- Name the concept (one phrase)
- Describe it in one sentence
- How does it address the HMW?
Note any concepts that spark new ideas or combinations.

PART 4 — CONCEPT CATALOGUE
After sharing, catalogue all concepts:
| Concept name | Technique used | HMW it addresses | Core mechanic (how it works) | What's novel | Rough feasibility |
|--------------|----------------|------------------|------------------------------|--------------|-------------------|

PART 5 — SELECTION & REFINEMENT
Score each concept against the design principles (1–3 per principle).
Select 2–3 concepts to develop further:
- Reason for selection
- What makes this concept worth exploring
- What assumptions it relies on that need testing

---
⛔ CHECKPOINT 04-F
Have we used at least two different generation techniques — not just one mode of thinking?
Have the selected concepts been chosen for their potential, not their familiarity?
Reply YES to confirm, or run another technique before narrowing.
```

---

## 04-G — Concept Testing

**Activity:** Validate early-stage concepts with real users before investing in high-fidelity design.  
**Tags:** concept testing · user research · validation

```
Test 2–3 early-stage concepts with real users before committing to high-fidelity design. The goal is to learn which concept direction works — not to validate a finished design.

Concepts to test: [FILL — names and brief descriptions, or attach sketches/lo-fi representations]
HMW statements they address: [FILL — from 02-E]
User archetype to test with: [FILL — from 02-C, minimum 5 participants]
Key questions we need to answer: [FILL — 3–5 specific questions about concept viability]

SESSION STRUCTURE (45–60 min per participant)

PART 1 — Context setting (5 min)
- Brief the participant on the problem space (not the solution)
- Confirm their relevance to the user archetype
- Set expectations: we're testing early ideas, not finished designs — their honest reaction is the goal

PART 2 — Concept reaction (10–15 min per concept, randomise order)
For each concept:
- First impression (no prompting — what do they notice first?)
- "Tell me what you think this is for"
- "Walk me through how you'd use this"
- "What would make this more useful? What would make it worse?"
- Probe on the specific HMW questions

PART 3 — Concept comparison (10 min)
- "If you had to choose one of these to exist, which would you choose and why?"
- "What would the ideal version look like — could you take parts from each?"

PART 4 — SYNTHESIS
After all sessions:
| Concept | # who understood it | # who preferred it | Key strengths | Key concerns | Critical assumption |
|---------|--------------------|--------------------|---------------|--------------|---------------------|

## Decision recommendation
Based on testing:
- Which concept(s) to take forward
- What to change or combine before moving to wireframes
- What assumptions remain unvalidated and need further testing

---
⛔ CHECKPOINT 04-G
Has the concept direction been confirmed with at least 5 participants?
Are we moving forward because the concept performed well — not because we prefer it?
Reply YES to confirm, or run more sessions if the signal is unclear.
```
