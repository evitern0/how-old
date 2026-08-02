# Research: Declutter Screen Flow

## Decision 1: Drive the three-page experience with explicit UI flow state (not route changes)
- Decision: Use a finite UI flow state (People -> Upload -> Results) managed in app state rather than introducing URL routing for this feature.
- Rationale: The request is a pure UX declutter with no functionality change. Screen-state orchestration in existing app state keeps implementation small, minimizes regression risk, and avoids introducing routing concerns (history syncing, deep links, route guards) that are out of scope.
- Alternatives considered:
  - Add React Router and route-level pages: rejected as unnecessary platform complexity for a contained in-session wizard flow.
  - Keep single screen and conditionally collapse sections: rejected because it does not satisfy the requirement to break workflow into separate pages/screens.

## Decision 2: Reuse existing business logic and validation modules unchanged
- Decision: Keep age computation, metadata extraction, and people validation modules as-is; only change orchestration and presentation.
- Rationale: The specification requires no real functionality change. Existing unit coverage and deterministic behavior for date math should be preserved by avoiding algorithmic changes.
- Alternatives considered:
  - Refactor age/metadata modules during flow rewrite: rejected because it increases risk without product value.
  - Duplicate logic inside new screen components: rejected because it harms testability and violates separation of concerns.

## Decision 3: Persist only people data; keep image and thumbnail ephemeral
- Decision: Continue persisting people list in localStorage and keep uploaded image context in session memory only, while deriving a thumbnail preview from in-memory file data.
- Rationale: Matches privacy model and existing architecture. Supports back/forward flow usability without storing image files beyond the active session.
- Alternatives considered:
  - Persist image blob or thumbnail in localStorage/sessionStorage: rejected due to privacy/data-retention concerns and storage overhead.
  - Re-read image from disk after each navigation: rejected because browser file handles are not reliably retained and would degrade UX.

## Decision 4: Preserve current metadata-failure behavior (no manual date fallback)
- Decision: On metadata extraction failure, keep user on Image Upload with actionable error and require a different image.
- Rationale: User clarification selected Option A, and this preserves current functional behavior while aligning with no-functionality-change scope.
- Alternatives considered:
  - Add manual date input fallback: rejected due to explicit clarification and expanded product behavior.
  - Auto-use file modified date as fallback: rejected because it weakens metadata truth and could produce misleading ages.

## Decision 5: Add integration-first regression coverage for navigation and unchanged results
- Decision: Extend integration tests around full flow transitions and add assertions that computed results match pre-refactor behavior for identical inputs.
- Rationale: Constitution requires robust regression protection for date/metadata-affecting flows; navigation changes can accidentally reset state or alter calculation timing.
- Alternatives considered:
  - Only add unit tests for flow state helpers: insufficient confidence in end-to-end behavior.
  - Manual QA only: rejected because automated regression is constitution-mandated.
