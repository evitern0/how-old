# Feature Specification: Photo Timeline View

**Feature Branch**: `003-photo-timeline-view`

**Created**: 2026-08-03

**Status**: Draft

**Input**: User description: "Allow a user to upload up to 5 photos total, one by one or multiple at a time, review the queued files before proceeding, show a new timeline view on the results page with thumbnails in chronological order by capture date, and rework the style of the site a bit to give it a more compact layout."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compare Photos Chronologically (Priority: P1)

As a user, I want to build a small queue of photos and see them arranged in chronological order on the results page so I can compare how the subjects appear over time.

**Why this priority**: This is the main value of the feature and the reason the new timeline exists.

**Independent Test**: Can be fully tested by entering valid people, uploading up to five valid photos across one or more upload actions, and verifying that the queue can be reviewed before continuing and the results page shows one timeline entry per photo in date order.

**Acceptance Scenarios**:

1. **Given** valid people have been entered, **When** the user uploads up to five valid photos across one or more upload actions and then selects Continue, **Then** the results page shows one timeline entry per photo ordered from earliest to latest capture date.
2. **Given** valid people have been entered, **When** the user uploads photos whose capture dates are not in the same order as the selected files, **Then** the queue still accepts the photos and the timeline displays them in chronological order by capture date after the user continues.

---

### User Story 2 - Handle Invalid Batch Selections (Priority: P2)

As a user, I want clear feedback when I choose too many photos or include a photo that cannot be used so I can correct the queue and try again.

**Why this priority**: Batch upload is only useful if the app clearly protects the user from unusable selections.

**Independent Test**: Can be fully tested by attempting to upload more than five photos or a mixed batch containing a non-image file or a photo without a usable capture date, then confirming the app keeps any valid photos, explains which files failed, and lets the user remove or continue only when ready.

**Acceptance Scenarios**:

1. **Given** valid people have been entered, **When** the user selects more than five photos at once, **Then** the app rejects any photos beyond the five-photo limit and tells the user to choose no more than five photos total.
2. **Given** valid people have been entered, **When** the user selects a mixed batch that includes a file without a usable capture date, **Then** the app keeps any valid photos, shows which file failed, and requires the user to remove or replace the unusable item before continuing.

---

### User Story 3 - Scan Results More Easily (Priority: P3)

As a user, I want the site to use a more compact layout so I can review the timeline and age results without excessive scrolling or visual clutter.

**Why this priority**: A tighter presentation improves readability and makes the results page easier to use, but it does not change the core calculation flow.

**Independent Test**: Can be fully tested by completing a successful upload flow and confirming that the results page presents the core controls and timeline in a denser layout that remains readable on common desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** a successful results page is shown, **When** the user reviews it on a common desktop or mobile viewport, **Then** the page presents the key controls and timeline in a compact arrangement that reduces unnecessary whitespace.
2. **Given** a successful results page contains multiple timeline entries, **When** the user scans the page, **Then** the photo order and age results remain easy to read without requiring horizontal scrolling.

---

### Edge Cases

- The user uploads exactly five photos across one or more actions, which must be accepted if all are usable.
- The user uploads fewer than five photos, which must still produce results for every usable photo.
- The user uploads more than five photos total, which must reject only the overflow and keep the accepted photos.
- Two or more photos share the same capture date, which must still produce a stable and predictable order.
- A photo has no readable capture date, which must show an error for that item and require the user to remove or replace it before continuing.
- A photo has a capture date earlier than one or more entered birth dates, which must still display a valid age result according to the existing age rules.
- The timeline includes long person names or many age results, which must not break the compact layout or hide key information.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the user to add up to five photos total across one or more upload actions.
- **FR-002**: System MUST reject any photos beyond the five-photo total limit and clearly tell the user to choose no more than five photos total.
- **FR-003**: System MUST require each accepted photo to have a usable capture date before it can appear in the results view.
- **FR-004**: System MUST show one timeline entry for each accepted photo on the results page.
- **FR-005**: System MUST order timeline entries from earliest to latest by the photos' capture dates.
- **FR-006**: When two timeline entries have the same capture date, the system MUST preserve a stable, predictable order.
- **FR-007**: Each timeline entry MUST include a thumbnail image, the photo's capture date, and the age results for the currently entered people.
- **FR-008**: System MUST preserve the existing person-entry rules and age calculation behavior for each photo in the batch.
- **FR-009**: System MUST show a clear message when a selected photo cannot be used because it is not a valid image or does not have a usable capture date, while preserving any other valid photos already queued.
- **FR-010**: System MUST present the results page in a more compact layout that reduces unnecessary whitespace while remaining readable on common desktop and mobile viewports.
- **FR-011**: System MUST continue to process user-provided people data and uploaded photos locally in the browser by default.

### Key Entities *(include if feature involves data)*

- **Person**: A user-entered individual with a display name and date of birth.
- **Photo Queue**: The current set of accepted photos the user has added so far, up to five total, before proceeding to results.
- **Timeline Entry**: One photo result on the results page, including its thumbnail, capture date, and associated age results.
- **Age Result**: The calculated age for one person at a specific photo's capture date.
- **Results View State**: The active set of timeline entries, current people, and layout presentation for the results page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of users can add up to five photos, review the queue, and identify the chronological order of the results without assistance.
- **SC-002**: In controlled validation, 100% of accepted photos appear in chronological order by capture date, including cases where multiple photos share the same date.
- **SC-003**: At least 95% of successful batch uploads show a visible thumbnail timeline and age results for every accepted photo on the first attempt.
- **SC-004**: At least 90% of users can review the compact results page on a common desktop or mobile viewport without reporting excessive scrolling or visual clutter.

## Assumptions

- The existing people-entry rules and age calculation logic remain the source of truth for every photo in the batch.
- A photo queue may contain a mix of valid and invalid selections during entry, but only usable photos can proceed to results.
- The timeline orders photos by their capture dates and uses a stable order when dates match.
- The compact layout changes presentation density only and does not change the underlying calculation flow or stored session data.
- Uploaded photos are processed only within the active browser session and are not persisted beyond that session unless the user already has an existing app setting that does so.