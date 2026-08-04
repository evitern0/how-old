# Feature Specification: Streamline Input Views

**Feature Branch**: `004-streamline-input-views`

**Created**: 2026-08-04

**Status**: Draft

**Input**: User description: "Make some UI changes across the app to make it a bit more compact and streamlined overall. Specifically focusing on the people and photo upload views."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter People With Less Friction (Priority: P1)

As a user, I want the people entry view to feel more compact and organized so I can add or review people without unnecessary scrolling or visual noise.

**Why this priority**: People entry is the first required step in the core flow. If it feels oversized or cluttered, users encounter friction before they reach the main value of the app.

**Independent Test**: Can be fully tested by opening the app, adding and editing multiple people, and confirming that the people entry view keeps the core fields, validation messages, and next action visible in a tighter layout on common desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** the user is on the people entry view, **When** they review a new person entry before entering any data, **Then** the view shows only two inputs with inline placeholder guidance for name and date of birth, without static labels or helper text above the fields.
2. **Given** the user enters valid information for a person, **When** they press Enter or click Done, **Then** that entry switches to a readonly summary that shows the name and date of birth as text plus an Edit control.
3. **Given** the user edits an existing person, **When** they click Edit, **Then** the original input fields and Done control return so the person can be updated.
4. **Given** one or more people entries are incomplete, invalid, or not marked done, **When** the user attempts to continue, **Then** the app keeps them on the people step and does not allow progression to photo upload.

---

### User Story 2 - Upload Photos More Efficiently (Priority: P2)

As a user, I want the photo upload view to be more streamlined so I can understand the next step quickly, add a photo, and continue without scanning through excess copy or spacing.

**Why this priority**: The upload step is the second critical action in the app and should keep momentum after people entry rather than slowing the user down with a bulky presentation.

**Independent Test**: Can be fully tested by completing the people step, opening the upload view, selecting a valid photo, and confirming that the upload controls, file feedback, and continuation action remain visible and easy to understand in a denser layout.

**Acceptance Scenarios**:

1. **Given** the user has entered valid people and reaches the upload view, **When** the page loads, **Then** the upload instructions, picker control, current file feedback, and next action are presented in a streamlined layout that is easy to scan.
2. **Given** the user selects a valid photo or triggers an upload validation error, **When** the upload view updates, **Then** the resulting status and available actions remain clear without causing avoidable layout jumps or excessive scrolling.
3. **Given** the upload view shows a validation or error message, **When** the user dismisses it, **Then** that message is removed from the current upload view.
4. **Given** the user navigates from upload to results and later returns to upload, **When** the upload screen renders again, **Then** prior validation or error messages are no longer shown.
5. **Given** one or more photos are queued, **When** the user selects Reset on the upload view, **Then** all queued photos are removed and the upload step returns to its initial empty state.

---

### User Story 3 - Move Through Entry Steps With Clear Context (Priority: P3)

As a user, I want the people and upload views to feel visually consistent and lightweight so I can move through the setup flow with confidence and without losing track of where I am.

**Why this priority**: Consistency across the input flow improves comprehension and perceived speed, but it supports the core journey rather than defining it.

**Independent Test**: Can be fully tested by moving from people entry to photo upload and confirming that both views share a compact, coherent presentation while preserving existing labels, actions, and error clarity on common desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** the user moves from the people view to the upload view, **When** they compare both steps, **Then** the spacing, emphasis, and control hierarchy feel consistent enough that the flow reads as one connected experience.
2. **Given** the user uses the app on a common mobile or desktop viewport, **When** they complete the setup flow, **Then** both steps remain readable and usable without horizontal scrolling.

---

### Edge Cases

