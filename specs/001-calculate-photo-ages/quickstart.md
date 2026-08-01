# Quickstart

## Goal

Validate the privacy-first browser flow end to end: enter people, upload a photo, extract the capture date locally, and compute ages without persisting the file.

## Prerequisites

- A modern desktop or mobile browser.
- A local development build of the app.
- The app should be served from `http://` or `https://`, not opened directly from `file://`.
- At least one test photo with a readable capture date in metadata.

## Browser Notes

- The app is intended for modern desktop and mobile browsers that support `File`, `DataView`, and `localStorage`.
- The people list is stored locally in the browser; uploaded image files are not persisted after parsing.
- Some rare metadata formats can depend on browser decompression support, so supported phone photos are the safest test cases.

## Validation Scenarios

1. Enter one to five people with valid names and birth dates, then upload a supported photo.
2. Confirm the UI shows the detected photo date and one age result per person.
3. Upload a second photo and confirm the results replace the first calculation.
4. Refresh the page and confirm only the people list persists, not the uploaded file or prior photo result.
5. Upload a non-image file or a photo without usable metadata and confirm the app asks for a different image without clearing valid people entries.

## Expected Outcomes

- Image metadata is parsed in-browser only.
- Only the compact people list survives across sessions.
- No uploaded file bytes are persisted in browser storage.
- Unsupported or unreadable metadata fails with a user-facing recovery path.