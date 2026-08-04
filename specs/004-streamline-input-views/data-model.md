# Data Model: Streamline Input Views

## Overview

This feature extends the existing in-browser setup flow with explicit per-person draft/finalized states and transient upload feedback that can be dismissed or cleared independently of the queued photo data.

## Entities

### 1) PersonEntry

- Purpose: Represents one person row in the setup flow.
- Fields:
  - `id`: stable client-generated string
  - `name`: current display name value
  - `dateOfBirth`: ISO date string in `YYYY-MM-DD` format
  - `status`: `editing` or `done`
- Validation rules:
  - `name` is required and non-empty after trimming
  - `dateOfBirth` must be a real calendar date in `YYYY-MM-DD` format
  - a row may transition to `done` only when both fields are valid
  - people persistence must retain enough row information to restore a ready-to-continue list

### 2) PersonValidationIssue

- Purpose: Captures field-level validation feedback for one person row while it is being edited or blocked from completion.
- Fields:
  - `personId`: reference to the affected `PersonEntry`
  - `name`: optional message for the name field
  - `dateOfBirth`: optional message for the date-of-birth field
- Validation rules:
  - issues appear when the row is incomplete or invalid
  - issues must prevent a row from being marked `done`
  - issues must remain associated with the correct row even after other rows are edited or removed

### 3) PeopleStepState

- Purpose: Represents the derived readiness of the people screen.
- Fields:
  - `normalizedPeople`: ordered `PersonEntry[]`
  - `validPeople`: subset of trimmed valid rows used by downstream age calculations
  - `issuesById`: map of `personId -> PersonValidationIssue`
  - `summary`: optional screen-level guidance
  - `isValid`: whether all remaining rows are field-valid
  - `isReadyToContinue`: whether the list is valid and every row is marked `done`
- Validation rules:
  - the list must contain between one and five people
  - `isReadyToContinue` must be `false` when any row is still `editing`
  - removing a row must recompute readiness immediately

### 4) QueuedPhoto

- Purpose: Represents one accepted uploaded photo that can proceed to results.
- Fields:
  - `id`: stable client-generated string
  - `fileName`: original file name
  - `mimeType`: detected MIME type
  - `previewUrl`: object URL used for thumbnail display
  - `capturedAt`: normalized capture date string
  - `sourceTag`: metadata field used to derive the capture date
  - `status`: parsed upload status retained from existing logic
  - `addedOrder`: zero-based insertion order used for stable ordering
- Validation rules:
  - a queued photo must have a usable `capturedAt` value
  - the queue must never exceed five accepted photos total
  - removing or resetting queued photos must release preview URLs

### 5) UploadFeedbackState

- Purpose: Represents transient upload-step notices that can be dismissed or cleared without touching the durable queue.
- Fields:
  - `status`: `idle`, `loading`, or `ready`
  - `message`: optional loading message
  - `summaryMessage`: optional batch-level status text
  - `fileErrors`: ordered list of file-specific validation messages
  - `isDismissed`: derived or explicit flag indicating whether current feedback has been hidden by the user
- Validation rules:
  - dismissal clears visible feedback for the current upload view
  - feedback must be cleared when leaving upload for results and when returning to upload later
  - clearing feedback must not remove accepted queued photos

### 6) UploadStepState

- Purpose: Holds the durable upload queue plus its current transient feedback.
- Fields:
  - `photos`: `QueuedPhoto[]`
  - `nextAddedOrder`: next stable insertion index
  - `canContinue`: derived boolean based on accepted photos and non-loading status
  - `feedback`: `UploadFeedbackState`
- Validation rules:
  - queue persistence must survive moving between upload and results
  - upload Reset must clear both the queue and the transient feedback
  - per-photo `X` removal must update `canContinue` immediately

## State Transitions

### Person row: editing -> done
- Trigger: User presses Enter inside a valid row or clicks Done.
- Effect: Preserve trimmed field values, mark the row as `done`, and render a readonly summary.

### Person row: done -> editing
- Trigger: User clicks Edit.
- Effect: Restore editable inputs for that row while keeping the current values.

### PEOPLE -> UPLOAD
- Trigger: User selects Continue with `isReadyToContinue === true`.
- Effect: Preserve finalized people rows and show the upload step.

### PEOPLE -> PEOPLE
- Trigger: User adds, edits, finalizes, or removes a person.
- Effect: Recompute field validity and progression readiness.

### PEOPLE -> PEOPLE
- Trigger: User selects Reset.
- Effect: Clear stored people data, replace the list with one blank editable row, and clear dependent upload state.

### UPLOAD -> UPLOAD
- Trigger: User selects files.
- Effect: Keep valid photos, update transient feedback for any loading or file-level issues, and preserve insertion order.

### UPLOAD -> UPLOAD
- Trigger: User dismisses upload feedback.
- Effect: Hide current notices while leaving the accepted queue unchanged.

### UPLOAD -> UPLOAD
- Trigger: User removes one queued photo or selects upload Reset.
- Effect: Remove one photo or clear all photos, release preview URLs, and recompute the empty-state and continue readiness.

### UPLOAD -> RESULTS
- Trigger: User selects Continue with at least one accepted photo.
- Effect: Clear transient upload feedback, preserve the queue, and render results from the queued photos.

### RESULTS -> UPLOAD
- Trigger: User selects Back to upload.
- Effect: Restore the queued photos without restoring prior upload feedback.

### RESULTS -> PEOPLE
- Trigger: User selects Back to people.
- Effect: Restore the current people list and its per-row statuses.

## Persistence Boundary

- Persisted: people entries in browser localStorage, including enough row-status information to preserve or infer readiness for returning users.
- Ephemeral: upload queue, preview URLs, upload feedback messages, file input reset key, and results for the active session.