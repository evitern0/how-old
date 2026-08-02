# Tasks: Declutter Screen Flow

**Input**: Design documents from `/specs/002-declutter-screen-flow/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include regression and flow tests to satisfy constitution quality gates for behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared flow and test scaffolding for the screen-based refactor

- [X] T001 Define screen-state constants and transition helper signatures in src/state/photoSession.js
- [X] T002 Add three-screen flow fixtures and upload-result test data helpers in tests/setup.js
- [X] T003 [P] Add shared screen container and button-group style tokens in src/styles/global.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core orchestration and session primitives required before user-story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement central workflow state machine (PEOPLE, UPLOAD, RESULTS) in src/App.jsx
- [X] T005 [P] Extend people session reset/restore helpers to support screen-based flow in src/state/localStorage.js
- [X] T006 [P] Add upload context helpers for preview URL lifecycle and cleanup in src/state/photoSession.js
- [X] T007 Wire flow-level callbacks and shared state plumbing across existing feature components in src/App.jsx
- [X] T008 Add foundational integration test harness for explicit screen transitions in tests/integration/app-flow.test.jsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Three-Screen Flow (Priority: P1) 🎯 MVP

**Goal**: Deliver a decluttered three-screen flow that moves valid users from people entry to upload to results on metadata success

**Independent Test**: Enter valid people on People screen, continue to Upload, upload metadata-valid image, verify automatic navigation to Results with age outputs and thumbnail

### Tests for User Story 1

- [X] T009 [P] [US1] Add happy-path flow test (People -> Upload -> Results) in tests/integration/app-flow.test.jsx
- [X] T010 [P] [US1] Add unit assertions for unchanged age output formatting in tests/unit/age-format.test.js
- [X] T011 [P] [US1] Add upload-success metadata extraction assertions tied to flow transition in tests/unit/metadata-extract.test.js

### Implementation for User Story 1

- [X] T012 [P] [US1] Create People screen wrapper component with Continue and Reset actions in src/components/PeopleScreen.jsx
- [X] T013 [P] [US1] Create Upload screen wrapper component with upload content region and Back action placeholder in src/components/UploadScreen.jsx
- [X] T014 [P] [US1] Create Results screen wrapper component with thumbnail header and result action region in src/components/ResultsScreen.jsx
- [X] T015 [US1] Update people form rendering and validation gating for Continue enablement in src/components/PeopleForm.jsx
- [X] T016 [US1] Update photo upload success callback to trigger RESULTS transition in src/components/PhotoUpload.jsx
- [X] T017 [US1] Integrate PeopleScreen, UploadScreen, and ResultsScreen into screen-state renderer in src/App.jsx
- [X] T018 [US1] Render uploaded image thumbnail preview above age results in src/components/AgeResults.jsx

**Checkpoint**: User Story 1 should now be functional and testable independently

---

## Phase 4: User Story 2 - Navigate Backward Without Losing Work (Priority: P2)

**Goal**: Ensure backward navigation controls reliably return to prior screens without losing valid people data

**Independent Test**: Move from People to Upload to Results, use Upload Back and both Results return buttons, verify expected destinations and preserved people data

### Tests for User Story 2

- [X] T019 [P] [US2] Add upload-back-to-people preservation test in tests/integration/app-flow.test.jsx
- [X] T020 [P] [US2] Add results return-to-upload navigation test in tests/integration/app-flow.test.jsx
- [X] T021 [P] [US2] Add results return-to-people navigation test in tests/integration/app-flow.test.jsx

### Implementation for User Story 2

- [X] T022 [US2] Implement Upload screen Back control and handler wiring in src/components/UploadScreen.jsx
- [X] T023 [US2] Implement Results screen Return to Upload and Return to People controls in src/components/ResultsScreen.jsx
- [X] T024 [US2] Ensure navigation actions preserve people list and do not clear valid entries in src/App.jsx
- [X] T025 [US2] Refine cross-screen action labels/placement for mobile and desktop usability in src/styles/global.css

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Reset and Re-run Sessions Quickly (Priority: P3)

**Goal**: Allow quick reset from People screen and smooth re-run uploads from Results while preserving unchanged business rules

**Independent Test**: Reset entered people on People screen and verify cleared form; from Results return to Upload and submit another valid image to refresh results

### Tests for User Story 3

- [X] T026 [P] [US3] Add people-reset behavior test for clearing form/session state in tests/unit/people-form.test.jsx
- [X] T027 [P] [US3] Add results re-run upload refresh test in tests/integration/app-flow.test.jsx
- [X] T028 [P] [US3] Add localStorage persistence regression check across screen navigation in tests/unit/local-storage.test.js

### Implementation for User Story 3

- [X] T029 [US3] Implement People screen Reset action wiring to clear form and people session state in src/components/PeopleScreen.jsx
- [X] T030 [US3] Ensure reset flow clears persisted people and dependent result context in src/App.jsx
- [X] T031 [US3] Keep upload failure behavior on UPLOAD screen with actionable errors and no manual date fallback in src/components/PhotoUpload.jsx
- [X] T032 [US3] Ensure second successful upload from RESULTS path recomputes and replaces result set in src/App.jsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, consistency, and release-readiness checks across stories

- [X] T033 [P] Update user-facing workflow documentation for three-screen navigation in README.md
- [X] T034 Validate quickstart scenarios and record any deviations in specs/002-declutter-screen-flow/quickstart.md
- [X] T035 Run full automated test suite and fix regressions in tests/integration/app-flow.test.jsx
- [X] T036 [P] Capture constitution compliance notes for privacy, metadata transparency, and determinism in specs/002-declutter-screen-flow/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all targeted user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational completion; depends on US1 screen structure to attach return controls
- **User Story 3 (P3)**: Starts after Foundational completion; depends on US1/US2 navigation flow for reset and re-run scenarios

### Within Each User Story

- Tests should be authored first and verified failing before implementation updates
- Screen wrappers before orchestration wiring
- Orchestration wiring before UI polish
- Story validation before moving to next priority

## Parallel Opportunities

- Phase 1 tasks T003 can run in parallel with T001-T002
- Phase 2 tasks T005-T006 can run in parallel after T004 begins
- In US1, T009-T011 and T012-T014 can be parallelized by separate contributors
- In US2, T019-T021 can run in parallel while T022-T023 are implemented
- In US3, T026-T028 can run in parallel while T029-T032 are implemented in sequence
- In Phase 6, T033 and T036 can run in parallel with test execution prep

---

## Parallel Example: User Story 1

```bash
# Parallel test work
Task: "T009 [US1] Add happy-path flow test in tests/integration/app-flow.test.jsx"
Task: "T010 [US1] Add unit assertions in tests/unit/age-format.test.js"
Task: "T011 [US1] Add metadata transition assertions in tests/unit/metadata-extract.test.js"

