# UI Flow Contract: Streamline Input Views

## Purpose

Define the screen-level behavior for compact people editing, finalized person rows, and transient upload feedback.

## Screen Contract

### PEOPLE Screen

- Inputs:
  - Ordered people list with one to five `PersonEntry` rows
  - Each row is either `editing` or `done`
- Controls:
  - `+` to add one new person row
  - `Done` on editable valid rows
  - `Edit` on finalized rows
  - `X` on every removable row
  - `Reset`
  - `Continue`
- Behavior:
  - New rows MUST render only two inputs, one for name and one for date of birth.
  - Placeholder text MUST communicate field intent inside the inputs.
  - Static labels or helper copy above the two inputs MUST NOT be required for row-level guidance.
  - Pressing Enter in an editable row MUST behave the same as selecting Done for that row.
  - Done MUST be ineffective for invalid rows and MUST leave validation feedback visible.
  - Finalized rows MUST render the saved name and date of birth as text, not inputs.
  - Edit MUST return the row to editable mode with the existing values preserved.
  - X MUST remove a row in either editable or finalized mode.
  - Continue MUST remain disabled or ineffective until every remaining row is valid and finalized.
  - Reset MUST clear people storage, replace the list with one blank editable row, and clear dependent upload state.

### UPLOAD Screen

- Inputs:
  - Current finalized people list summary as needed by the existing flow
  - File picker that accepts one or more image files
  - Queue of accepted photos with thumbnails and capture-date metadata
  - Optional transient feedback messages for loading, summary, and file-level errors
- Controls:
  - Back
  - `X` on each queued photo
  - `Reset`
  - Continue to results
  - Dismiss control on any visible upload feedback notice
- Behavior:
  - Users MAY add files one at a time or in batches.
  - The queue MUST never exceed five accepted photos total.
  - Valid files from a mixed batch MUST be accepted even if other files in the same selection are invalid.
  - Upload validation and error messages MUST be dismissible without clearing accepted photos.
  - Continue to results MUST remain disabled or ineffective until at least one accepted photo is queued and no upload is actively loading.
  - Back MUST preserve queued photos and current people data.
  - X MUST remove one queued photo at a time and update the queue immediately.
  - Reset MUST remove all queued photos, clear upload feedback, reset the empty state, and keep the people list intact.

### RESULTS Screen

- Inputs:
  - Ordered results generated from the current queued photos and people list
- Controls:
  - Back to people
  - Back to upload
- Behavior:
  - Back to upload MUST restore queued photos for review or removal.
  - Back to upload MUST NOT restore prior upload validation or error notices.
  - Back to people MUST preserve the current people list and each row’s editing or finalized state.

## Transition Matrix

| From | Event | Guard | To | Notes |
|------|-------|-------|----|-------|
| PEOPLE | Add row | fewer than five rows | PEOPLE | Append one editable row |
| PEOPLE | Done row | target row valid | PEOPLE | Mark that row finalized |
| PEOPLE | Edit row | target row finalized | PEOPLE | Return that row to editable mode |
| PEOPLE | Remove row | at least one row remains after removal or blank row is recreated | PEOPLE | Works in either row mode |
| PEOPLE | Continue | all rows valid and finalized | UPLOAD | Preserve people data |
| PEOPLE | Continue | any row invalid or still editing | PEOPLE | Stay on people and keep guidance visible |
| PEOPLE | Reset | none | PEOPLE | Clear people and dependent upload state |
| UPLOAD | Add files | files selected | UPLOAD | Accept valid photos, surface transient feedback for issues |
| UPLOAD | Dismiss feedback | feedback visible | UPLOAD | Hide messages, keep queue |
| UPLOAD | Remove photo | queued photo exists | UPLOAD | Remove one photo |
| UPLOAD | Reset | none | UPLOAD | Clear queue and feedback |
| UPLOAD | Continue to results | at least one accepted photo and not loading | RESULTS | Clear transient upload feedback before leaving |
| RESULTS | Back to upload | none | UPLOAD | Preserve queue only |
| RESULTS | Back to people | none | PEOPLE | Preserve people rows and statuses |

## Invariants

- All personal data and file processing MUST remain local to the browser.
- Age calculation behavior MUST remain deterministic and continue to use the existing date utilities.
- A person row cannot become finalized until its name and date of birth are valid.
- Progression to upload requires every remaining person row to be finalized.
- Upload feedback messages are transient UI state and MUST NOT outlive the current upload step view.