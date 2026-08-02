# Quickstart: Validate Decluttered Three-Screen Flow

## Goal
Validate that the UI is split into People, Upload, and Results screens while preserving existing age calculation and metadata behavior.

## Prerequisites
- Node.js 18+ and npm installed
- Dependencies installed
- At least two local image files:
  - one with readable capture-date metadata
  - one invalid or without usable capture-date metadata

## Setup

```bash
npm install
```

## Run App

```bash
npm run dev
```

Open the local Vite URL in browser.

## Validation Scenarios

### Scenario 1: Happy path through all three screens
1. On People screen, enter 1-5 valid people (name + DOB).
2. Click Continue.
3. Confirm navigation to Upload screen.
4. Upload an image with readable metadata date.
5. Confirm automatic navigation to Results screen.
6. Confirm:
   - effective photo date is shown
   - one age result appears per person
   - thumbnail preview appears near top

Expected outcome:
- Flow transitions PEOPLE -> UPLOAD -> RESULTS.
- Results are shown in existing years/months/days format.

### Scenario 2: Back navigation from Upload to People
1. Enter valid people and continue to Upload.
2. Click Back.
3. Confirm return to People.
4. Confirm previously entered people data is still present.

Expected outcome:
- Navigation UPLOAD -> PEOPLE preserves people data.

### Scenario 3: Upload failure behavior remains unchanged
1. Navigate to Upload with valid people data.
2. Upload invalid file or image without usable metadata date.
3. Confirm:
   - user remains on Upload screen
   - actionable error is shown
   - no manual date fallback is offered

Expected outcome:
- Navigation stays on UPLOAD until a usable image is provided.

### Scenario 4: Results screen return actions
1. Reach Results through successful upload.
2. Click Return to Upload and verify Upload screen appears.
3. From Results again, click Return to People and verify People screen appears.

Expected outcome:
- RESULTS -> UPLOAD and RESULTS -> PEOPLE both work without app reset.

### Scenario 5: Reset behavior on People screen
1. Enter multiple people on People screen.
2. Click Reset.
3. Confirm people form is cleared.

Expected outcome:
- People entries and related people session state clear as specified.

## Regression Verification

Run automated tests:

```bash
npm run test
```

Focus checks:
- Existing unit tests for date math and metadata extraction still pass.
- Integration tests cover three-screen navigation and unchanged result correctness for known inputs.

## Related Artifacts
- Data model: [data-model.md](./data-model.md)
- UI flow contract: [contracts/ui-flow-contract.md](./contracts/ui-flow-contract.md)
- Feature spec: [spec.md](./spec.md)
