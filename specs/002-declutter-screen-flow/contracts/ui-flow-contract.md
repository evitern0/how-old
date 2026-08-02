# UI Flow Contract: Declutter Screen Flow

## Purpose
Define screen-level behavior and transition contract for the People -> Upload -> Results workflow.

## Screen Contract

### PEOPLE Screen
- Inputs:
  - Editable people list (1..5 records)
  - Per-row fields: name, birthDate
- Controls:
  - Continue
  - Reset
- Behavior:
  - Continue MUST be blocked while people inputs are invalid.
  - Continue MUST transition to UPLOAD when people inputs are valid.
  - Reset MUST clear people form/session people state.

### UPLOAD Screen
- Inputs:
  - Current people list (read-only summary optional)
  - File upload control
- Controls:
  - Back
- Behavior:
  - Back MUST transition to PEOPLE and retain people entries.
  - Successful metadata extraction MUST transition to RESULTS.
  - Failed upload/extraction MUST remain on UPLOAD with actionable error.
  - No manual date entry fallback is permitted in this feature.

### RESULTS Screen
- Inputs:
  - Effective photo date
  - Computed age results for each person
  - Uploaded photo thumbnail (best effort)
- Controls:
  - Return to Upload
  - Return to People
- Behavior:
  - Must render age results even if thumbnail preview cannot render.
  - Return to Upload MUST transition to UPLOAD.
  - Return to People MUST transition to PEOPLE.

## Transition Matrix

| From | Event | Guard | To | Notes |
|------|-------|-------|----|-------|
| PEOPLE | Continue | people valid (1..5) | UPLOAD | Preserve people list |
| PEOPLE | Reset | none | PEOPLE | Clear people list state |
| UPLOAD | Back | none | PEOPLE | Preserve people list |
| UPLOAD | UploadSuccess | extracted date exists | RESULTS | Compute results |
| UPLOAD | UploadFailure | invalid file OR no usable metadata date | UPLOAD | Show error, choose different image |
| RESULTS | ReturnToUpload | none | UPLOAD | Ready for new image |
| RESULTS | ReturnToPeople | none | PEOPLE | Allow edits/reset |

## Invariants
- Age calculations, metadata extraction rules, and validation rules are unchanged from pre-refactor behavior.
- All personal data and file processing remain local to browser runtime.
- Results use one effective photo date for all people in a single result set.
