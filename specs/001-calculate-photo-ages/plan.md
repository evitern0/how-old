# Implementation Plan: Photo Age Lookup

**Branch**: `001-calculate-photo-ages` | **Date**: 2026-08-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-calculate-photo-ages/spec.md`

## Summary

Build a frontend-only React website that accepts one to five people, stores that people list in browser localStorage, parses an uploaded image locally with ExifReader to determine when it was taken, and displays each person’s age at that photo date in years, months, and days. Uploaded image files and derived bytes remain ephemeral in the browser; no backend or remote persistence is used.

## Technical Context

**Language/Version**: JavaScript (ES2022) with React

**Primary Dependencies**: React, React DOM, ExifReader

**Storage**: Browser localStorage for the compact people list only; uploaded image files and derived metadata stay in memory only

**Testing**: Vitest, React Testing Library, and focused browser-level validation for upload and storage behavior

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Frontend web application

**Performance Goals**: Parse a typical photo and render age results within a second on a modern device; keep UI interactions responsive while processing large files locally

**Constraints**: No backend, no network transfer of user-entered data or uploaded files, no persistent image storage, browser-only execution, and graceful failure when metadata cannot be read

**Scale/Scope**: Single-page consumer app with one primary workflow, a small persisted people list, and a small set of reusable UI and calculation modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Local-first privacy: pass. All personal data and photo parsing remain in the browser.
- Metadata truth and transparency: pass. The UI will surface the detected photo date or a failure message when the image cannot be used.
- Deterministic age computation: pass. Age math will be isolated into pure date utilities.
- Inclusive and failure-resilient experience: pass. The flow supports mobile and desktop and keeps the persisted people list separate from ephemeral upload state.
- Testability and browser compatibility: pass. Business logic is isolated and covered by automated tests, with explicit browser support notes.

## Project Structure

### Documentation (this feature)

```text
specs/001-calculate-photo-ages/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── spec.md
```

### Source Code (repository root)

```text
src/
├── components/
├── hooks/
├── lib/
│   ├── age/
│   └── metadata/
├── state/
└── styles/

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Use a single frontend project with React source in `src/` and tests split by scope under `tests/`. There is no backend, no public API surface, and no external contract folder because the feature is UI-only and all behavior is exercised through the browser.

## Complexity Tracking

No constitutional violations require justification. The implementation stays within the baseline frontend-only architecture and avoids unnecessary abstraction.
