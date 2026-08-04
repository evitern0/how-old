# UI Flow Contract: Photo Timeline View

## Purpose

Define the screen-level behavior for queued multi-photo upload and the vertical timeline results view.

## Screen Contract

### PEOPLE Screen

- Inputs:
  - Editable people list with one to five person records
- Controls:
  - Continue
  - Reset
- Behavior:
  - Continue MUST be blocked while people input is invalid.
  - Continue MUST transition to UPLOAD only when people input is valid.
  - Reset MUST clear the people form and dependent session state.

### UPLOAD Screen

- Inputs:
  - Current people list summary
  - File picker that accepts one or more image files
  - Queue of accepted photos with thumbnails and file names
- Controls:
  - Back to people
  - Remove on each queued photo
  - Continue
- Behavior:
  - Users MAY add files one at a time or in batches.
  - The queue MUST never exceed five accepted photos total.
  - Valid files from a mixed batch MUST be accepted even if other files in the same batch are invalid.
  - Invalid files MUST be identified individually with actionable messages.
  - Continue MUST remain disabled or ineffective until the user chooses to proceed from the upload screen.
  - Back to people MUST preserve the current queue and people data.
  - Remove MUST delete one queued photo at a time and update the queue immediately.

### RESULTS Screen

- Inputs:
  - Ordered photo timeline
  - Current people list
- Controls:
  - Back to people
  - Back to upload
- Behavior:
  - The results view MUST replace the prior single-photo layout.
  - Photos MUST appear oldest to newest from top to bottom.
  - Each timeline entry MUST show a thumbnail, capture date, and the configured people’s ages in their original order.
  - The vertical timeline marker MUST span the full column of thumbnails and align a dot with the center of each photo.
  - Entry spacing MUST remain even regardless of the gap in capture dates.
  - Back to upload MUST preserve the current queue for review and removal.
  - Back to people MUST preserve the current people list.

## Transition Matrix

| From | Event | Guard | To | Notes |
|------|-------|-------|----|-------|
| PEOPLE | Continue | people valid | UPLOAD | Preserve people list |
| PEOPLE | Reset | none | PEOPLE | Clear people list |
| UPLOAD | Add files | valid or invalid files selected | UPLOAD | Accept valid files, report invalid ones |
| UPLOAD | Remove photo | queued photo exists | UPLOAD | Remove one photo at a time |
| UPLOAD | Continue | at least one accepted photo | RESULTS | Sort into timeline order |
| UPLOAD | Continue | no accepted photos | UPLOAD | Stay on upload and prompt for at least one photo |
| RESULTS | Back to upload | none | UPLOAD | Preserve queue |
| RESULTS | Back to people | none | PEOPLE | Preserve people data |

## Invariants

- All upload and metadata processing MUST remain local to the browser.
- Age calculation behavior MUST remain deterministic and use the existing date utilities.
- People must stay in the original configured order on every results entry.
- Timeline spacing MUST be uniform and must not encode elapsed time visually.