- The user adds several people with long names, which must not cause the compact layout to overlap controls or hide validation messages.
- The user triggers validation errors on the people step, which must remain clearly visible even if the form is visually denser.
- The user has mixed person-entry states, where some entries are readonly and some are still being edited, which must prevent progression until every remaining entry is valid and explicitly done.
- The user presses Enter while editing a person with invalid data, which must keep the entry editable and surface the validation issues instead of marking it done.
- The user removes a person while that entry is in either editable or readonly mode, which must succeed without disturbing the remaining entries.
- The upload view shows a selected file name that is unusually long, which must remain understandable without breaking the layout.
- The upload view displays an error state for an invalid file, which must remain prominent and actionable in the streamlined presentation.
- The upload view displays one or more dismissible validation messages, which must clear reliably without removing already accepted photos.
- The user returns to the upload view from results after previously seeing file errors, which must preserve the queued photos but not resurrect stale error banners.
- The user switches between common mobile and desktop viewport widths, which must preserve readability and avoid horizontal scrolling on both entry steps.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present the people entry view in a more compact layout that reduces unnecessary whitespace while preserving the existing person entry tasks.
- **FR-002**: System MUST render each new or edited person entry as exactly two input fields, one for name and one for date of birth, with placeholder text inside the inputs and no static labels or helper text above them.
- **FR-003**: System MUST allow a user to mark an individually valid person entry as done either by pressing Enter while editing that entry or by clicking a Done control for that entry.
- **FR-004**: System MUST render a done person entry as readonly text showing the entered name and date of birth, with an Edit control that returns the entry to editable inputs.
- **FR-005**: System MUST prevent progression to the photo upload step while any person entry is invalid or not explicitly marked done.
- **FR-006**: System MUST allow a person entry to be removed in either editable or readonly mode.
- **FR-007**: System MUST replace the existing person remove button text with an `X` control and replace the existing add-person button text with a `+` control while preserving their current behaviors.
- **FR-008**: System MUST present the photo upload view in a more streamlined layout that reduces excess copy or spacing while preserving the existing upload flow.
- **FR-009**: System MUST keep the upload instructions, file selection control, file status feedback, and primary progression action easy to identify within the streamlined upload view.
- **FR-010**: System MUST preserve existing upload validation behavior and error messaging while displaying those states clearly in the updated upload view.
- **FR-011**: System MUST allow the user to dismiss upload validation or error messages without removing already accepted queued photos.
- **FR-012**: System MUST clear upload validation and error messages when the user returns to the upload step from the results screen.
- **FR-013**: System MUST replace the existing remove button text on queued photos with an `X` control while preserving the current per-photo removal behavior.
- **FR-014**: System MUST provide a Reset control on the upload view that removes all queued photos and returns the upload step to its initial empty state.
- **FR-015**: System MUST apply a consistent visual hierarchy across the people and upload views so users can recognize the two steps as part of the same setup flow.
- **FR-016**: System MUST keep both updated views readable and usable on common desktop and mobile viewport sizes without horizontal scrolling.
- **FR-017**: System MUST preserve the app's existing local-first handling of entered people data and uploaded photos.
- **FR-018**: System MUST preserve existing labels and actions closely enough that returning users can still recognize how to complete the setup flow.

### Key Entities *(include if feature involves data)*

- **Person Draft Entry**: The editable state for one person, containing the name input, date-of-birth input, current validation state, and whether the entry can transition to done.
- **Person Finalized Entry**: The readonly state for one person after the user marks a valid entry as done, showing the saved name and date of birth plus actions to edit or remove it.
- **People Entry View**: The step where users manage the list of people to be included in age calculations, including mixed draft/finalized entry states and progression readiness.
- **Photo Upload View**: The step where users select photos, review queued uploads, dismiss upload messages, reset queued photos, and proceed to results.
- **Upload Feedback Message**: A dismissible validation or error notice associated with the current upload screen state but not meant to persist after leaving that step.
- **Setup Flow Presentation**: The shared visual structure, spacing, and emphasis that connect the people and upload views into one coherent input experience.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of users can add, finalize, edit, or remove people and continue to the next step without assistance on their first attempt.
- **SC-002**: At least 90% of users can identify the primary action on both the people and upload views within 5 seconds of each view appearing.
- **SC-003**: At least 95% of successful setup attempts can be completed on common desktop and mobile viewports without horizontal scrolling.
- **SC-004**: In usability review, the updated people and upload views are rated as more compact and easier to scan than the prior versions by a majority of evaluators, including the new per-entry done/edit flow and dismissible upload feedback.

## Assumptions

- The scope is limited to presentation and interaction-flow refinements for the people and photo upload views, not changes to the underlying age calculation or metadata rules.
- Existing validation rules and primary actions remain broadly recognizable even if visible field labels are replaced by placeholders inside editable inputs.
- Common desktop and mobile viewport support continues to follow the project's current browser and layout expectations.
- Any broader visual polish outside the people and upload views is limited to what is necessary to keep these two steps visually consistent with the rest of the app.