# Parallel component scaffolding
Task: "T012 [US1] Create src/components/PeopleScreen.jsx"
Task: "T013 [US1] Create src/components/UploadScreen.jsx"
Task: "T014 [US1] Create src/components/ResultsScreen.jsx"
```

---

## Parallel Example: User Story 2

```bash
# Parallel navigation test additions
Task: "T019 [US2] Add upload-back-to-people preservation test in tests/integration/app-flow.test.jsx"
Task: "T020 [US2] Add results return-to-upload navigation test in tests/integration/app-flow.test.jsx"
Task: "T021 [US2] Add results return-to-people navigation test in tests/integration/app-flow.test.jsx"
```

---

## Parallel Example: User Story 3

```bash
# Parallel reset and persistence regressions
Task: "T026 [US3] Add people-reset behavior test in tests/unit/people-form.test.jsx"
Task: "T027 [US3] Add re-run upload refresh test in tests/integration/app-flow.test.jsx"
Task: "T028 [US3] Add localStorage persistence regression check in tests/unit/local-storage.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate User Story 1 independently against quickstart Scenario 1
5. Demo/deploy MVP if ready

### Incremental Delivery

1. Setup + Foundational establish flow infrastructure
2. Deliver US1 for end-to-end primary value
3. Deliver US2 for reliable backward navigation
4. Deliver US3 for reset and repeat-session efficiency
5. Finish with polish and full regression verification

### Parallel Team Strategy

1. Pair on Phase 1 and Phase 2 to stabilize orchestration contract
2. After foundation is stable:
   - Developer A: US1 integration and screen wrappers
   - Developer B: US2 navigation controls and tests
   - Developer C: US3 reset/persistence regressions
3. Merge behind green integration/unit suite

---

## Notes

- [P] tasks target separate files to reduce merge conflicts
- [USx] labels map tasks directly to story outcomes for traceability
- Keep age/date/metadata logic unchanged unless a regression fix is required
- Preserve local-only data handling and no-manual-date-fallback rule throughout implementation
