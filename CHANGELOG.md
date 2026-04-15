# Changelog

All notable changes to this project are documented here. Entries are grouped by release date and ordered newest first.

---

## 2026-04-15

### Added
- **02-G — Future state journey narratives**: new Phase 02 activity that generates 6 distinct to-be journey scenarios from service opportunities (3 covering Phase A, 3 covering Phase B), making the future experience tangible before any solution is designed
- **02-H — Front stage interaction mapping**: new Phase 02 activity that maps each user action to its front stage touchpoint(s) and the data captured or actioned, surfacing coverage gaps in the service layer before moving to interaction design
- Both activities are wired into `ACTIVITY_DEFS`, `DEFAULT_PROMPTS`, and `PHASE_DELIVERABLE_HINTS` in `data.ts`, and documented in `prompts/02-capabilities.md`

---

## 2026-04-10

### Added
- **Design system route**: `design-system.html` copied into `public/` so Vite includes it in every build; Vercel rewrite added for clean `/design-system` production URL
- **Design system v1.1 sync**: token corrections, Prompt Library component, Onboarding Banner, mobile header, neutral status tokens, and Linear-style dashboard patterns
- **Favicon assets**: full favicon set (SVG, ICO, 96×96 PNG, Apple touch icon, web app manifest icons) added to `public/` and `assets/favicon/`

### Changed
- **mosAIc rebrand**: app renamed to mosAIc with updated title and identity
- **Prompt Library**: new `PromptLibrary.tsx` view with search, level filter, expand/collapse, copy, multi-select and bulk copy, and `.md` / `.txt` export
- **Mobile responsiveness**: responsive breakpoints applied across Dashboard, ProjectView, PhaseView, and the app shell
- **Onboarding**: new onboarding banner shown to first-time users explaining the tool's purpose and how to get started

---

## 2026-04-08 – 2026-04-09

### Added
- **HCD prompt library** (`prompts/` directory): one Markdown file per stage (01–06 + utility), plus `prompts/guide.md` explaining how the library works and how to chain prompts
- **7 new HCD activities**: Assumptions mapping (01-E), How Might We framing (02-E), Design principles (02-F), Ideation workshop (04-F — Crazy 8s, SCAMPER, analogous world, worst possible idea, yes-and), Concept testing (04-G), Stakeholder map & comms plan (U-05), Discussion guide builder (U-06)
- **Prompt bodies for all 13 CX/XD activities**: full fill-in templates added for 01-C Heuristic audit, 01-D Competitive review, 02-C Personas, 02-D Service blueprint, 03-C Content inventory, 03-D Mental model mapping, 04-C Wireframe review, 04-D Accessibility check, 04-E Usability synthesis, 05-C Design token handoff, 05-D Prototype sign-off, 06-C Live UX review, 06-D Analytics setup

### Changed
- **Slalom brand applied**: Slalom Sans font stack, Slalom Production Blue (`#0c62fb`) phase colour progression sourced from slalom.com, brand gradient token, unified button and chip component palette
- **Phase colours**: updated from rainbow palette to a coherent Slalom Blue progression; fallback token added for unmigrated projects
- **Dashboard editing locked**: edit and delete actions removed from project cards on the dashboard; those actions are available only from the project detail page

---

## 2026-04-07

### Added
- **File upload and link attachments for deliverables**: toggle between uploading a file or adding a URL link against each expected deliverable; simplified deliverable hints
- **Custom activities**: add out-of-standard activities to any phase with a validation banner indicating they are outside the core catalogue
- **Loop-in team chips**: assign team members to individual tasks; engagement chips visible per activity in the phase view
- **Smart alignment suggestions**: design-engineering alignment helpers surface suggestions based on current phase and activity state
- **Team management**: add and manage team members across the project

### Changed
- **Rich text editor extended**: Tiptap-based editor now available for activity write-ups, phase notes, and checkpoint fields (previously only deliverable descriptions)
- **Local dev setup**: reliable `tsx` API server with Vite proxy replacing previous setup; `npm run dev` starts both in one command

### Fixed
- API client now surfaces server error detail in error messages rather than generic failure text

### Infrastructure
- Project storage migrated from `localStorage` to **Vercel Postgres (Neon)** for persistent, cross-device project state

---

## 2026-04-02

### Changed
- **Pivot to Design Project Tracker**: full rewrite of the app from a static prompt library to a structured project tracker organised around the six-stage HCD process
- **Phase views redesigned**: activities shown as structured checklist items with human validation gates and provenance trail for validated activities
- **Checkpoint gates**: process steps established as structured checkpoints within each phase; completion requires explicit human confirmation
- **Activity and phase data refined**: phases and activities updated to match the delivery process spec with correct codes, descriptions, and deliverable hints

---

## 2026-04-01

### Added
- Initial release as a UX prompt library app
- Browse, search, and filter AI prompts for UX activities
- Prompt editing, creation, and deletion with `localStorage` persistence
- Basic mobile-friendly layout
