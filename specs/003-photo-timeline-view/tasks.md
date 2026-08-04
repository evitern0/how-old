# Tasks: Photo Timeline View

**Input**: Design documents from `/specs/003-photo-timeline-view/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-flow-contract.md

**Tests**: Included because the feature requires automated coverage for queue handling, timeline ordering, and layout regressions.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare test helpers and shared state primitives for the multi-photo queue workflow

- [ ] T001 [P] Add multi-photo queue test helpers for queued uploads and removal in tests/setup.js
- [ ] T002 [P] Add a reusable timeline fixture helper for ordered photo dates in tests/setup.js
- [ ] T003 [P] Create initial upload-queue state helpers in src/state/photoSession.js for accumulated photos and explicit continue gating

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and state handling that all user stories depend on

- [ ] T004 [P] Extend src/state/photoSession.js with queued-photo state, stable sort helpers, and preview URL cleanup for removed photos
- [ ] T005 [P] Add batch photo metadata handling in src/lib/metadata/extractCaptureDate.js call sites so one upload can yield multiple per-file results
- [ ] T006 [P] Add upload-queue persistence and reset behavior boundaries in src/App.jsx without changing localStorage behavior for people
- [ ] T007 [P] Update src/components/UploadScreen.jsx and src/components/PhotoUpload.jsx props to support queued thumbnails, file names, removal controls, and explicit Continue
- [ ] T008 [P] Update src/components/ResultsScreen.jsx and src/components/AgeResults.jsx props to accept ordered timeline entries instead of a single photo state

**Checkpoint**: Queueing, removal, and timeline data structures are ready for story-specific UI work

---

## Phase 3: User Story 1 - Batch Upload and Chronological Timeline (Priority: P1) 🎯 MVP

**Goal**: Let the user upload up to five photos total, one at a time or in batches, and review the accepted photos before continuing

**Independent Test**: Can be verified by entering valid people, adding up to five valid photos across multiple upload actions, seeing thumbnails and file names for accepted photos, removing one queued photo, and continuing only when ready

### Tests for User Story 1

- [ ] T009 [P] [US1] Add integration coverage for accumulating multiple uploads, removing one queued photo, and preventing auto-navigation in tests/integration/app-flow.test.jsx
- [ ] T010 [P] [US1] Add unit coverage for queue limit enforcement and stable removal behavior in tests/unit/photo-session.test.js

### Implementation for User Story 1

- [ ] T011 [P] [US1] Implement queued photo accumulation, per-file validation, and hard five-photo cap in src/App.jsx
- [ ] T012 [P] [US1] Implement queue state helpers, stable ordering, and remove-one-photo behavior in src/state/photoSession.js
- [ ] T013 [P] [US1] Render queued photo thumbnails and file names in src/components/PhotoUpload.jsx
- [ ] T014 [P] [US1] Add remove controls for individual queued photos and explicit Continue gating in src/components/UploadScreen.jsx
- [ ] T015 [US1] Prevent navigation to results until the user selects Continue in src/App.jsx

**Checkpoint**: User Story 1 is independently usable with queued uploads, removal, and manual continue

---

## Phase 4: User Story 2 - Partial Failure Handling and Reporting (Priority: P2)

**Goal**: When the user uploads a mixed batch, keep valid photos, report invalid files by name, and block only the unusable items

**Independent Test**: Can be verified by uploading a batch with a mix of valid images and invalid files, confirming valid photos stay queued, invalid files are identified, and the user remains on the upload screen

### Tests for User Story 2

- [ ] T016 [P] [US2] Add integration coverage for mixed-validity batches, invalid-file messaging, and continued queue preservation in tests/integration/app-flow.test.jsx
- [ ] T017 [P] [US2] Add unit coverage for per-file validation summaries and metadata failure handling in tests/unit/photo-session.test.js

### Implementation for User Story 2

- [ ] T018 [P] [US2] Aggregate per-file upload results and error messages in src/App.jsx so valid photos remain queued when some files fail
- [ ] T019 [P] [US2] Extend src/state/photoSession.js to store file-level validation messages and preserve accepted files from mixed batches
- [ ] T020 [US2] Surface invalid-file names and reasons in src/components/PhotoUpload.jsx without clearing previously accepted photos
- [ ] T021 [US2] Keep the upload screen active after mixed batch failures and only allow progression when the user explicitly continues from a valid queue in src/components/UploadScreen.jsx

**Checkpoint**: User Story 2 can stand alone with robust mixed-batch feedback and no loss of valid queued photos

---

## Phase 5: User Story 3 - Chronological Results Timeline and Compact Layout (Priority: P3)

**Goal**: Replace the current results view with a vertical, evenly spaced timeline ordered by capture date and show the configured people in their original order

**Independent Test**: Can be verified by continuing from a queued upload set and confirming the results page shows oldest-to-newest thumbnails, dots aligned beside each entry, ages listed to the right, people listed in their configured order, and a denser layout without horizontal scrolling

### Tests for User Story 3

- [ ] T022 [P] [US3] Add integration coverage for timeline ordering, stable same-date sorting, and configured-person order in tests/integration/app-flow.test.jsx
- [ ] T023 [P] [US3] Add unit coverage for timeline sort order and age-result mapping in tests/unit/photo-session.test.js
- [ ] T024 [P] [US3] Add layout regression coverage for the compact timeline presentation in tests/integration/app-flow.test.jsx or a dedicated viewport test file under tests/integration/

### Implementation for User Story 3

- [ ] T025 [P] [US3] Build ordered timeline entry data from queued photos in src/state/photoSession.js
- [ ] T026 [P] [US3] Render the vertical timeline structure, thumbnail column, and per-photo result groups in src/components/ResultsScreen.jsx
- [ ] T027 [P] [US3] Update src/components/AgeResults.jsx to render multiple timeline entries while keeping people in configured order and omitting birth dates from the results view
- [ ] T028 [P] [US3] Refresh the compact results layout and timeline styling in src/styles/global.css
- [ ] T029 [US3] Preserve the back-to-people and back-to-upload navigation actions on the new results timeline in src/App.jsx and src/components/ResultsScreen.jsx

**Checkpoint**: User Story 3 fully replaces the old results layout with the requested vertical timeline

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, documentation, and verification across all stories

- [ ] T030 [P] Update quickstart validation notes in specs/003-photo-timeline-view/quickstart.md if any implementation details changed during delivery
- [ ] T031 [P] Review and tighten UI copy for upload limits, removal behavior, and timeline ordering in src/components/PhotoUpload.jsx and src/components/ResultsScreen.jsx
- [ ] T032 Run the full test suite and verify all photo timeline and layout regressions in tests/integration/ and tests/unit/

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup tasks can start immediately.
- Foundational tasks depend on Setup completion and block all user stories.
- User stories can begin after the foundational state and helper work is complete.
- Polish depends on the targeted user stories being implemented.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational work; establishes the upload queue MVP.
- **US2 (P2)**: Depends on the same queue foundation as US1, but remains testable on its own.
- **US3 (P3)**: Depends on queue state and results-entry data from US1/US2, but can be developed after the shared foundation is in place.

### Within Each User Story

- Tests are written before implementation tasks in the same story.
- State helpers and data shaping come before UI rendering updates.
- Story-specific UI is completed before final polish and cross-cutting cleanup.

### Parallel Opportunities

- T001-T003 can run in parallel.
- T004-T008 can run in parallel where file dependencies do not overlap.
- T009-T010 can run in parallel.
- T011-T015 can be split among state, upload, and results files once the foundation lands.
- T016-T021 can run in parallel across test and UI files.
- T022-T029 can run in parallel across timeline logic, results rendering, and styles.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate queued uploads, removal, and explicit continue behavior.

### Incremental Delivery

1. Deliver upload queue MVP with manual continue.
2. Add mixed-batch failure handling and per-file feedback.
3. Replace the results layout with the vertical timeline and compact presentation.
4. Finish with test pass and copy/layout cleanup.

### Parallel Team Strategy

1. One developer handles queue/state helpers.
2. One developer handles upload UI and mixed-batch feedback.
3. One developer handles the results timeline and compact layout.
4. Another developer can extend integration tests in parallel.
