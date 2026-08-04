# Data Model: Photo Timeline View

## Overview

This feature extends the existing in-browser people and photo workflow with a queued photo set and a results timeline. The current person entity and age computation behavior remain unchanged.

## Entities

### 1) PersonEntry

- Purpose: Captures one person used in age calculations.
- Fields:
  - `id`: stable client-generated string
  - `name`: trimmed display name
  - `birthDate`: ISO date string in `YYYY-MM-DD`
- Validation rules:
  - name is required and non-empty after trimming
  - birthDate must be a real calendar date in `YYYY-MM-DD` format
  - the active list must contain between one and five people before continuing

### 2) QueuedPhoto

- Purpose: Represents one uploaded photo that has been accepted into the upload queue.
- Fields:
  - `id`: stable client-generated string
  - `fileName`: original file name
  - `mimeType`: detected MIME type
  - `previewUrl`: object URL used for the thumbnail
  - `capturedAt`: normalized capture date string
  - `sourceTag`: metadata field used to derive the capture date
  - `status`: `parsed`, `missing-metadata`, or `unsupported`
  - `errorMessage`: optional user-facing validation message
  - `addedOrder`: zero-based insertion order used to preserve stable ties
- Validation rules:
  - a queued photo must have `capturedAt` populated to appear in results
  - the queue must never contain more than five accepted photos total
  - removal of a queued photo must release its preview URL

### 3) UploadQueue

- Purpose: Holds the current set of accepted photos while the user continues selecting images.
- Fields:
  - `photos`: `QueuedPhoto[]`
  - `summaryMessage`: optional status text for partial failures or limit warnings
  - `canContinue`: derived boolean for enabling the continue action
- Validation rules:
  - the queue is valid when it contains at least one accepted photo and no pending upload errors block continuation
  - invalid files in a selection are reported individually without discarding valid photos

### 4) TimelineEntry

- Purpose: Represents one row in the results timeline for one uploaded photo.
- Fields:
  - `photoId`: reference to the queued photo
  - `capturedAt`: normalized date string
  - `thumbnailUrl`: image source used for display
  - `ageResults`: ordered list of per-person age results
  - `sortKey`: composite key built from `capturedAt` and `addedOrder`
- Validation rules:
  - timeline entries must be sorted by `capturedAt` ascending
  - ties must preserve the original upload order
  - each entry must render the same people order used on the first screen

### 5) AgeResult

- Purpose: Stores the age of one person at one photo date.
- Fields:
  - `personId`: reference to the configured person
  - `name`: person name for display
  - `ageLabel`: formatted years-months-days string
  - `ageParts`: calculated years, months, days values
- Validation rules:
  - results remain deterministic for the same person/date inputs
  - person ordering matches the configured order, not alphabetical order

### 6) WorkflowState

- Purpose: Tracks the active screen and whether the user is still building the photo queue.
- Fields:
  - `currentScreen`: `people`, `upload`, or `results`
  - `people`: current validated or partially edited people list
  - `uploadQueue`: current queued photos
  - `selectedPhotoCount`: derived count of accepted photos
- Validation rules:
  - results cannot be reached until the user explicitly continues from the upload screen
  - the people screen and upload screen must preserve in-session state when navigating back and forth

## State Transitions

### PEOPLE -> UPLOAD
- Trigger: User selects Continue with valid people data.
- Effect: Preserve people data, initialize or retain the current upload queue, and show the upload screen.

### PEOPLE -> PEOPLE
- Trigger: User selects Reset.
- Effect: Clear people state and any dependent upload session state.

### UPLOAD -> UPLOAD
- Trigger: User adds one or more files.
- Effect: Validate each file, keep valid photos up to the five-photo limit, and report invalid files individually.

### UPLOAD -> UPLOAD
- Trigger: User removes one queued photo.
- Effect: Remove the selected photo, revoke its preview URL, and keep the remaining queue.

### UPLOAD -> RESULTS
- Trigger: User selects Continue with at least one accepted photo in the queue.
- Effect: Sort queued photos into timeline order and compute age results for each photo against the current people list.

### RESULTS -> UPLOAD
- Trigger: User selects Back to upload.
- Effect: Return to the upload queue with all accepted photos still available for review or removal.

### RESULTS -> PEOPLE
- Trigger: User selects Back to people.
- Effect: Return to the people screen with the current people list intact.

## Persistence Boundary

- Persisted: people list in browser localStorage, as already implemented.
- Ephemeral: upload queue, preview URLs, selected-photo ordering, and timeline results for the active session.