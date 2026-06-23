# Task 3 Report: Refactor TexasScheduler logic

## What was implemented
- Refactored `TexasScheduler` constructor to accept a `config` object instead of using `parseConfig()`.
- Updated the class to extend `EventEmitter`.
- Added an `AbortController` and a `stop()` method to cleanly stop the scheduling loop.
- Added a `submitManualToken()` method to manually handle captcha tokens via the `manual_token_received` event.
- Replaced all instances of `process.exit(0)` and `process.exit(1)` with `this.stop()` and return statements.
- Broke the infinite checking loop in `getLocationDatesAll()` by adding a condition `while (!this.stopped)`.
- Updated `requestApi()` to throw an Error on max retry limit instead of hard crashing with `process.exit(1)`.
- Handled browser auth fallback in `getAuthToken()`: if browser authentication fails, we emit an `AUTH_REQUIRED` event and wait for `manual_token_received`.

## Testing
- Ran `npm run test` which succeeded (0 tests exist).
- Ran `npx tsc --noEmit` and confirmed no new TypeScript errors were introduced (there were some pre-existing TypeScript issues on missing types and config properties that were unchanged by this task).

## TDD Evidence
- N/A (No tests exist in the project, and this task is focused on replacing specific lines for API compatibility. TDD was not used because there were no tests to run RED/GREEN cycles against).

## Files changed
- `backend/src/Client/index.ts`

## Self-review findings
- Checked that all cases of `process.exit()` were replaced.
- Ensured loop logic does not block stopping mechanism.
- Handled Promise resolutions gracefully where `process.exit` was previously used.
- Commits are scoped strictly to the task requirements without rewriting unrelated things.

## Issues or concerns
- The original code did not contain typing for `headers`, which triggers strict TypeScript compilation errors that already existed in the repo. These were not fixed to stick to the task scope.
- In `bookSlot()`, returning from the function might leave a slot hanging without explicit notification to a caller API if they expected a response; but since this logic is asynchronous polling, `this.stop()` handles pausing execution cleanly.

## Fixes Implemented
- Passed `{ signal: this.abortController.signal }` to `sleep.setTimeout()` and `signal: this.abortController.signal` to Axios requests.
- Caught and handled abort errors cleanly in `run()` and inside the `getLocationDatesAll()` loop so the app exits gracefully without crashing.
- Wired up `abortController.signal` to the manual token Promise inside `getAuthToken()` so it rejects properly when aborted.
- Created `backend/src/Client/index.test.ts` to test `stop()` abort controller and auth fallback logic. 

## Testing
- Executed `npx tsx --test backend/src/Client/index.test.ts` and successfully verified 1 test suite passing (3 test assertions covering stop, auth fallback, and aborting fallback logic).

## Files Changed
- `backend/src/Client/index.ts`
- `backend/src/Client/index.test.ts` (added)

## Code Review Fixes Implemented
- Removed `this.run()` from the `TexasScheduler` constructor. It must now be explicitly called via `scheduler.run()`.
- Refactored `backend/src/Client/index.test.ts` to mock external dependencies properly using `mock.method` for `axios` and `Browser`, and `prompts.inject` for prompts.
- Refactored `index.test.ts` to use `mock.method(log, 'info', () => {})` instead of direct assignment, avoiding side effects.
- Updated tests to explicitly invoke and await `scheduler.run()` instead of using fragile `setTimeout`s.

## Testing
- Ran tests with `npx tsx --test src/Client/index.test.ts`. All 3 test cases passed.

## Files Changed
- `backend/src/Client/index.ts`
- `backend/src/Client/index.test.ts`
