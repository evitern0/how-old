# Implementation Plan: Photo Timeline View

**Branch**: `003-photo-timeline-view` | **Date**: 2026-08-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-photo-timeline-view/spec.md`

## Summary

Extend the existing React/Vite photo-age app so users can accumulate up to five photos total, add them one by one or in batches, review selected filenames and thumbnails before continuing, remove any queued photo before proceeding, and then see a vertical results timeline ordered by capture date with evenly spaced entries, thumbnails, and age results for each configured person in their original order. Keep all file processing local to the browser and retain the current people-entry and age-calculation rules.

## Technical Context

**Language/Version**: JavaScript (ES modules) with React 18 on Vite

**Primary Dependencies**: react, react-dom, exifreader, vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom

**Storage**: Browser localStorage for people only; uploaded files, preview URLs, and timeline state remain in-memory for the session

**Testing**: Vitest with React Testing Library integration and unit tests

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-page web application

**Performance Goals**: Keep upload, removal, and timeline rendering responsive for up to five photos and a small people list

**Constraints**: Local-first processing only; no external upload or API calls; maximum of five total photos; preserve existing people validation, metadata extraction, and age computation behavior; results timeline spacing must remain uniform regardless of date gaps

**Scale/Scope**: Small frontend app with three screens and a single results timeline

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. Local-First Privacy: PASS. Uploaded photos and people data stay in-browser; nothing new requires a network hop.
- II. Metadata Truth and Transparency: PASS. The design continues to expose capture-date provenance and surfaces per-file metadata failures.
- III. Deterministic Age Computation (NON-NEGOTIABLE): PASS. Results remain driven by the existing calendar-aware age utilities, with stable ordering for equal dates.
- IV. Inclusive and Failure-Resilient Experience: PASS. The flow keeps mobile/desktop usability, clear invalid-file feedback, and recovery paths for partial batches.
- V. Testability and Browser Compatibility: PASS. The change is isolated to UI/state modules that already have unit and integration coverage patterns.

## Project Structure

### Documentation (this feature)

```text
specs/003-photo-timeline-view/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-flow-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.jsx
├── components/
├── lib/
├── state/
└── styles/

tests/
├── integration/
└── unit/
```

**Structure Decision**: This remains a single frontend application. The feature will extend the existing `src/components`, `src/state`, `src/lib`, and `src/styles` layers, with automated coverage in `tests/integration` and `tests/unit`.

## Complexity Tracking

No constitution violations require justification.
