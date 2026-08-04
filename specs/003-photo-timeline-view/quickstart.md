# Quickstart: Photo Timeline View

## Prerequisites

- A browser with local file upload support
- Project dependencies installed

## Run the app

```bash
npm install
npm run dev
```

Open the local Vite URL and complete the flow below.

## Validation Scenarios

### 1) Build a photo queue and continue to results

1. Enter valid people on the first screen.
2. Upload two or more image files, either one at a time or together.
3. Confirm the upload screen shows thumbnails and file names for the accepted photos.
4. Remove one uploaded photo before continuing.
5. Select Continue.
6. Expected result: the results page opens only after Continue, and the timeline shows the remaining photos in oldest-to-newest capture-date order.

### 2) Verify partial batch handling

1. Enter valid people.
2. Upload a batch containing both valid images and at least one invalid file or image without a usable capture date.
3. Expected result: valid photos remain in the queue, the invalid file(s) are identified in the UI, and the user stays on the upload screen.

### 3) Verify chronological results layout

1. Continue to the results page with multiple photos whose capture dates are far apart.
2. Expected result: thumbnails appear in a vertical timeline with even spacing between entries, a dot aligned to each thumbnail, and ages shown to the right of each dot.
3. Confirm the people are listed in the same order they were configured on the first screen.

### 4) Verify compact presentation

1. Review the upload and results screens on a narrow viewport and a desktop viewport.
2. Expected result: the layout remains readable, uses tighter spacing than the previous layout, and does not require horizontal scrolling.

## Test Commands

```bash
npm test
```

Recommended coverage areas:

- queue accumulation and removal
- partial invalid batch handling
- timeline ordering and tie stability
- results rendering order for people and photos
- compact layout regressions