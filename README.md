# AI-Accelerated Design Assistant

A prompt library for experience designers working with AI. Organises reusable prompts across the full design process — from project intake to code generation — with search, filtering, copy, and export.

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

## Prompt library structure

Prompts are organised into seven levels that follow a structured design process:

| Level | Purpose |
|---|---|
| 01 Context | Project brief, stakeholder mapping, constraints register |
| 02 Capabilities | User outcome mapping, gap analysis, persona pressure-testing |
| 03 Objects | OOUX entity inventory, object state mapping |
| 04 Interactions | Flow generation, edge case inventory |
| 05 Alignment | Data contract definition, acceptance criteria generation |
| 06 Build | Scoped code generation, test generation |
| Utility | Research synthesis, decision log, risk log, handoff notes |

Each prompt includes:
- A level and short code (e.g. `01-A`, `U-02`)
- Title and description
- Tags for cross-cutting concerns
- Full prompt body with fill-in placeholders and a checkpoint gate

## Features

- **Search** — filter by title, description, code, or tag
- **Level filter** — narrow to a single level or view all
- **Expand / collapse** — preview the full prompt body inline
- **Copy** — copy any individual prompt to the clipboard
- **Multi-select** — select any combination of prompts
- **Bulk copy** — copy all selected prompts as plain text
- **Export** — download selected prompts as `.md` or `.txt`

## Project structure

```
src/
  App.tsx       # Prompt data, UI, and all interaction logic
  main.tsx      # React entry point
  index.css     # CSS variables and base styles
index.html
vite.config.ts
tsconfig.json
package.json
assets/
  prompt-library-app.tsx   # Original source reference
```
