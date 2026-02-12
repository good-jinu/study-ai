# ✅ TASKS.md: Task List

## Phase 1: Infrastructure and DB Setup
- [x] Modify `sst.config.ts`: Add `UsersTable`, `MissionsTable`, `SubmissionsTable`.
- [x] Define data models (User, Mission, Submission) in `packages/core`.
- [x] Implement Repository functions in `packages/db`.

## Phase 2: AI Integration and Business Logic
- [x] Set OpenAI API key (Environment Variable).
- [x] Implement AI service in `packages/core`.
- [x] Implement user level-up logic.

## Phase 3: Frontend Development (Dashboard & Auth)
- [x] Implement main dashboard UI.
- [x] Review and supplement NextAuth logic.
- [x] Connect mission list retrieval logic.

## Phase 4: Frontend Development (Mission Details)
- [x] Implement mission page layout (Input + AI Output).
- [x] Add AI call loading state and error handling.
- [x] Add result saving and history view (History view to be expanded).

## Phase 5: Finalization and Verification
- [x] End-to-end scenario test (Login -> Mission -> Level up).
- [x] Final check of responsive web design.
- [ ] Update `README.md`.
