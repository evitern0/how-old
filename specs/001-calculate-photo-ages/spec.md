# Feature Specification: Photo Age Lookup

**Feature Branch**: `001-calculate-photo-ages`

**Created**: 2026-08-01

**Status**: Draft

**Input**: User description: "Build a modern website which requires a user to first enter between one and five (inclusive) people: their names and date of birth. Then, they can upload an image file from their computer or phone. By examining the image's metadata, the website should then output the date the image was taken along with the age each person they entered at that point in time based upon their respective date of birth. From here a user can upload another image file or change up the people they entered."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Calculate Ages From Photo Date (Priority: P1)

As a user, I want to enter my people list and upload a photo so I can immediately see how old each
person was when that photo was taken.

**Why this priority**: This is the core product value and primary reason users visit the site.

**Independent Test**: Can be fully tested by entering one to five valid people, uploading one image
with a valid captured date in metadata, and verifying that the photo date and per-person ages are
shown in years, months, and days.

**Acceptance Scenarios**:

1. **Given** the user has entered one valid person with name and date of birth, **When** they upload
   an image with a readable captured date in metadata, **Then** the system shows the detected photo
   date and the person's age at that date in years, months, and days.
2. **Given** the user has entered multiple valid people, **When** they upload one image with a
   readable captured date in metadata, **Then** the system shows one age result per person using the
   same detected photo date.

---

### User Story 2 - Reject Unsupported Images (Priority: P2)

As a user, I want to be told when an uploaded file cannot be used so I can pick a different image
instead of guessing the photo date.

**Why this priority**: The app’s promise is to infer the photo date from image metadata; when that
cannot be done, the user should immediately recover by choosing another file.

**Independent Test**: Can be fully tested by entering valid people, uploading a non-image file or an
image with unreadable photo-date metadata, and confirming the app shows a helpful message asking for
a different image file without offering a manual date field.

**Acceptance Scenarios**:

1. **Given** valid people are entered, **When** the uploaded file is not a valid image, **Then** the
  system shows a helpful error explaining that a different image file must be chosen.
2. **Given** valid people are entered, **When** the uploaded image has no readable or parseable
  metadata that indicates when it was taken, **Then** the system shows a helpful message explaining
  that a different image file must be chosen.

---

### User Story 3 - Repeat With New Photos or People (Priority: P3)

As a user, I want to upload another image or edit my people list without restarting so I can compare
different photos quickly.

**Why this priority**: Repeat usage is a key real-world behavior and improves session efficiency.

**Independent Test**: Can be fully tested by completing one successful calculation, then uploading a
second image and editing the people list, and verifying each recalculation reflects the latest
inputs.

**Acceptance Scenarios**:

1. **Given** a completed result is on screen, **When** the user uploads a new image, **Then** the
   system updates the photo date and all age results based on the new image.
2. **Given** a completed result is on screen, **When** the user adds, removes, or edits people and
   triggers recalculation, **Then** the results update to match the latest people list.

---

### Edge Cases

- User attempts to proceed with zero people entered.
- User attempts to enter a sixth person.
- A person record has an empty name or invalid date of birth format.
- The uploaded file is not an image or cannot be parsed.
- The uploaded image has no readable metadata that identifies when it was taken.
- Photo captured date is earlier than one or more entered birth dates.
- Photo captured date is in the future relative to the current date.
- Two people share the same name but have different birth dates.
- Leap-day birthdays and month-end boundaries (for example, Feb 29 or Jan 31) affect year/month/day
  age formatting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the user to enter between one and five people in a single session.
- **FR-002**: Each person entry MUST include a name and date of birth before age calculation can run.
- **FR-003**: System MUST prevent calculation when there are zero valid people.
- **FR-004**: System MUST validate that person birth dates are real calendar dates.
- **FR-005**: System MUST allow image upload from desktop and mobile devices.
- **FR-006**: System MUST attempt to determine the photo captured date from the uploaded image
  metadata and display the resulting date when successful.
- **FR-007**: If the uploaded file is not a valid image or no usable captured date is available from
  metadata, system MUST inform the user that they need to choose a different image file.
- **FR-008**: System MUST calculate each person's age on the effective photo date and present it as
  years, months, and days.
- **FR-009**: System MUST calculate age results for every currently entered person against the same
  effective photo date.
- **FR-010**: System MUST allow the user to upload another image after results are displayed and
  replace prior results with recalculated results.
- **FR-011**: System MUST allow the user to modify the people list after results are displayed and
  recalculate results using the updated list.
- **FR-012**: System MUST provide clear validation or error messages for invalid person input,
  unsupported files, and unreadable metadata.
- **FR-013**: System MUST persist the entered people list in browser localStorage and restore it on
  return within the same browser profile.
- **FR-014**: System MUST allow the user to clear current people, current photo result state, and
  stored people data in the browser without reloading the website.
- **FR-015**: System MUST process user-provided names, birth dates, and uploaded image data locally
  in the browser by default.

### Key Entities *(include if feature involves data)*

- **Person**: Represents one individual entered by the user; includes display name and birth date.
- **Photo Input**: Represents one uploaded image and its derived captured date status (detected or
  manually supplied).
- **Age Result**: Represents the computed age for one person at the effective photo date, split into
  years, months, and days.
- **Session State**: Represents the active in-browser working set of people, current photo context,
  and latest result list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can complete the full flow (enter people, upload photo, view age results)
  in under 2 minutes on first attempt.
- **SC-002**: In controlled validation scenarios, 100% of displayed ages match expected
  years-months-days outputs for an approved test set that includes leap-year and month-end cases.
- **SC-003**: At least 90% of uploads with readable captured dates show results without requiring
  user correction.
- **SC-004**: For invalid image uploads or images without readable metadata dates, at least 95% of
  users understand they must choose a different image file and can recover without external help.
- **SC-005**: At least 85% of users who complete one calculation can successfully run a second
  calculation (new photo or updated people) in the same session without external help.

## Assumptions

- Users can provide accurate birth dates for each person they enter.
- Uploaded images are standard consumer photo formats that can contain capture-date metadata.
- If a metadata date cannot be used, users will choose a different image file rather than supplying
  a manual photo date.
- The feature stores only the people list locally in the browser; uploaded image files and derived
  file bytes are not persisted.
- The website remains usable on modern mobile and desktop browsers in line with project
  compatibility policy.
