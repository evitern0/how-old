# How Old

How Old is a privacy-first browser app that helps you find how old one to five people were when a photo was taken. You enter names and dates of birth, upload an image from your device, and the app reads the image metadata locally in the browser to determine the capture date and calculate each person’s age in years, months, and days.

The workflow is intentionally split into three screens:

1. People screen: Enter people names and dates of birth, then continue.
2. Image Upload screen: Upload a photo and extract its capture date, or go back to People.
3. Results screen: View each person's age at photo time with a small photo thumbnail, then return to Upload or People.

## What it does

- Accepts between one and five people per session.
- Stores the people list in browser `localStorage` so it can be restored when you return.
- Parses uploaded image metadata in the browser with ExifReader.
- Displays the photo date and each person’s age at that moment.
- Lets you upload another image or edit the people list without restarting.
- Includes explicit Back/Continue controls between screens and a People reset action.
- Shows a helpful error and asks for a different image file if the upload is invalid or metadata cannot be read.

## Privacy model

This project is designed to keep user data local:

- Person data stays in the browser and is persisted only in `localStorage`.
- Uploaded images are processed in memory only.
- Uploaded files and derived image bytes are not persisted.
- No backend is required for the planned implementation.

## Project status

The React app is implemented and runs entirely in the browser. The repository also includes the full
specification, planning notes, and task breakdown for the feature.

## Documentation

- [Feature specification](specs/001-calculate-photo-ages/spec.md)
- [Implementation plan](specs/001-calculate-photo-ages/plan.md)
- [Research notes](specs/001-calculate-photo-ages/research.md)
- [Data model](specs/001-calculate-photo-ages/data-model.md)
- [Quickstart](specs/001-calculate-photo-ages/quickstart.md)
- [Implementation tasks](specs/001-calculate-photo-ages/tasks.md)

## Planned architecture

- Frontend: React
- Metadata parsing: ExifReader
- Persistence: browser `localStorage` for people only
- Runtime: modern desktop and mobile browsers

## Behavior notes

- If a file is not a valid image or its metadata does not reveal when the photo was taken, the app will ask the user to choose a different image file.
- The app is intended to run entirely in the browser.
- The planned implementation avoids persisting uploaded image files.

## Getting started

```bash
npm install
npm run dev
```

Build the production bundle with:

```bash
npm run build
```

Run the test suite with:

```bash
npm run test
```

Run tests in watch mode while developing:

```bash
npm run test:watch
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

The app uses browser `localStorage` for the people list and keeps uploaded image files in memory
only.

## License

No license file has been added yet.
