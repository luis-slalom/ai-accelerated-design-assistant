# Stage 02 — Capabilities

> Define what users need to be able to do — in outcomes, not features.

**Deliverables:** Capability map · Out-of-scope log · Personas · As-is service blueprint · HMW statements · Design principles

---

## 02-A — Jobs-to-be-Done Mapping

**Activity:** For each user type: the job, desired outcome, current pain point, and definition of done.  
**Tags:** JTBD · outcomes · users

```
For each key user type, help me articulate the job they are hiring this product to do.

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
Reply YES to confirm, or adjust before moving to prioritisation.
```

---

## 02-B — Outcome Prioritisation

**Activity:** MoSCoW or impact/effort sort with stakeholders; produces a ranked list of user outcomes.  
**Tags:** prioritisation · MoSCoW · outcomes

```
Help me run an outcome prioritisation with stakeholders.

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
Reply YES to confirm the list is locked, or adjust before we move to object modelling.
```

---

## 02-C — Persona & Segment Definition

**Activity:** Consolidate research into 2–4 validated archetypes with goals, frustrations, and behavioural tendencies.  
**Tags:** personas · segments · users

```
Based on the research digest and JTBD mapping, help me define 2–4 user archetypes for this product.

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
Reply YES to confirm, or adjust before we proceed to service blueprinting.
```

---

## 02-D — Service Blueprint (as-is)

**Activity:** Map the current end-to-end experience across frontstage actions, backstage processes, and supporting systems.  
**Tags:** service blueprint · journey · as-is

```
Map the current end-to-end experience as a service blueprint — before we design any improvements.

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
Reply YES to confirm, or correct inaccuracies before we proceed.
```

---

## 02-E — How Might We Framing

**Activity:** Reframe research insights as design opportunities using HMW statements to bridge Define and Ideate.  
**Tags:** HMW · ideation · opportunities · design thinking

```
Reframe the insights and frustrations from research as design opportunities using How Might We (HMW) statements.

Research insights to reframe: [FILL — paste from 01-B insight brief or research synthesis]
User frustrations / pain points to reframe: [FILL — paste key themes]
Jobs to be done: [FILL — paste from 02-A]

HOW TO WRITE HMW STATEMENTS
- Start with "How might we…"
- Address one problem at a time (not too broad, not too narrow)
- Imply possibility without prescribing a solution
- Test: if the answer is obvious, the HMW is too narrow; if anything would answer it, it's too broad

For each major insight or frustration, generate 3–5 HMW statements at different levels of abstraction:

## [Insight or frustration title]
**Insight:** [one sentence summary]
- HMW [narrow reframe] — specific to this pain point
- HMW [mid-level reframe] — addresses the underlying need
- HMW [broad reframe] — opens up systemic opportunity
- HMW [alternative angle] — reframes who or what is the focus
- HMW [provocative reframe] — challenges an assumption

After generating all HMWs:

## HMW prioritisation
Select the 5–8 most promising HMW statements to take into ideation:
- Most likely to unlock a differentiated solution
- Directly tied to a must-have user outcome from Phase 02
- Within our sphere of influence to address

---
⛔ CHECKPOINT 02-E
Do these HMW statements reflect the real user problems — not our preferred solutions?
Have we picked HMWs that challenge assumptions rather than confirm existing plans?
Reply YES to confirm, or refine before we move into ideation.
```

---

## 02-F — Design Principles

**Activity:** Establish 3–5 project-specific principles derived from user values that guide every design decision.  
**Tags:** design principles · criteria · vision

```
Establish the design principles that will guide every decision made on this project — from concept to delivery.

Research and insight sources: [FILL — paste from insight brief, JTBD map, and personas]
Product context: [FILL — transactional / emotional / informational / collaborative]
Stakeholder priorities: [FILL — from kickoff summary]

WHAT MAKES A GOOD DESIGN PRINCIPLE
- Actionable: it helps us make a decision (not just a value statement)
- Specific to this project: reflects what we learned from users, not generic good design
- Testable: we can evaluate a design decision against it
- Memorable: 3–5 words with a short explanation

For each principle, produce:

## [Principle name — short, memorable phrase]
**In practice:** [2–3 sentences describing what this means for design decisions]
**This means we will:** [2–3 concrete examples of decisions this principle guides]
**This means we won't:** [1–2 things this principle rules out]
**Derived from:** [which user insight or stakeholder priority informed this]

After all principles:

## Principle tensions
Where do the principles pull in different directions? How do we resolve conflicts between them?

## Principle test
For each principle: apply it to a concrete design problem we're already facing. Does it give useful guidance?

---
⛔ CHECKPOINT 02-F
Are these principles grounded in research — not just values we already held?
Would a designer new to the project be able to use these to make the right call?
Reply YES to confirm, or refine before they become the guiding criteria for the project.
```
