# Tasks: Streamline Input Views

**Input**: Design documents from `/specs/004-streamline-input-views/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-flow-contract.md

**Tests**: Included because the constitution requires automated coverage for all behavior changes and the feature explicitly changes flow gating, upload feedback handling, and layout behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (`US1`, `US2`, `US3`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared fixtures and styling hooks for the compact setup-flow refactor

- [ ] T001 [P] Add person-row status and upload-feedback test fixtures in tests/setup.js
- [x] T002 [P] Add compact setup-flow style tokens and symbol-button utility classes in src/styles/global.css
- [ ] T003 [P] Add task-specific quickstart notes for compact people and upload flows in specs/004-streamline-input-views/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared state and persistence model required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Extend person normalization and readiness validation for `editing` and `done` row states in src/lib/validation/peopleValidation.js
- [x] T005 [P] Extend people persistence and legacy hydration for finalized rows in src/state/localStorage.js
- [x] T006 [P] Split durable queued-photo helpers from transient upload-feedback helpers in src/state/photoSession.js
- [x] T007 Update flow orchestration to track people readiness, transient upload feedback, and reset boundaries in src/App.jsx
- [x] T008 Align shared screen prop contracts for finalized people rows and upload feedback controls in src/components/PeopleScreen.jsx
- [x] T009 Align shared screen prop contracts for upload reset and dismissible feedback in src/components/UploadScreen.jsx

**Checkpoint**: Shared workflow state, persistence, and screen contracts are ready for story work

---

## Phase 3: User Story 1 - Enter People With Less Friction (Priority: P1) 🎯 MVP

**Goal**: Let users manage people as compact rows that move between editable and finalized states before upload

**Independent Test**: Open the people screen, add rows, finalize valid people with Done or Enter, edit finalized rows, remove rows in either mode, and confirm Continue stays blocked until every remaining row is valid and done

### Tests for User Story 1

- [x] T010 [P] [US1] Add integration coverage for finalize, edit, remove, and continue-gating behavior in tests/integration/app-flow.test.jsx
- [x] T011 [P] [US1] Add unit coverage for person readiness, mixed row states, and invalid Enter handling in tests/unit/people-form.test.jsx
- [x] T012 [P] [US1] Add persistence coverage for finalized-row hydration and reset behavior in tests/unit/local-storage.test.js

### Implementation for User Story 1

- [x] T013 [P] [US1] Implement row-status helpers, finalize transitions, and readiness summaries in src/lib/validation/peopleValidation.js
- [x] T014 [P] [US1] Persist finalized person rows and legacy stored-person fallback behavior in src/state/localStorage.js
- [x] T015 [US1] Update people-step handlers, Enter-to-Done behavior, and continue gating in src/App.jsx
- [x] T016 [US1] Rebuild compact editable and finalized person-row rendering with `+`, `Done`, `Edit`, and `X` controls in src/components/PeopleForm.jsx
- [x] T017 [US1] Update people-step actions and readiness messaging in src/components/PeopleScreen.jsx
- [x] T018 [US1] Apply compact person-row layout, placeholder-driven inputs, and readonly summary styling in src/styles/global.css

**Checkpoint**: User Story 1 is independently functional with compact person entry and explicit row finalization

---

## Phase 4: User Story 2 - Upload Photos More Efficiently (Priority: P2)

**Goal**: Preserve queued photos while making upload feedback dismissible, resettable, and visually consistent with the compact controls

**Independent Test**: Reach upload with finalized people, upload valid and invalid files, dismiss any feedback, return from results without stale messages, remove one photo with `X`, and reset the queue without affecting people

### Tests for User Story 2

- [x] T019 [P] [US2] Add integration coverage for dismissing upload feedback and clearing it on return from results in tests/integration/app-flow.test.jsx
- [x] T020 [P] [US2] Add integration coverage for upload `X` removal and upload Reset behavior in tests/integration/app-flow.test.jsx
- [x] T021 [P] [US2] Add unit coverage for transient upload-feedback helpers and queue-preserving resets in tests/unit/photo-session.test.js

### Implementation for User Story 2

- [x] T022 [P] [US2] Implement transient upload-feedback creation, dismissal, and clearing helpers in src/state/photoSession.js
- [x] T023 [US2] Update upload orchestration to clear feedback on navigation, support upload reset, and preserve queued photos in src/App.jsx
- [x] T024 [US2] Render dismissible upload notices and per-photo `X` controls in src/components/PhotoUpload.jsx
- [x] T025 [US2] Add upload-step Reset and feedback-dismiss actions in src/components/UploadScreen.jsx
- [x] T026 [US2] Apply compact upload queue, feedback banner, and symbol-button styling in src/styles/global.css

**Checkpoint**: User Story 2 is independently functional with dismissible upload feedback and queue reset behavior

---

## Phase 5: User Story 3 - Move Through Entry Steps With Clear Context (Priority: P3)

**Goal**: Make the people and upload views feel visually consistent, compact, and readable across common viewport sizes

**Independent Test**: Move through people and upload on desktop and narrow layouts, confirm consistent hierarchy, readable controls, and no horizontal scrolling while preserving all new actions

### Tests for User Story 3

- [x] T027 [P] [US3] Add integration coverage for compact people and upload layout regressions in tests/integration/app-flow.test.jsx
- [x] T028 [P] [US3] Add component-level rendering assertions for compact screen actions and accessible symbol controls in tests/unit/people-form.test.jsx

### Implementation for User Story 3

- [x] T029 [P] [US3] Tighten shared copy, step framing, and action hierarchy across src/components/PeopleScreen.jsx
- [x] T030 [P] [US3] Tighten shared copy, step framing, and action hierarchy across src/components/UploadScreen.jsx
- [x] T031 [P] [US3] Refresh the shared compact layout rhythm, responsive behavior, and action alignment in src/styles/global.css
- [x] T032 [US3] Reconcile app-shell and screen-container spacing with the streamlined setup flow in src/App.jsx

**Checkpoint**: User Story 3 completes the compact, consistent setup-flow presentation without breaking earlier stories

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation alignment, and release-readiness checks

- [ ] T033 [P] Update workflow documentation for finalized people rows and upload reset behavior in README.md
- [ ] T034 [P] Record any final validation adjustments for the compact setup flow in specs/004-streamline-input-views/quickstart.md
- [ ] T035 [P] Capture final constitution compliance notes for local-first state, transient feedback, and automated coverage in specs/004-streamline-input-views/plan.md
- [ ] T036 Run the full regression suite for streamlined input views in tests/integration/app-flow.test.jsx
- [ ] T037 Run the production build verification for the streamlined input views changes in package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all targeted user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion and defines the MVP for compact people entry
- **User Story 2 (P2)**: Starts after Foundational completion and depends on the shared upload-feedback boundaries from Phase 2, but remains independently testable once the people step can produce finalized rows
- **User Story 3 (P3)**: Starts after Foundational completion and layers presentation consistency on top of the working behaviors from US1 and US2

### Within Each User Story

- Tests are written before implementation tasks in the same story
- State and validation helpers come before screen-level rendering changes
- Screen orchestration updates come before final layout polish
- Each story should be validated independently before moving to the next priority

### Parallel Opportunities

- T001-T003 can run in parallel
- T004-T006 can run in parallel, followed by T007-T009 once the helper directions are set
- T010-T012 can run in parallel
- T013-T014 can run in parallel before T015-T018
- T019-T021 can run in parallel
- T022 and T024 can proceed in parallel before T023 and T025 converge the flow
- T027-T031 can run in parallel across tests, copy, and styles

---

## Parallel Example: User Story 1

```bash
# Parallel test work for compact people entry
Task: "T010 [US1] Add integration coverage in tests/integration/app-flow.test.jsx"
Task: "T011 [US1] Add unit coverage in tests/unit/people-form.test.jsx"
Task: "T012 [US1] Add persistence coverage in tests/unit/local-storage.test.js"

