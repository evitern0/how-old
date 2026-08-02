# Implementation Plan: Declutter Screen Flow

**Branch**: `002-declutter-screen-flow` | **Date**: 2026-08-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-declutter-screen-flow/spec.md`

## Summary

Refactor the current single-screen workflow into three distinct screens (People, Image Upload, Results) without changing age-calculation, metadata-extraction, validation, or privacy behavior. Use explicit screen-state transitions and targeted component composition so the UI is less cluttered while preserving existing business logic and local-only data handling.

## Technical Context

**Language/Version**: JavaScript (ES2022) with React 18

**Primary Dependencies**: React, React DOM, ExifReader, Vite

**Storage**: Browser localStorage for people list only; uploaded image stays in-memory for processing/preview

**Testing**: Vitest, React Testing Library, @testing-library/user-event, jsdom

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Frontend web application (single Vite project)

**Performance Goals**: Keep screen transitions and form interactions effectively instant; maintain current image-parse-to-result responsiveness for typical phone photos on modern devices

**Constraints**: No backend, no network transfer of personal data or uploaded files, no functional changes to age/math/metadata logic, preserve existing local persistence semantics

**Scale/Scope**: One user workflow split into 3 screens with shared state and existing reusable business-logic modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- I. Local-First Privacy: PASS. The change is UI flow only and keeps all personal data and file processing in-browser.
- II. Metadata Truth and Transparency: PASS with explicit continuation of current behavior. On metadata failure, user remains on upload screen and must choose a different image (no manual date fallback in this feature).
- III. Deterministic Age Computation (NON-NEGOTIABLE): PASS. Existing calculation modules remain unchanged and continue to provide deterministic output.
- IV. Inclusive and Failure-Resilient Experience: PASS. Multi-screen flow includes forward/backward navigation and retains entered people data while handling upload errors in place.
- V. Testability and Browser Compatibility: PASS. Logic/UI separation is preserved and flow changes are covered with integration and unit updates.

### Post-Phase 1 Design Re-Check

- I. Local-First Privacy: PASS. Data model and contracts keep people persistence local and photo data ephemeral.
- II. Metadata Truth and Transparency: PASS. Upload contract explicitly defines success/failure transitions and no manual-date fallback.
- III. Deterministic Age Computation (NON-NEGOTIABLE): PASS. No new age algorithms or date transformations introduced.
- IV. Inclusive and Failure-Resilient Experience: PASS. Navigation/state contract preserves user progress when moving between screens.
- V. Testability and Browser Compatibility: PASS. Quickstart scenarios include mobile/desktop flow checks and regression checks for unchanged results.

## Project Structure

### Documentation (this feature)

```text
specs/002-declutter-screen-flow/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── AgeResults.jsx
│   ├── PeopleForm.jsx
│   ├── PhotoUpload.jsx
│   └── SessionActions.jsx
├── lib/
│   ├── age/
│   │   ├── calculateAge.js
│   │   └── dateMath.js
│   ├── metadata/
│   │   └── extractCaptureDate.js
│   └── validation/
│       └── peopleValidation.js
├── state/
│   ├── localStorage.js
│   └── photoSession.js
└── styles/
    └── global.css

tests/
├── setup.js
├── integration/
│   └── app-flow.test.jsx
└── unit/
    ├── age-format.test.js
    ├── local-storage.test.js
    ├── metadata-extract.test.js
    └── people-form.test.jsx
```

**Structure Decision**: Keep the existing single-project frontend structure. Implement screen separation via stateful flow orchestration in `src/App.jsx`, reuse existing feature components, and keep business logic in `src/lib/` and persistence in `src/state/`.

## Complexity Tracking

No constitutional violations require justification.

## Constitution Compliance Notes (Implementation)

- Local-first privacy preserved: people data remains in localStorage only, and uploaded photo data remains in-memory.
- Metadata truth preserved: on metadata failure, flow stays on Upload and requires another image (no manual date fallback).
- Deterministic age computation preserved: age/date math modules were not modified.
- Failure resilience improved: explicit back/return navigation allows correction without losing valid people data.
- Testability maintained: integration and unit tests were expanded for new screen flow and regressions.
