# Data Model

## Person

Fields:
- `id`: stable client-generated identifier
- `name`: display name
- `dateOfBirth`: ISO date string in `YYYY-MM-DD`

Validation:
- Name must be non-empty after trimming.
- Date of birth must be a real calendar date.
- The list must contain between one and five people.

Relationships:
- One person can produce many age results, one per uploaded photo.

## PhotoInput

Fields:
- `fileName`: original upload name for display only
- `mimeType`: browser-reported MIME type
- `capturedAt`: derived photo timestamp when metadata parsing succeeds
- `sourceTag`: metadata field used to derive the timestamp
- `status`: `parsed`, `missing-metadata`, or `unsupported`

Validation:
- File must be handled as untrusted input.
- If the timestamp cannot be derived, the app must keep the current people list and ask for a different image.

## AgeResult

Fields:
- `personId`: reference to the matching person
- `photoDate`: effective date used for the calculation
- `years`: whole years
- `months`: remaining months after years are removed
- `days`: remaining days after months are removed

Validation:
- Results must be deterministic for the same person and photo date.
- Age math must respect leap years and month-length boundaries.

## SessionState

Fields:
- `people`: array of people currently entered
- `persistedPeople`: people restored from browser localStorage on load
- `currentPhoto`: latest parsed photo input, if any
- `results`: latest age results, if any
- `error`: current user-facing validation or parsing error, if any

State transitions:
- Loading the app restores persisted people from localStorage into the current people list.
- Adding, editing, or removing people clears stale results until recalculation.
- Uploading a new image replaces the current photo state and replaces prior results.
- Clearing the session removes people, persisted people, photo state, and results.