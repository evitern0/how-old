# Implementation Plan: Streamline Input Views

**Branch**: `004-streamline-input-views` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-streamline-input-views/spec.md`

## Summary

Refine the existing React/Vite setup flow so the people step uses compact per-person draft and finalized states, only allows progression after every remaining person is valid and explicitly marked done, and the upload step supports dismissible transient feedback, per-photo `X` removal, and a full queue reset while preserving the current local-first metadata and age-calculation behavior.

## Technical Context

**Language/Version**: JavaScript (ES modules) with React 18 on Vite 5

**Primary Dependencies**: react, react-dom, exifreader, heic2any, vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom

**Storage**: Browser localStorage for people entries; uploaded files, preview URLs, and upload feedback remain in-memory for the active session

**Testing**: Vitest unit and integration tests with React Testing Library

**Target Platform**: Modern desktop and mobile browsers with File API, localStorage, and object URL support

**Project Type**: Single-page web application

**Performance Goals**: Keep per-person editing, upload feedback dismissal, queue reset, and screen transitions responsive for up to five people and five photos

**Constraints**: Local-first processing only; no external uploads or API calls; preserve existing metadata extraction and deterministic age calculation behavior; block upload progression until all people entries are valid and explicitly finalized; clear transient upload feedback when leaving the upload step

**Scale/Scope**: Small frontend app with three screens, up to five people, up to five queued photos, and focused changes in `src/components`, `src/state`, `src/lib/validation`, and `tests`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. Local-First Privacy: PASS. The design keeps people in browser storage and keeps uploaded files, preview URLs, and upload feedback in browser memory only.
- II. Metadata Truth and Transparency: PASS. The upload step keeps existing metadata parsing and invalid-file reporting, adds dismissal behavior, and does not hide the underlying capture-date provenance for accepted photos.
- III. Deterministic Age Computation (NON-NEGOTIABLE): PASS. The feature does not alter age math and continues to derive results from the existing calendar-aware utilities.
- IV. Inclusive and Failure-Resilient Experience: PASS. Compact person cards, explicit done/edit states, dismissible upload messages, and upload reset all strengthen recovery paths on mobile and desktop.
- V. Testability and Browser Compatibility: PASS. The design keeps logic concentrated in existing state and validation modules with direct unit and integration test coverage paths.

**Post-Phase-1 Re-check**: PASS. The resulting data model, UI contract, and validation guide preserve the same constitutional guarantees and add explicit tests for the new workflow guards and transient feedback behavior.

## Project Structure

### Documentation (this feature)

```text
specs/004-streamline-input-views/
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
│   ├── PeopleForm.jsx
│   ├── PeopleScreen.jsx
│   ├── PhotoUpload.jsx
│   └── UploadScreen.jsx
├── lib/
│   └── validation/
│       └── peopleValidation.js
├── state/
│   ├── localStorage.js
│   └── photoSession.js
└── styles/
    └── global.css

tests/
├── integration/
│   └── app-flow.test.jsx
└── unit/
    ├── people-form.test.jsx
    └── photo-session.test.js
```

**Structure Decision**: This remains a single frontend application. The feature should extend existing screen components and validation/state helpers rather than introducing new architecture, with regression coverage centered in the current unit and integration test suites.

## Complexity Tracking

No constitution violations require justification.
