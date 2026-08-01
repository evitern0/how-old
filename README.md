# How Old

How Old is a privacy-first browser app that helps you find how old one to five people were when a photo was taken. You enter names and dates of birth, upload an image from your device, and the app reads the image metadata locally in the browser to determine the capture date and calculate each person’s age in years, months, and days.

## What it does

- Accepts between one and five people per session.
- Stores the people list in browser `localStorage` so it can be restored when you return.
- Parses uploaded image metadata in the browser with ExifReader.
- Displays the photo date and each person’s age at that moment.
- Lets you upload another image or edit the people list without restarting.
- Shows a helpful error and asks for a different image file if the upload is invalid or metadata cannot be read.

## Privacy model

This project is designed to keep user data local:

- Person data stays in the browser and is persisted only in `localStorage`.
- Uploaded images are processed in memory only.
- Uploaded files and derived image bytes are not persisted.
- No backend is required for the planned implementation.

## Project status

The specification and implementation planning artifacts are complete. The app itself has not been implemented yet.

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

The repository currently contains planning artifacts only. When the app is implemented, this section should include setup and local development instructions.

## License

No license file has been added yet.
