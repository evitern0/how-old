# Quickstart: Streamline Input Views

## Prerequisites

- Project dependencies installed
- A browser with local file upload support
- At least one image with readable capture-date metadata for end-to-end validation

## Run the app

```bash
npm install
npm run dev
```

Open the local Vite URL and validate the scenarios below.

## Validation Scenarios

### 1) Finalize, edit, and remove people in the compact form

1. Open the people step.
2. Confirm a new person row shows only two inputs with inline placeholders for the name and date of birth.
3. Enter a valid name and date of birth.
4. Press Enter or click Done.
5. Expected result: the row becomes readonly text and shows Edit plus an `X` removal control.
6. Click Edit.
7. Expected result: the two original inputs reappear with the previously entered values.
8. Remove a row while editable, then add another and remove it while finalized.
9. Expected result: removal works in both modes without corrupting the remaining rows.

### 2) Verify progression is blocked until every person is valid and done

1. Create two people rows.
2. Finalize only the first row.
3. Leave the second row incomplete or valid-but-not-done.
4. Attempt to continue.
5. Expected result: the app stays on the people step and clearly indicates what still needs attention.
6. Finalize the remaining valid row.
7. Expected result: Continue now advances to upload.

### 3) Verify transient upload feedback dismissal and navigation clearing

1. Reach the upload step with at least one finalized person.
2. Upload a mixed selection containing one valid image and one invalid or unreadable file.
3. Confirm the valid photo appears in the queue and the invalid file appears in a visible feedback message.
4. Dismiss the feedback message.
5. Expected result: the message disappears while the accepted queued photo remains.
6. Continue to results, then return to upload.
7. Expected result: the queued photo still exists, but the prior feedback message does not reappear.

### 4) Verify per-photo `X` removal and upload Reset

1. Queue two or more valid photos.
2. Remove one queued photo using its `X` control.
3. Expected result: only that photo is removed and the remaining queue stays intact.
4. Select Reset on the upload step.
5. Expected result: all queued photos are removed, the upload step returns to its empty state, and Continue to results is no longer available.

### 5) Verify compact presentation across the setup flow

1. Review the people and upload steps on a narrow viewport and a desktop viewport.
2. Confirm both steps keep their actions readable, avoid horizontal scrolling, and use a consistent compact visual hierarchy.

## Test Commands

```bash
npm test
npm run build
```

Recommended coverage areas:

- person-row editing vs finalized rendering
- Enter-to-Done behavior and invalid-row blocking
- people-step readiness gating
- upload feedback dismissal and clearing on return from results
- upload Reset and per-photo `X` removal
- compact-layout regressions for people and upload screens