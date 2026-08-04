# Research: Streamline Input Views

## Decision 1: Model each person row with an explicit editing or done state

- Decision: Extend each person entry with a row-status field so every row can be either `editing` or `done`, with new rows starting in `editing` and valid rows switching to `done` only after an explicit user action.
- Rationale: The feature requires validity and explicit confirmation to be separate concepts. A row can be valid but still not ready for progression until the user presses Enter or clicks Done.
- Alternatives considered: Deriving done from validity alone; rejected because it removes the required explicit confirmation step.

## Decision 2: Keep row status on the person record instead of in a parallel UI map

- Decision: Store the per-row workflow state alongside each person entry rather than in a separate finalized-ID set.
- Rationale: The current app already treats the people array as the single source of truth for validation, persistence, reset, and screen transitions. Adding the status to the row keeps add, remove, edit, and persistence flows synchronized.
- Alternatives considered: Tracking done rows in a separate map or set; rejected because it introduces synchronization risk across add, remove, load, and reset actions.

## Decision 3: Persist loaded valid people as finalized rows by default

- Decision: When hydrating existing stored people that lack an explicit row status, treat them as `done`.
- Rationale: Under the current product behavior, anything in localStorage already represents a valid ready-to-use list. This preserves the returning-user experience while remaining backward compatible with existing stored data.
- Alternatives considered: Hydrating legacy rows as `editing`; rejected because it would unexpectedly block returning users from advancing until they reconfirm every stored row.

## Decision 4: Separate durable upload queue data from transient upload feedback

- Decision: Keep queued photos and insertion order as durable session state, but treat loading text, summary notices, and file-error messages as transient upload-screen feedback that can be dismissed or cleared on navigation.
- Rationale: The current state object mixes queue data with view-scoped feedback, which is why messages persist when users return from results. The feature explicitly requires queue persistence without feedback persistence.
- Alternatives considered: Clearing message fields manually on each navigation while keeping one shared object; rejected because it keeps mixed lifetimes in one model and makes regressions likely.

## Decision 5: Clear transient upload feedback when leaving or resetting the upload step

- Decision: Dismissing a notice clears it immediately, and any navigation away from upload or use of upload Reset clears remaining transient upload feedback before the next upload render.
- Rationale: This matches the requested behavior for dismissible messages and prevents stale invalid-file banners from reappearing when the queue itself is still valid.
- Alternatives considered: Persisting dismissed state or previous file errors until the next upload attempt; rejected because it contradicts the requirement to avoid retaining those messages after returning from results.

## Decision 6: Preserve accessible names while changing visible controls to compact symbols

- Decision: Replace visible `Remove` and `Add person` button text with `X` and `+`, but retain accessible names through `aria-label` values that describe the action.
- Rationale: The feature asks for more compact controls, while the constitution requires inclusive, failure-resilient interaction. Screen-reader clarity should not be reduced to achieve denser visuals.
- Alternatives considered: Symbol-only controls without accessible labels; rejected because they degrade usability and testability.

## Decision 7: Gate progression on list readiness, not field validity alone

- Decision: Introduce a derived readiness rule for the people step that requires at least one row, all remaining rows valid, and all rows marked `done` before Continue can advance to upload.
- Rationale: The current `validation.isValid` check only models field validity. The requested workflow adds a second gate: explicit completion of each row.
- Alternatives considered: Leaving the current validation gate unchanged; rejected because users could still progress with valid-but-unfinalized rows.

## Decision 8: Keep upload reset scoped to upload artifacts only

- Decision: The upload Reset action clears queued photos, preview URLs, and upload feedback, but does not alter the current people list.
- Rationale: The feature describes a reset similar in presence to the people page control, but scoped to previously uploaded photos. Resetting people from the upload step would be surprising and would break flow continuity.
- Alternatives considered: Reusing the global people reset behavior on the upload screen; rejected because it would clear unrelated user input.