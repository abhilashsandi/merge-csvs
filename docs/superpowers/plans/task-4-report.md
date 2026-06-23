## Task 4 Report

### What I implemented
- Created `backend/src/server.ts` implementing the Express API.
- Implemented the following endpoints as specified:
  - `POST /api/schedule/start` to start a new `TexasScheduler` job with a 30-minute default timeout.
  - `POST /api/schedule/stop` to stop a running job by ID.
  - `POST /api/schedule/token` to submit a manual CAPTCHA token for a job.
  - `GET /api/schedule/logs/:jobId` to stream Server-Sent Events (SSE) logs from `logEmitter` and `AUTH_REQUIRED` events.

### What I tested and test results
- Ran `npm test` in `backend`: Failed with `ERR_MODULE_NOT_FOUND` in `src/Client/index.test.ts` because it attempts to import `src/Client/index` without the `.js` extension, which is required by Node ES module resolution.
- Ran `npm run build` in `backend`: Failed with pre-existing TypeScript errors in `src/CaptchaSolver/index.ts`, `src/Client/index.ts`, and `src/Interfaces/Config.ts` (e.g. `possibly 'null' or 'undefined'` and missing `Authorization` on type).
- **Note:** `src/server.ts` did not produce any TypeScript errors of its own and exactly follows the requested implementation.

### Files changed
- `backend/src/server.ts` (created)

### Self-review findings
- The `server.ts` code is exactly as specified in the brief.
- Edge cases like jobs not being found are handled returning `404`.
- The 30-minute max runtime constraint is correctly implemented in `/api/schedule/start` using `setTimeout`.
- Code is clean and YAGNI was respected.

### Issues or concerns
- The existing codebase has TypeScript compilation errors (`npm run build` fails) and test runner issues (`npm test` fails) unrelated to this task. These will likely need to be addressed in separate tasks to ensure the whole backend builds successfully.

### Fix Report

- **What I fixed:**
  - Added `backend/src/server.test.ts` to test all Express API endpoints.
  - Refactored `TexasScheduler` inside `backend/src/Client/index.ts` to emit its own `log` events, and modified `server.ts` to listen to these instances instead of the global `logEmitter`.
  - Stored `timeoutHandle` and cleared it in `/api/schedule/start` (on completion) and `/api/schedule/stop` to prevent memory leaks.
  - Ensured jobs are deleted from the `jobs` dictionary upon completion or failure.
  - Fixed pre-existing TypeScript errors in `backend/src/Client/index.ts`, `backend/src/CaptchaSolver/index.ts`, and `backend/src/Interfaces/Config.ts` to make tests pass successfully.
  
- **What I tested and test results:**
  - Ran `npm run build` and then `node --test dist/server.test.js` successfully. All 5 endpoints are verified working and correctly mocked.
  - All original compilation errors (`ERR_MODULE_NOT_FOUND` and TS strict typing issues) are resolved.

- **Files changed:**
  - `backend/src/server.ts` (modified)
  - `backend/src/server.test.ts` (created)
  - `backend/src/Client/index.ts` (modified log emitting logic & TS errors)
  - `backend/src/CaptchaSolver/index.ts` (modified TS errors)
  - `backend/src/Interfaces/Config.ts` (modified TS errors)
  - `backend/package.json` (added `supertest` devDependency)

### Fix Report 2

- **What I fixed:**
  - Updated the mock `TexasScheduler.prototype.run` in `backend/src/server.test.ts` to return a pending promise instead of resolving immediately. This ensures jobs stay in memory during tests.
  - Extracted the `AUTH_REQUIRED` anonymous callback to a named function in `backend/src/server.ts` and unregistered it on `req.on('close')` to fix a memory leak.
  - Removed the unused `logEmitter` import from `backend/src/server.ts`.

- **What I tested and test results:**
  - Ran `npm run build; npm test` successfully in the `backend` directory. Tests inside `dist/` pass.

- **Files changed:**
  - `backend/src/server.test.ts`
  - `backend/src/server.ts`
