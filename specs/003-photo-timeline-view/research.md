# Research: Photo Timeline View

## Decision 1: Accumulate uploads locally until the user continues

- Decision: Allow the upload screen to hold a queue of up to five accepted photos total, regardless of whether they were added one at a time or in a batch, and do not navigate to results until the user explicitly continues.
- Rationale: The request separates photo selection from result review and requires users to be able to remove items before proceeding.
- Alternatives considered: Auto-advancing after each upload; these would conflict with the requested review-and-remove step.

## Decision 2: Accept partial batches and report invalid files per file

- Decision: When a multi-file selection contains both valid and invalid files, keep the valid photos in the queue and show which files failed and why.
- Rationale: The user asked for usable photos to be uploaded even if some files in the same selection are invalid.
- Alternatives considered: Rejecting the entire batch; this would force users to resubmit good files unnecessarily.

## Decision 3: Enforce a hard cap of five total photos

- Decision: Stop accepting additional photos once the queue already contains five valid photos.
- Rationale: The feature requirement is a maximum of five photos total, and this limit must apply across repeated adds as well as batch selections.
- Alternatives considered: Allowing overflow with truncation or a soft warning; these create ambiguous behavior and make the queue harder to reason about.

## Decision 4: Keep people in the order the user configured them

- Decision: On the results page, render people results in the same order as the people list on the first screen.
- Rationale: The request explicitly calls for preserving the configured order when showing ages beside each photo.
- Alternatives considered: Sorting people alphabetically or by age; either would obscure the user’s original configuration.

## Decision 5: Use capture date order, not upload order, for the vertical timeline

- Decision: Sort timeline entries from oldest capture date to newest capture date, then keep equal dates stable by their original insertion order.
- Rationale: The request describes a chronological vertical timeline whose spacing is evenly distributed and independent of time gaps.
- Alternatives considered: Ordering by upload time or photo filename; these would not reflect the requested chronology.

## Decision 6: Keep spacing uniform between timeline entries

- Decision: Render the timeline as an evenly spaced vertical sequence rather than a time-scaled chart.
- Rationale: The request says the visual spacing should be the same even when photos are years apart.
- Alternatives considered: Proportional spacing by elapsed time; this would contradict the requested presentation.

## Decision 7: Preserve local metadata extraction and existing age math

- Decision: Reuse the existing metadata extraction and age calculation helpers, extending only the session/state layer and results rendering.
- Rationale: The project already has isolated business logic and tests around metadata and age math.
- Alternatives considered: Reimplementing metadata parsing or date math in the UI layer; this would increase regression risk.

## Decision 8: Compact layout means denser spacing, not reduced content

- Decision: Tighten the page rhythm and card spacing while keeping the same information visible.
- Rationale: The request asks for a more compact layout without removing core details.
- Alternatives considered: Hiding result fields or collapsing content by default; those would reduce clarity and make the timeline harder to scan.