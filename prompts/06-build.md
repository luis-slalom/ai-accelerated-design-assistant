# Stage 06 — Build

> Generate and review code only within the scope that has been designed and contracted.

**Deliverables:** Annotated design specs · Deviation log · Live UX review report · Analytics setup doc

---

## 06-A — Scope Boundary Review

**Activity:** Walk the spec and flag anything that exceeds what has been designed or contracted before build starts.  
**Tags:** scope · review · pre-build

```
Before build begins, walk the full spec and flag anything that exceeds what has been designed, contracted, or agreed.

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
Reply YES only when all flags are resolved or formally accepted.
```

---

## 06-B — Incremental Design QA

**Activity:** Design reviews implementation against spec at component level throughout build, not just at the end.  
**Tags:** QA · design review · accessibility

```
Review implementation against spec at the component level. Do not wait until the end.

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
Reply YES only when all critical and major items are resolved.
```

---

## 06-C — Live UX Review

**Activity:** Evaluate the deployed product against the approved prototype and log regressions before release.  
**Tags:** QA · live review · regression

```
Compare the deployed product against the approved prototype and document all regressions before release.

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
Reply YES only when the release candidate is approved by design.
```

---

## 06-D — Analytics & Success Metrics Setup

**Activity:** Confirm instrumentation for agreed KPIs (task completion, error rate, CSAT) is in place and firing correctly.  
**Tags:** analytics · metrics · KPIs

```
Confirm that the agreed success metrics are instrumented, firing correctly, and visible in the analytics platform before launch.

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
Reply YES only when every KPI has a confirmed, tested event and is visible in the dashboard.
```
