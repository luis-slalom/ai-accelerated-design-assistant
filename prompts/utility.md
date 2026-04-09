# Utility — Cross-cutting Prompts

> Cross-cutting: research synthesis, decision logs, risk register, retrospectives.

These prompts apply across all stages and are not tied to a specific phase.

---

## U-00 — Global Working Contract

**Activity:** Establishes AI/human ownership boundaries for any session.  
**Tags:** always-on · setup

```
You are a design-led AI collaborator. You accelerate research, synthesis, prototyping, and scoping — but humans own every decision.

Rules that always apply:
- Never skip ahead to a phase the human hasn't approved
- At the end of every output, summarise what was produced and ask for explicit approval before continuing
- Flag risks and open questions immediately — never bury them
- Design intent must be preserved and stated explicitly in every output
- If you are uncertain whether something is signal or noise, ask
```

---

## U-01 — Research Synthesis

**Activity:** Turns raw research material into themes, needs, frustrations, and open questions.  
**Tags:** research · synthesis

```
I have raw research material I need to synthesise.

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
Reply YES to confirm the synthesis is accurate.
```

---

## U-02 — Decision Log Entry

**Activity:** Captures a design decision with full context, rationale, and review trigger.  
**Tags:** documentation · decisions

```
Help me write a decision log entry for the following decision.

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
**Review trigger:** [what would cause us to revisit this?]
```

---

## U-03 — Risk & Open Question Log

**Activity:** Logs risks, assumptions, open questions, and dependencies with owner and resolution date.  
**Tags:** risk · assumptions · documentation

```
Add the following item to the open questions log.

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
**Status:** Open
```

---

## U-04 — Phase Handoff Note

**Activity:** Produces a handoff note at the end of any phase so the next person can continue without losing context.  
**Tags:** handoff · documentation

```
Produce a summary of everything decided and produced in [FILL — phase name and number].

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
Reply YES to confirm. This summary will be saved as the entry point for the next session.
```

---

## U-05 — Stakeholder Map & Comms Plan

**Activity:** Map all stakeholders by influence and interest; define how and when to engage each group throughout the project.  
**Tags:** stakeholders · communications · alignment

```
Map all stakeholders on this project by influence and interest, and define how to engage each group throughout.

Project name: [FILL]
Project phase: [FILL — or "whole project"]
Stakeholders identified so far: [FILL — list names and roles]

PART 1 — STAKEHOLDER INVENTORY
For each stakeholder:
| Name | Role / organisation | Relationship to project | Communication preference | Availability |
|------|--------------------|-----------------------|--------------------------|--------------|

PART 2 — INFLUENCE / INTEREST MAPPING
Classify each stakeholder:

**High influence, high interest** — Manage closely. Involve in key decisions.
**High influence, low interest** — Keep satisfied. Don't overwhelm with detail.
**Low influence, high interest** — Keep informed. They're your advocates.
**Low influence, low interest** — Monitor. Minimal effort unless they move quadrants.

| Stakeholder | Influence (H/M/L) | Interest (H/M/L) | Quadrant | Engagement strategy |
|-------------|------------------|-----------------|----------|---------------------|

PART 3 — COMMUNICATION PLAN
For each stakeholder group, define:
- **Cadence** — how often to communicate
- **Format** — meeting / email / Slack / shared doc
- **Content** — what they need to know at each stage
- **Decision rights** — what they approve vs. what they are informed about
- **Risk of misalignment** — what happens if we don't manage them well

PART 4 — OBJECTION REGISTER
Who is most likely to push back, and what will they say?
For each high-risk stakeholder: the most likely objection and a prepared response.

---
⛔ CHECKPOINT U-05
Have we identified every person who could block or derail this project?
Does everyone on the team know who to escalate to and when?
Reply YES to confirm, or add missing stakeholders.
```

---

## U-06 — Discussion Guide Builder

**Activity:** Create a structured interview or workshop guide with screener criteria, warm-up questions, and task scenarios.  
**Tags:** research · interview · facilitation · discussion guide

```
Create a structured discussion guide for a user research session — interviews, usability tests, or co-design workshops.

Research objective: [FILL — what question(s) are we trying to answer?]
Session type: [FILL — depth interview / usability test / co-design workshop]
Participant profile / screener: [FILL — who are we recruiting and why?]
Session length: [FILL — recommended 45–60 min for interviews, 60–90 min for usability]
Number of sessions: [FILL — minimum 5 for generative research]

PART 1 — RECRUITMENT SCREENER
Qualifying criteria (must meet all):
- [FILL — role, behaviour, or experience that qualifies them]

Disqualifying criteria:
- [FILL — e.g. "works at a competitor", "already involved in our product"]

Screener questions (3–5 short-answer or multiple choice):
1. [FILL]
2. [FILL]
3. [FILL]

PART 2 — SESSION GUIDE

**Warm-up (5–10 min)**
Build rapport and gather context. Do not lead.
- Tell me about your role and what a typical day looks like for you.
- How do you currently handle [topic area]?
- [FILL — 1–2 more open context questions]

**Core exploration (25–35 min)**
Dig into the research questions. Use probes, not leading questions.
- [FILL — 4–6 main questions, starting broad and going deeper]
- Key probes: "Tell me more about that", "What did you do next?", "How did that make you feel?", "Can you show me?"

**Task scenarios** (if usability test, 15–20 min)
For each task:
- Scenario setup (context without leading to the answer)
- Task prompt (what to do, not how)
- Observation focus (what to watch for)

**Closing (5–10 min)**
- Is there anything about [topic] I haven't asked that you think is important?
- If you could change one thing about how you currently [topic], what would it be?
- Can you recommend anyone else we should speak to?

PART 3 — FACILITATION NOTES
- What to do if a participant goes off-topic
- How to handle strong opinions or emotional responses
- How to handle silence (don't fill it)
- Priming phrases to actively avoid

---
⛔ CHECKPOINT U-06
Has the discussion guide been piloted with one internal team member before going live?
Are all questions open-ended and free of leading language?
Reply YES to confirm, or revise before sessions begin.
```
