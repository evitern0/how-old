# Research

## Decision 1: Keep image processing entirely client-side

Decision: Parse uploaded images in the browser with ExifReader and never send file bytes to a server by default.

Rationale: The app handles sensitive family data, and the repository constitution requires local-first privacy. ExifReader supports browser `File` objects and in-memory buffers, so metadata extraction can happen without network transfer.

Alternatives considered: Uploading files to an API for metadata extraction was rejected because it weakens privacy, adds latency, and complicates mobile/offline use.

## Decision 2: Use `localStorage` only for the small people list

Decision: Persist only the compact people list in `localStorage`, and treat uploaded images plus derived metadata as session data only.

Rationale: MDN documents `localStorage` as origin-scoped, persistent across sessions, and broadly available in modern browsers, but behavior for `file:` URLs is undefined. That makes it appropriate for a tiny convenience preference like names and birth dates when the app is served over HTTP(S), but not for bulky or sensitive binary uploads.

Alternatives considered: `sessionStorage` was less suitable because it clears at tab close and would not preserve the small people list between visits. IndexedDB was more capable but unnecessary for this data size and would add complexity without a privacy benefit.

## Decision 3: Never persist uploaded files or file-derived blobs

Decision: Keep uploaded image bytes only in memory long enough to read metadata, then drop the `File`, `ArrayBuffer`, and any object URLs immediately after parsing.

Rationale: Persisting uploads would unnecessarily retain sensitive personal images, increase storage pressure, and make cleanup harder. The feature only needs the captured date, not the file itself.

Alternatives considered: Saving files in IndexedDB or Cache Storage was rejected because it expands the attack surface and conflicts with the explicit privacy-first session workflow.

## Decision 4: Prefer browser-native metadata parsing paths, with fallbacks for less common formats

Decision: Use ExifReader's async browser path for uploaded `File` objects, default to a small tag set centered on capture date fields, and handle PNG/JPEG XL compression cases by requiring async parsing and browser decompression support where needed.

Rationale: ExifReader supports JPEG, PNG, HEIC/AVIF, WebP, TIFF, GIF, and JPEG XL, but some metadata paths are browser-sensitive. The library notes that compressed PNG tags and JPEG XL Brotli metadata depend on Compression Streams support, and Chrome still lacks Brotli support there as of the referenced documentation, so the app should treat those formats as best-effort and surface a clean failure message when parsing is unavailable.

Alternatives considered: Using a custom EXIF parser would reduce dependency footprint but increase implementation risk and reduce format coverage. Relying on only one image format was rejected because the product needs to work on typical phone photos.

## Decision 5: Keep browser compatibility conservative and explicit

Decision: Support modern desktop and mobile browsers with a compatibility note that covers DataView, File APIs, localStorage, and Compression Streams caveats for advanced metadata cases.

Rationale: ExifReader's browser support is broad for the core DataView-based parser, and localStorage is widely supported across modern browsers. The remaining risk is not basic EXIF reading but format-specific decompression and platform quirks, so the app should document those limitations rather than hide them.

Alternatives considered: Declaring support for every browser feature path was rejected because JPEG XL and compressed PNG metadata are not uniformly supported everywhere.