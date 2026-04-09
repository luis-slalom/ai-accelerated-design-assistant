# Stage 03 — Objects

> Identify and agree the core entities the product creates, stores, and acts on.

**Deliverables:** Object model · Domain glossary · Content inventory · Mental model diagram

---

## 03-A — Entity Discovery Workshop

**Activity:** Collaborative session to name core things the product creates, stores, or acts on.  
**Tags:** entities · OOUX · modelling

```
Facilitate a collaborative entity discovery session with design, engineering, and product.

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
Reply YES when everyone in the room has confirmed this list.
```

---

## 03-B — Relationship Mapping

**Activity:** Draw how entities relate — ownership, containment, reference; agree cardinality.  
**Tags:** relationships · cardinality · modelling

```
For each confirmed entity, map how it relates to every other entity.

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
Reply YES when both design and engineering agree.
```

---

## 03-C — Content Inventory & Audit

**Activity:** Catalogue all content types (labels, copy, media) the product needs; flag gaps, duplicates, or tone inconsistencies.  
**Tags:** content · copy · IA

```
Produce a content inventory for the product and audit it for gaps, duplicates, and tone issues.

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
Reply YES to confirm.
```

---

## 03-D — Mental Model Mapping

**Activity:** Align the user's conceptual model of the domain with the system's entity model to surface naming and structural conflicts.  
**Tags:** mental model · IA · naming

```
Map the user's mental model of this domain and compare it to the system's entity model to find conflicts and alignment risks.

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
Reply YES to confirm, or flag assumptions that need validation.
```
