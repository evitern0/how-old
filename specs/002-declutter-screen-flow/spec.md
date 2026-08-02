# Feature Specification: Declutter Screen Flow

**Feature Branch**: `002-declutter-screen-flow`

**Created**: 2026-08-02

**Status**: Draft

**Input**: User description: "Declutter the UI a bit. Break apart the workflow into separate pages/screens. No real change to functionality.

Page 1. People page. Enter people names and dates of birth. A 'Continue' button brings the user to the next screen. A 'Reset' button clears the form.

Page 2. Image upload page. A back button brings the user back to the people form. When an image is uploaded which a date can be successfully extracted from, the user is brought to the third and final page/screen.

Page 3. Results page. Show the peoples' ages at the time the photo was taken. Include a small thumbnail of the photo that was uploaded at the top. There should be one button to take the user back to the image upload page, and another button to take the user back to the people page."

## Clarifications

### Session 2026-08-02

- Q: When photo metadata does not provide a usable capture date, should this feature keep the current behavior of requiring a different image, or introduce a manual date entry fallback before allowing results? → A: Keep current behavior and require a different image.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Three-Screen Flow (Priority: P1)

As a user, I want to move through separate screens for people entry, image upload, and results so the process feels clearer and less cluttered while preserving the same outcome.

**Why this priority**: This is the main requested change and directly defines the new user experience.

**Independent Test**: Can be fully tested by entering valid people data on the first screen, continuing to image upload, uploading a valid image with a readable capture date, and confirming navigation to the results screen.

**Acceptance Scenarios**:

1. **Given** the user is on the People screen with valid people entries, **When** they select Continue, **Then** the system navigates to the Image Upload screen and keeps entered people data.
2. **Given** the user is on the Image Upload screen and uploads an image with a successfully extracted photo date, **When** extraction succeeds, **Then** the system navigates to the Results screen and displays computed ages for all entered people.

---

### User Story 2 - Navigate Backward Without Losing Work (Priority: P2)

As a user, I want clear back-navigation controls so I can revise inputs without restarting the entire session.

**Why this priority**: Multi-screen flows require reliable backward movement to remain usable.

**Independent Test**: Can be fully tested by moving from People to Image Upload to Results, then using each back-navigation button and confirming the expected target screen and retained data.

**Acceptance Scenarios**:

1. **Given** the user is on the Image Upload screen, **When** they select Back, **Then** the system returns to the People screen with previously entered people data still present.
2. **Given** the user is on the Results screen, **When** they select the button to return to image upload, **Then** the system navigates to the Image Upload screen and preserves the existing people data.
3. **Given** the user is on the Results screen, **When** they select the button to return to people entry, **Then** the system navigates to the People screen for further edits.

---

### User Story 3 - Reset and Re-run Sessions Quickly (Priority: P3)

As a user, I want to reset people data from the People screen and re-run uploads from the Results screen so I can quickly start over or iterate.

**Why this priority**: Fast retry and reset behavior supports real-world repeat use without adding complexity.

**Independent Test**: Can be fully tested by entering people data, using Reset on the People screen, and verifying the form is cleared; then completing a calculation and returning to prior screens to run another image.

**Acceptance Scenarios**:

1. **Given** the user is on the People screen with one or more entries, **When** they select Reset, **Then** the people form is cleared and any related session state tied to the people list is reset.
2. **Given** the user has reached the Results screen, **When** they return to Image Upload and submit another valid image, **Then** the results refresh based on the same current people list and the newly extracted photo date.

---

### Edge Cases

- User selects Continue on the People screen with no valid people entered.
- User selects Continue with one or more invalid person rows (empty name or invalid birth date).
- User uses Reset after entering the maximum allowed people and confirms all rows clear correctly.
- User uploads an invalid file type or an image without a readable capture date while on the Image Upload screen.
- User navigates back from Results to People, edits people, then continues and uploads a new image.
- User reaches Results with valid data but the photo preview thumbnail cannot be rendered; age results must still remain visible.
- User refreshes the browser while on Image Upload or Results and expects existing people data persistence behavior to remain unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present the workflow as three distinct screens: People, Image Upload, and Results.
- **FR-002**: People screen MUST allow entering, editing, and validating people names and dates of birth using the current people rules and limits.
- **FR-003**: People screen MUST provide a Continue control that advances to the Image Upload screen only when people input is valid.
- **FR-004**: People screen MUST provide a Reset control that clears the people form and associated people session state.
- **FR-005**: Image Upload screen MUST provide a Back control that returns to the People screen without discarding valid people data.
- **FR-006**: Image Upload screen MUST preserve existing upload behavior and attempt photo-date extraction from uploaded images.
- **FR-007**: When photo-date extraction succeeds, system MUST automatically navigate from Image Upload to Results.
- **FR-008**: When upload or metadata extraction fails, system MUST keep the user on Image Upload, show actionable error feedback, and require the user to choose a different image instead of offering manual date entry fallback.
- **FR-009**: Results screen MUST show each entered person's age at the extracted photo date using the current age output format.
- **FR-010**: Results screen MUST display a small thumbnail preview of the uploaded photo near the top of the screen.
- **FR-011**: Results screen MUST provide one control to navigate back to Image Upload and one control to navigate back to People.
- **FR-012**: Introducing separate screens MUST NOT change the underlying age calculation logic, metadata extraction rules, or existing validation rules.
- **FR-013**: Existing persistence behavior for people data MUST remain unchanged across the new screen-based flow.
- **FR-014**: Core flow interactions (People -> Upload -> Results and backward navigation) MUST remain usable on common mobile and desktop viewport sizes.
- **FR-015**: User-provided personal data and uploaded photo data MUST continue to be processed locally in the browser by default.

### Key Entities *(include if feature involves data)*

- **People Entry**: A list of one to five person records, where each record includes a name and date of birth.
- **Workflow Screen State**: The currently active screen in the three-screen flow and allowed navigation actions from that state.
- **Uploaded Photo Context**: The currently selected photo, extraction status, extracted effective photo date, and thumbnail preview reference used for the results view.
- **Age Result Set**: The collection of age outputs for all current people at one effective photo date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of users complete the full three-screen flow (People -> Upload -> Results) on their first attempt without guidance.
- **SC-002**: At least 95% of users correctly identify where to go next using in-screen navigation controls (Continue, Back, and return buttons) during usability testing.
- **SC-003**: For a controlled regression test set, 100% of calculated age outputs on the Results screen match the baseline outputs from the pre-change workflow.
- **SC-004**: At least 90% of users can return from Results to either prior screen and continue their intended task within 15 seconds.
- **SC-005**: At least 95% of successful uploads show both age results and a visible photo thumbnail on the Results screen.

## Assumptions

- The existing business rules for number of people, required fields, validation messages, age computation, and metadata extraction remain the source of truth.
- The screen split is a presentation and navigation change only; no new user roles or permissions are introduced.
- The uploaded photo thumbnail can be derived from the same in-session image source used for metadata extraction.
- Existing local persistence for people data continues to be reused without changing user-facing persistence expectations.
- Accessibility and responsiveness standards already applied in the project continue to apply to all three screens.
