# Prompt Library — Guide

> How this library works, how to read each file, and how to chain prompts across the design process.

---

## What this library is

This is a structured set of AI prompts for experience designers. Each prompt is a reusable, fill-in template designed to accelerate a specific design activity — while keeping humans in control of every decision.

The library follows a six-stage HCD (Human-Centred Design) process, plus a Utility stage for cross-cutting activities. The stages are sequential: each one builds on outputs from the one before.

---

## How the stages connect

```
01 Context → 02 Capabilities → 03 Objects → 04 Interactions → 05 Alignment → 06 Build
                                                                                    ↑
                              U  Utility (applies across all stages) ───────────────┘
```

| Stage | Purpose | Key output fed into |
|---|---|---|
| **01 Context** | Understand the project, users, and constraints | 02, all stages |
| **02 Capabilities** | Define what users need to be able to do | 03, 04 |
| **03 Objects** | Name and model the core entities | 04, 05 |
| **04 Interactions** | Map flows, states, and edge cases | 05 |
| **05 Alignment** | Agree data contracts before build | 06 |
| **06 Build** | Generate and QA code within agreed scope | — |
| **Utility** | Cross-cutting: research, decisions, risk, comms | All stages |

---

## Files in this directory

| File | Stage |
|---|---|
| [01-context.md](01-context.md) | 01 — Context |
| [02-capabilities.md](02-capabilities.md) | 02 — Capabilities |
| [03-objects.md](03-objects.md) | 03 — Objects |
| [04-interactions.md](04-interactions.md) | 04 — Interactions |
| [05-alignment.md](05-alignment.md) | 05 — Alignment |
| [06-build.md](06-build.md) | 06 — Build |
| [utility.md](utility.md) | Utility — cross-cutting |

---

## How to read a prompt file

Each stage file opens with:
- A one-line purpose statement
- A list of expected deliverables for that stage

Each prompt then includes:

```
## [Code] — [Title]

**Activity:** What this prompt produces.
**Tags:** keywords for cross-referencing

` ` `
[The prompt body — copy this directly into your AI assistant]
` ` `
```

### Prompt codes

Codes follow the pattern `[stage]-[letter]` or `U-[number]`:

| Code | Meaning |
|---|---|
| `01-A` | Stage 01, first activity |
| `04-F` | Stage 04, sixth activity |
| `U-02` | Utility, second activity |

---

## Conventions used in every prompt

### FILL placeholders

`[FILL — description]` marks every place you must supply project-specific information before using the prompt. Never run a prompt with unfilled placeholders — the output will be generic and unreliable.

### CHECKPOINT gates

Every prompt ends with a `⛔ CHECKPOINT` block:

```
---
⛔ CHECKPOINT [code]
[One or two questions to confirm the output is accurate]
Reply YES to confirm, or correct anything before moving forward.
```

**The checkpoint is mandatory.** Do not proceed to the next prompt until the current output has been confirmed. This is how design intent is preserved — and how you avoid compounding errors across stages.

### Tags

Tags on each prompt indicate cross-cutting concerns:
- **always-on** — U-00 applies to every session, not just one activity
- **discovery / synthesis / documentation** — phase of the design process
- **JTBD / OOUX / HMW / SCAMPER** — methodology references

---

## How to chain prompts

Outputs from one prompt become inputs to the next. The most common chains:

**Discovery chain:**
`01-B` (research digest) → `02-A` (JTBD mapping) → `02-C` (personas) → `02-D` (service blueprint)

**Definition chain:**
`02-E` (HMW framing) + `02-F` (design principles) → `04-F` (ideation workshop) → `04-G` (concept testing)

**Object modelling chain:**
`03-A` (entity discovery) → `03-B` (relationship mapping) → `05-A` (data contract review)

**Build-ready chain:**
`04-A` (flow mapping) → `04-B` (state audit) → `05-A` (data contract) → `05-B` (API shapes) → `06-A` (scope boundary review)

Look for `[FILL — paste from X]` in each prompt — this is the explicit handoff point where the previous output slots in.

---

## Starting a session

Begin every session with **U-00 — Global Working Contract** (in [utility.md](utility.md)). This sets the AI's operating rules for the session:
- Humans own every decision
- No phase is skipped without explicit approval
- Risks and open questions are flagged immediately

Paste U-00 at the top of your conversation before any other prompt.

---

## Utility prompts — when to use them

| Prompt | Use when |
|---|---|
| **U-00** Global working contract | Start of every session |
| **U-01** Research synthesis | You have raw research material to process |
| **U-02** Decision log entry | A significant decision has been made |
| **U-03** Risk & open question log | A risk or blocker has surfaced |
| **U-04** Phase handoff note | Wrapping up a stage or handing off to another person |
| **U-05** Stakeholder map & comms plan | Kicking off a new project or entering a complex stakeholder environment |
| **U-06** Discussion guide builder | Preparing for user interviews, usability tests, or co-design workshops |

---

## Tips for getting reliable outputs

1. **Fill every placeholder** before pasting a prompt. The more specific your inputs, the more specific the output.
2. **Paste outputs between prompts.** When a prompt says `[FILL — paste from 02-A]`, paste the actual content — not a summary.
3. **Confirm checkpoints in writing.** A verbal "yes" in a meeting is not enough. Reply YES in the AI conversation so the exchange is recorded.
4. **Run U-02 after every significant decision.** Decision logs created during a session are easy to lose — capture them immediately.
5. **Don't skip stages.** Each stage gates the next. If 03 Objects is skipped, 05 Alignment has no entity model to reference and the data contracts will be incomplete.
