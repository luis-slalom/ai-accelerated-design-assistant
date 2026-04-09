# Stage 01 — Context

> Understand the project, its users, and its constraints before any design work begins.

**Deliverables:** Project brief · Assumption register · Heuristic audit report · Competitive review · Assumptions map

---

## 01-A — Stakeholder Kickoff

**Activity:** Structured interview to capture goals, risks, non-negotiables, and definition of success.  
**Tags:** kickoff · stakeholders · discovery

```
You are facilitating a structured stakeholder kickoff interview. Your goal is to surface goals, risks, non-negotiables, and what success looks like — before any design work begins.

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
Reply YES to confirm, or correct anything before moving forward.
```

---

## 01-B — User Research Digest

**Activity:** Synthesise existing research or lightweight interviews into a 1-page insight brief.  
**Tags:** research · synthesis · discovery

```
Help me synthesise existing research or lightweight interview notes into a 1-page insight brief.

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
Reply YES to confirm.
```

---

## 01-C — Heuristic Audit

**Activity:** Evaluate existing product or touchpoints against recognised UX principles; produce a scored issue list with severity ratings.  
**Tags:** heuristics · audit · UX review

```
Conduct a heuristic audit of the existing product or touchpoint using Nielsen's 10 Usability Heuristics as the evaluation framework.

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

Severity scale: 0 = not a problem · 1 = cosmetic · 2 = minor · 3 = major · 4 = catastrophic

After the table, produce:

## Top 5 priority issues
Ranked by severity × frequency of encounter.

## Quick wins
Issues that can be fixed with minimal effort and high impact.

---
⛔ CHECKPOINT 01-C
Has the audit been reviewed by at least one other team member?
Do the severity scores reflect the actual user impact for this specific audience?
Reply YES to confirm, or adjust scores and recommendations.
```

---

## 01-D — Competitive & Analogous Review

**Activity:** Benchmark 3–5 competitors and 2–3 analogous experiences to identify patterns, gaps, and opportunities.  
**Tags:** competitive · benchmarking · discovery

```
Conduct a structured competitive and analogous review to identify design patterns, gaps, and opportunities.

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
Reply YES to confirm, or add missing products before we proceed.
```

---

## 01-E — Assumptions Mapping

**Activity:** Document and rank all project assumptions before research begins to prevent untested beliefs from driving design decisions.  
**Tags:** assumptions · hypotheses · discovery

```
Before research begins, make all assumptions explicit so we can validate or invalidate them — not design around them unknowingly.

Project name / brief: [FILL — paste from kickoff summary]
Phase we're entering: [FILL]

STEP 1 — Assumption harvest
List every assumption the team is currently making about:
- **Users** — who they are, what they want, how they behave
- **Business** — goals, constraints, what success looks like
- **Technology** — what is technically feasible or already built
- **Market** — competitive dynamics, user expectations, timing
- **Process** — how the team will work, what approvals look like

Assumptions identified: [FILL — brainstorm freely, one per line]

STEP 2 — Classification & ranking
For each assumption:

| Assumption | Category (user / business / tech / market / process) | Confidence (H/M/L) | Impact if wrong (H/M/L) | How to validate |
|------------|------------------------------------------------------|-------------------|-------------------------|-----------------|

STEP 3 — Priority action list
Sort by: Low confidence × High impact = most dangerous assumptions.

For each high-priority assumption:
- What do we need to learn to confirm or disprove it?
- What research activity will give us that evidence?
- When do we need the answer by?

---
⛔ CHECKPOINT 01-E
Have we surfaced assumptions from every discipline — design, engineering, product, business?
Are the high-impact, low-confidence assumptions covered in our research plan?
Reply YES to confirm, or add missing assumptions before research begins.
```
