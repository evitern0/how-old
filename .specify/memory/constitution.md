<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
	- Template Principle 1 -> I. Local-First Privacy
	- Template Principle 2 -> II. Metadata Truth and Transparency
	- Template Principle 3 -> III. Deterministic Age Computation (NON-NEGOTIABLE)
	- Template Principle 4 -> IV. Inclusive and Failure-Resilient Experience
	- Template Principle 5 -> V. Testability and Browser Compatibility (expanded mandatory testing scope)
- Added sections:
	- Domain Constraints and Data Handling
	- Delivery Workflow and Quality Gates
- Removed sections:
	- None
- Follow-up TODOs:
	- None
-->

# How Old Constitution

## Core Principles

### I. Local-First Privacy
All personal data, including names, dates of birth, and uploaded photos, MUST be processed in
the browser by default and MUST NOT be transmitted to external services unless a user has
explicitly opted in to that behavior. Data entered for a session MUST be easy to clear in one
action.

Rationale: The application handles sensitive family information; minimizing data movement is the
strongest baseline control.

### II. Metadata Truth and Transparency
The app MUST read the image capture timestamp from available metadata and MUST clearly indicate
which timestamp field was used. If metadata is missing, invalid, or ambiguous, the UI MUST
surface this state and MUST require the user to choose a different image file before computing
ages.

Rationale: Age output is only as trustworthy as the source date; users need visibility into data
provenance.

### III. Deterministic Age Computation (NON-NEGOTIABLE)
Given identical person records and identical effective photo date, the computed years-months-days
result MUST be deterministic across supported browsers and time zones. The computation MUST use
calendar-aware date math and MUST handle leap years and month-length boundaries explicitly.

Rationale: The product promise is precise age-at-photo calculation; non-determinism breaks user
trust.

### IV. Inclusive and Failure-Resilient Experience
Core flows (add people, upload image, review age results) MUST remain usable on common mobile and
desktop viewport sizes. Form validation and upload errors MUST provide actionable messages and
MUST preserve already entered people data when safe.

Rationale: The app is consumer-facing, and reliability under imperfect input is required for real
world use.

### V. Testability and Browser Compatibility
Business logic for metadata extraction normalization and age calculation MUST be isolated from UI
concerns and covered by automated tests. Any change affecting date parsing, timezone handling, or
output formatting MUST include regression tests. All code changes, including both new features and
bug fixes, MUST include automated test coverage that verifies the changed behavior before merge. The
project MUST define and maintain a supported browser matrix.

Rationale: Date and metadata logic regresses easily; separation and regression tests keep behavior
stable.

## Domain Constraints and Data Handling

- Person records MUST include at minimum: display name and date of birth in ISO format
	(YYYY-MM-DD).
- Uploaded files MUST be treated as untrusted input; file type and parse failures MUST be handled
	without crashing the session.
- Results MUST display each age as years, months, and days, and MUST use a consistent ordering
	and label format.
- If multiple people are entered, calculations MUST run for each person against the same effective
	photo date.
- Any persistence beyond the active session MUST be explicitly documented and user-controlled.

## Delivery Workflow and Quality Gates

- Every behavior change MUST be documented in the associated spec, including acceptance criteria
	for metadata fallback and age output.
- Every code change, including bug fixes, MUST add or update automated tests that fail before the
	change and pass after the change.
- Pull requests MUST include: test evidence, risk notes for date/time handling, and screenshots or
	recordings for key UI states (valid metadata, missing metadata, invalid upload).
- Reviewers MUST block merges when principles in this constitution are violated.
- Releases MUST include a brief compatibility check against the supported browser matrix.

## Governance

This constitution is authoritative for product and engineering decisions in this repository.

- Amendment process: Changes require a pull request that includes rationale, impacted principles,
	and any migration notes for existing behavior.
- Versioning policy for this constitution follows semantic versioning:
	- MAJOR for incompatible governance changes or principle removals/redefinitions.
	- MINOR for new principles/sections or materially expanded guidance.
	- PATCH for clarifications, wording improvements, and non-semantic refinements.
- Compliance review expectations: Every pull request MUST include an explicit constitution
	compliance check. Periodic audits SHOULD be run at least once per release cycle to verify
	continued adherence and identify needed amendments.

**Version**: 1.1.0 | **Ratified**: 2026-08-01 | **Last Amended**: 2026-08-01
