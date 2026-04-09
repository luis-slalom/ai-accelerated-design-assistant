# Stage 05 — Alignment

> Agree data contracts and API shapes between design and engineering before build.

**Deliverables:** Screen data manifest · Contract spec · Design tokens · Prototype sign-off notes

---

## 05-A — Data Contract Review

**Activity:** Design presents what the UI needs per screen; engineering confirms what is available, missing, or costly.  
**Tags:** data · API · alignment

```
Design presents what the UI needs per screen. Engineering confirms what is available, what is missing, and what is expensive.

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
Reply YES when both sides have reviewed and agreed. Disagreements must be documented.
```

---

## 05-B — API Shape Agreement

**Activity:** Co-design session to agree request/response shapes and pagination before any code is written.  
**Tags:** API · contracts · engineering

```
Co-design the API request/response shapes before any code is written.

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
Reply YES when both sides confirm. Open questions must be resolved first.
```

---

## 05-C — Design Token & Component Handoff

**Activity:** Define and agree the design token set (colours, type, spacing) and component inventory before build starts.  
**Tags:** tokens · design system · handoff

```
Define the design token set and component inventory that engineering will implement. Nothing should be built before this is agreed.

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
Reply YES when both design and engineering have signed off.
```

---

## 05-D — Prototype Sign-off Session

**Activity:** Structured walkthrough of the high-fidelity prototype with client and engineering leads; capture open decisions and blockers.  
**Tags:** prototype · sign-off · client review

```
Facilitate a prototype sign-off session. The goal is explicit approval from the client before build begins — not just a walkthrough.

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
Reply YES only when all items in the sign-off matrix are confirmed.
```
