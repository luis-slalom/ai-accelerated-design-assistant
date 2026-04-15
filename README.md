# AI-Accelerated Design Assistant

A project management and prompt library tool for experience designers working with AI. Organises reusable prompts across a six-stage HCD process — from project intake to code QA — with per-project tracking, deliverable management, and AI prompt scaffolding.

## Stack

- React 18
- TypeScript 5
- Vite 5

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Design process

The tool follows a six-stage Human-Centred Design (HCD) process, plus a cross-cutting Utility stage:

| Stage | Purpose | Deliverables |
|---|---|---|
| **01 Context** | Understand the project, users, and constraints | Project brief · Assumption register · Heuristic audit · Competitive review · Assumptions map |
| **02 Capabilities** | Define what users need to do — in outcomes, not features | Capability map · Personas · As-is service blueprint · HMW statements · Future state journey narratives · Front stage interaction map · Design principles |
| **03 Objects** | Name and model the core entities the product acts on | Object model · Domain glossary · Content inventory · Mental model diagram |
| **04 Interactions** | Map flows, states, and edge cases end-to-end | Flow diagrams · State inventory · Wireframes · Accessibility audit · Usability report · Ideation outputs · Concept test report |
| **05 Alignment** | Agree data contracts and API shapes before build | Screen data manifest · Contract spec · Design tokens · Prototype sign-off notes |
| **06 Build** | Generate and QA code within agreed scope | Annotated design specs · Deviation log · Live UX review report · Analytics setup doc |
| **Utility** | Cross-cutting: research synthesis, decisions, risk, comms | Decision log · Risk register · Stakeholder map · Discussion guides · Handoff notes |

## Activity catalogue

32 pre-built activities across all stages:

| Code | Activity |
|---|---|
| 01-A | Stakeholder kickoff |
| 01-B | User research digest |
| 01-C | Heuristic audit |
| 01-D | Competitive & analogous review |
| 01-E | Assumptions mapping |
| 02-A | Jobs-to-be-done mapping |
| 02-B | Outcome prioritisation |
| 02-C | Persona & segment definition |
| 02-D | Service blueprint (as-is) |
| 02-E | How Might We framing |
| 02-G | Future state journey narratives |
| 02-H | Front stage interaction mapping |
| 02-F | Design principles |
| 03-A | Entity discovery workshop |
| 03-B | Relationship mapping |
| 03-C | Content inventory & audit |
| 03-D | Mental model mapping |
| 04-A | Flow mapping sessions |
| 04-B | State audit |
| 04-C | Wireframe / concept review |
| 04-D | Accessibility & inclusion check (WCAG 2.2 AA) |
| 04-E | Usability test synthesis |
| 04-F | Ideation workshop (Crazy 8s, SCAMPER, analogous world, worst possible idea, yes-and) |
| 04-G | Concept testing |
| 05-A | Data contract review |
| 05-B | API shape agreement |
| 05-C | Design token & component handoff |
| 05-D | Prototype sign-off session |
| 06-A | Scope boundary review |
| 06-B | Incremental design QA |
| 06-C | Live UX review |
| 06-D | Analytics & success metrics setup |
| U-00 | Global working contract |
| U-01 | Research synthesis |
| U-02 | Decision log entry |
| U-03 | Risk & open question log |
| U-04 | Phase handoff note |
| U-05 | Stakeholder map & comms plan |
| U-06 | Discussion guide builder |

## Features

- **Project tracking** — create projects and track progress through each stage
- **Per-stage deliverables** — upload files or add links against each expected deliverable
- **Activity scaffolding** — structured prompts with fill-in placeholders and checkpoint gates
- **Custom activities** — add activities outside the standard set for any phase
- **Rich text notes** — per-phase notes with formatting support
- **Search** — filter the prompt library by title, description, code, or tag
- **Level filter** — narrow to a single stage or view all
- **Expand / collapse** — preview the full prompt body inline
- **Copy** — copy any prompt to the clipboard
- **Multi-select & bulk copy** — select multiple prompts and copy as plain text
- **Export** — download selected prompts as `.md` or `.txt`

## Prompt library

The `prompts/` directory contains the full AI prompt library as plain Markdown files — one file per stage. Start with [prompts/guide.md](prompts/guide.md) for an overview of how the library is structured and how to chain prompts across stages.

| File | Contents |
|---|---|
| [prompts/guide.md](prompts/guide.md) | How the library works — start here |
| [prompts/01-context.md](prompts/01-context.md) | 01-A through 01-E |
| [prompts/02-capabilities.md](prompts/02-capabilities.md) | 02-A through 02-H |
| [prompts/03-objects.md](prompts/03-objects.md) | 03-A through 03-D |
| [prompts/04-interactions.md](prompts/04-interactions.md) | 04-A through 04-G |
| [prompts/05-alignment.md](prompts/05-alignment.md) | 05-A through 05-D |
| [prompts/06-build.md](prompts/06-build.md) | 06-A through 06-D |
| [prompts/utility.md](prompts/utility.md) | U-00 through U-06 |

## Project structure

```
src/
  App.tsx           # Root app shell and routing
  data.ts           # Activity definitions, phase templates, prompt bodies, phase colours
  types.ts          # TypeScript types for Project, Phase, Activity, Prompt
  alignment.ts      # Design-engineering alignment helpers
  api.ts            # API layer
  storage.ts        # Local persistence
  index.css         # CSS variables, Slalom brand tokens, base styles
  main.tsx          # React entry point
  components/
    RichTextEditor.tsx  # Tiptap-based rich text editor
    RichTextView.tsx    # Read-only rich text renderer
  views/
    Dashboard.tsx       # Project list and creation
    ProjectView.tsx     # Per-project phase overview
    PhaseView.tsx       # Phase detail: activities, deliverables, notes
prompts/
  guide.md          # How the prompt library works — start here
  01-context.md     # Stage 01 prompts
  02-capabilities.md
  03-objects.md
  04-interactions.md
  05-alignment.md
  06-build.md
  utility.md        # Cross-cutting prompts (U-00 to U-06)
index.html
vite.config.ts
tsconfig.json
package.json
assets/
  prompt-library-app.tsx   # Original source reference
```
