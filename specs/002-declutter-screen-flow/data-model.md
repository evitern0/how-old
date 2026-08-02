# Data Model: Declutter Screen Flow

## Overview
This feature is a presentation-flow refactor. Core business entities remain unchanged, with one additional explicit workflow-state model to represent screen transitions.

## Entities

### 1) PersonEntry
- Purpose: Captures one person for age-at-photo calculation.
- Fields:
  - id: string (stable client-generated identifier)
  - name: string (trimmed display name)
  - birthDate: string (ISO date, YYYY-MM-DD)
- Validation rules:
  - name is required and non-empty after trim
  - birthDate is required and must be a valid calendar date in YYYY-MM-DD format
  - total people count must remain between 1 and 5 before continuing to upload
- Relationships:
  - One PersonEntry participates in zero or many AgeResult records across uploads

### 2) WorkflowScreenState
- Purpose: Represents which screen is currently active in the three-screen flow.
- Fields:
  - currentScreen: enum { PEOPLE, UPLOAD, RESULTS }
  - canContinue: boolean (derived from people validity when on PEOPLE)
  - lastTransitionAt: number | null (timestamp for telemetry/debug, optional)
- Validation rules:
  - currentScreen must always be one of the enum values
  - transition to UPLOAD allowed only when people entries are valid
  - transition to RESULTS allowed only when upload metadata extraction succeeds
- Relationships:
  - References the active PeopleEntry list and UploadedPhotoContext for transition decisions

### 3) UploadedPhotoContext
- Purpose: Holds in-session photo upload state needed by Upload and Results screens.
- Fields:
  - fileName: string
  - mimeType: string
  - previewUrl: string | null (object URL for thumbnail)
  - extractedPhotoDate: string | null (normalized effective date)
  - metadataSource: string | null (which EXIF field was used)
  - uploadError: string | null
- Validation rules:
  - RESULTS screen requires extractedPhotoDate != null
  - uploadError must be populated when extraction fails
  - previewUrl may be null if preview generation fails; this must not block age output
- Relationships:
  - One UploadedPhotoContext can produce one AgeResultSet per successful upload

### 4) AgeResult
- Purpose: Stores age output for one person at one effective photo date.
- Fields:
  - personId: string
  - years: number
  - months: number
  - days: number
  - formatted: string
- Validation rules:
  - years, months, days are non-negative integers
  - formatted output follows existing project format
- Relationships:
  - Many AgeResult rows belong to one AgeResultSet
  - Each AgeResult references one PersonEntry by personId

### 5) AgeResultSet
- Purpose: Represents all computed results for one successful upload event.
- Fields:
  - effectivePhotoDate: string (normalized date used for all calculations)
  - results: AgeResult[]
- Validation rules:
  - results length equals active person count at compute time
  - all results use the same effectivePhotoDate
- Relationships:
  - Derived from one UploadedPhotoContext and the current PersonEntry list

## State Transitions

### Workflow transitions
1. PEOPLE -> UPLOAD
- Trigger: User selects Continue.
- Guard: PersonEntry list is valid and has 1..5 entries.
- Effect: Persist people data (existing behavior), navigate to UPLOAD.

2. PEOPLE -> PEOPLE
- Trigger: User selects Reset.
- Guard: None.
- Effect: Clear people entries and related people session state.

3. UPLOAD -> PEOPLE
- Trigger: User selects Back.
- Guard: None.
- Effect: Keep current people entries; clear or retain upload context per existing behavior.

4. UPLOAD -> RESULTS
- Trigger: Metadata extraction succeeds for uploaded image.
- Guard: extractedPhotoDate is available.
- Effect: Compute AgeResultSet and navigate to RESULTS.

5. UPLOAD -> UPLOAD
- Trigger: Upload invalid file or metadata extraction failure.
- Guard: Failure condition.
- Effect: Set uploadError; remain on UPLOAD; require choosing a different image.

6. RESULTS -> UPLOAD
- Trigger: User selects Return to Upload.
- Guard: None.
- Effect: Keep people entries; allow a new upload attempt.

7. RESULTS -> PEOPLE
- Trigger: User selects Return to People.
- Guard: None.
- Effect: Navigate to PEOPLE with previously entered data available for edits/reset.

## Persistence Boundary
- Persisted: PersonEntry list in localStorage (existing behavior).
- Ephemeral (session memory only): UploadedPhotoContext, WorkflowScreenState, AgeResultSet.
