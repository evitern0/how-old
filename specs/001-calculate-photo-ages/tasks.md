# Tasks: Photo Age Lookup

**Input**: Design documents from `/specs/001-calculate-photo-ages/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not included. The feature specification does not explicitly request TDD or standalone test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and delivery of each story.

## Format: `- [ ] T001 [P] [US1] Description with exact file path`

- **[P]**: Can run in parallel with other tasks that touch different files and have no dependencies
- **[US#]**: Which user story the task belongs to
- Include exact file paths in each task description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline frontend structure

- [ ] T001 Create the frontend application scaffold and entry files in package.json, index.html, and src/main.jsx
- [ ] T002 Create the root React app shell and base layout in src/App.jsx and src/styles/global.css
- [ ] T003 Add the application dependency list for React and ExifReader in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and state that all user stories depend on

**⚠️ CRITICAL**: No user story work should begin until this phase is complete

- [ ] T004 [P] Create the person data model and validation helpers in src/lib/validation/peopleValidation.js
- [ ] T005 [P] Create calendar-aware age calculation utilities in src/lib/age/calculateAge.js and src/lib/age/dateMath.js
- [ ] T006 [P] Create browser metadata extraction helpers for capture-date parsing in src/lib/metadata/extractCaptureDate.js
- [ ] T007 [P] Create browser localStorage persistence helpers for the people list in src/state/localStorage.js
- [ ] T008 Create shared session-state helpers for people, photo, results, and errors in src/state/photoSession.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Enter People and Read Photo Date (Priority: P1) 🎯 MVP

**Goal**: Let the user enter one to five people, upload a supported image, and see the photo date with each person's age at that date.

**Independent Test**: Enter valid people, upload a supported photo with readable metadata, and confirm the detected photo date plus one years-months-days result per person.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Build the people entry and editing interface in src/components/PeopleForm.jsx
- [ ] T010 [P] [US1] Build the photo upload and capture-date status interface in src/components/PhotoUpload.jsx
- [ ] T011 [P] [US1] Build the age results list and photo date summary in src/components/AgeResults.jsx
- [ ] T012 [US1] Wire the app shell, people input, upload flow, and results rendering together in src/App.jsx
- [ ] T013 [US1] Add session orchestration for applying the selected photo date to every entered person in src/state/photoSession.js

**Checkpoint**: User Story 1 should now be fully functional and independently demonstrable

---

## Phase 4: User Story 2 - Reject Unsupported Images (Priority: P2)

**Goal**: Show a helpful message when the uploaded file is not a valid image or when metadata does not reveal when it was taken, and instruct the user to choose a different image file.

**Independent Test**: Upload a non-image file or an image with unreadable metadata and confirm the app blocks calculation and asks for a different image file without prompting for a manual date.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Add unsupported-file and unreadable-metadata error messaging in src/components/PhotoUpload.jsx
- [ ] T015 [US2] Update metadata parsing flow to surface a failure state instead of a manual-date fallback in src/lib/metadata/extractCaptureDate.js
- [ ] T016 [US2] Preserve valid people entries while showing file-replacement guidance in src/App.jsx

**Checkpoint**: User Story 2 should now be fully functional and independently demonstrable

---

## Phase 5: User Story 3 - Persist People and Reset the Session (Priority: P3)

**Goal**: Persist the people list in browser localStorage, restore it on return, and let the user reset the people list and current photo workflow without reloading.

**Independent Test**: Refresh the page and confirm the people list returns from localStorage while the uploaded image does not, then clear the session and confirm stored people data is removed.

### Implementation for User Story 3

- [ ] T017 [P] [US3] Persist and restore the people list through browser localStorage in src/state/localStorage.js and src/App.jsx
- [ ] T018 [P] [US3] Add clear/reset controls for people data, current photo state, and results in src/components/SessionActions.jsx
- [ ] T019 [US3] Ensure edits to the people list and new photo uploads replace stale results in src/state/photoSession.js

**Checkpoint**: User Stories 1, 2, and 3 should now all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements that affect multiple stories

- [ ] T020 [P] Improve responsive layout, spacing, and visual polish in src/styles/global.css
- [ ] T021 [P] Add a browser-support and privacy note to specs/001-calculate-photo-ages/quickstart.md
- [ ] T022 [P] Verify the project structure and documentation align with the implemented frontend-only architecture in specs/001-calculate-photo-ages/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on completion of the desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase - no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational phase - reuses the upload and metadata helpers from Phase 2
- **User Story 3 (P3)**: Can start after Foundational phase - reuses the people and photo session state from earlier phases

### Within Each User Story

- Foundational utilities before UI wiring
- Shared state before story-specific behaviors
- Core flow before recovery or persistence enhancements
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 and T003 can be worked in parallel with T001 once the app scaffold exists
- T004, T005, T006, and T007 can run in parallel because they touch different helper modules
- T009, T010, and T011 can run in parallel once the foundational helpers are in place
- T014 can run in parallel with T015 because they touch different files
- T017, T018, and T021 can run in parallel in the polish phase

---

## Parallel Example: User Story 1

```bash
Task: "Build the people entry and editing interface in src/components/PeopleForm.jsx"
Task: "Build the photo upload and capture-date status interface in src/components/PhotoUpload.jsx"
Task: "Build the age results list and photo date summary in src/components/AgeResults.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the core photo-age flow before adding fallback or persistence behavior

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 and demonstrate the primary calculation flow
3. Add User Story 2 to cover unsupported image and unreadable metadata cases
4. Add User Story 3 to persist people data and support session reset
5. Finish with polish and documentation updates

### Parallel Team Strategy

1. One developer can own the shared foundation in Phase 2
2. After the foundation is ready, separate developers can work on US1, US2, and US3 in parallel
3. Polish tasks can be split across styling and documentation work

---

## Notes

- [P] tasks can run in parallel when they touch different files and do not depend on incomplete work
- [US#] labels map each task to a user story for traceability
- The list is intentionally implementation-focused because standalone test tasks were not requested
- Keep uploaded image bytes ephemeral; only the people list is persisted locally in the browser