# Parallel helper work for finalized people rows
Task: "T013 [US1] Implement row-status helpers in src/lib/validation/peopleValidation.js"
Task: "T014 [US1] Persist finalized person rows in src/state/localStorage.js"
```

---

## Parallel Example: User Story 2

```bash
# Parallel upload feedback coverage
Task: "T019 [US2] Add dismiss-and-return coverage in tests/integration/app-flow.test.jsx"
Task: "T020 [US2] Add remove-and-reset coverage in tests/integration/app-flow.test.jsx"
Task: "T021 [US2] Add upload-feedback helper coverage in tests/unit/photo-session.test.js"

# Parallel UI/state work for upload feedback
Task: "T022 [US2] Implement transient feedback helpers in src/state/photoSession.js"
Task: "T024 [US2] Render dismissible notices and X controls in src/components/PhotoUpload.jsx"
```

---

## Parallel Example: User Story 3

```bash
# Parallel consistency and layout work
Task: "T027 [US3] Add compact layout regression coverage in tests/integration/app-flow.test.jsx"
Task: "T029 [US3] Tighten people-step framing in src/components/PeopleScreen.jsx"
Task: "T030 [US3] Tighten upload-step framing in src/components/UploadScreen.jsx"
Task: "T031 [US3] Refresh shared compact layout styling in src/styles/global.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate compact person entry independently before expanding scope

### Incremental Delivery

1. Build shared state and persistence support for finalized people rows and transient upload feedback
2. Deliver User Story 1 as the MVP for compact people entry and guarded progression
3. Deliver User Story 2 for dismissible upload feedback and queue reset
4. Deliver User Story 3 for consistent compact presentation across steps
5. Finish with regression tests, build verification, and documentation cleanup

### Parallel Team Strategy

1. One developer handles people validation and persistence helpers
2. One developer handles upload feedback state and queue reset behavior
3. One developer handles compact screen layout and responsive styling
4. Another developer can extend integration and unit coverage in parallel

---

## Notes

- `[P]` tasks target separate files to reduce merge conflicts
- `[USx]` labels map tasks directly to story outcomes for traceability
- Keep metadata extraction and age-calculation behavior unchanged unless a regression fix is required
- Preserve local-only data handling and transient upload-feedback boundaries throughout implementation