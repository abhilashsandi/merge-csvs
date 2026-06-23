# DPS Scheduler UI Integration Design

## 1. Architecture Overview
- **Repository Structure**: The Next.js frontend remains in the root of the `merge-csvs` repository. A new `backend/` folder will be created to house the modified `texas-dps-scheduler-main` Node.js application.
- **Frontend Hosting**: Vercel (already deployed).
- **Backend Hosting**: Render (Free Tier Web Service), deployed from the `backend/` directory.

## 2. Next.js Frontend (`/dl` page)
A clean, modern UI built with Tailwind CSS, Shadcn UI (or Radix primitives).
- **Form Sections**:
  - **PII Data**: First Name, Last Name, DOB, Email, Last 4 SSN, Phone. (Starts blank, saved to `localStorage` on first successful submission).
  - **Search Preferences**: City/Zip, Miles, Preferred Days, Same Day, Start Date, End Date, Time Range.
  - **Execution Settings**: Interval between retries (default 5000ms), Max execution time (default 30 mins).
- **Authentication**: 
  - The backend uses Puppeteer by default to automatically fetch the Auth Token.
  - If the automatic Puppeteer token retrieval fails (e.g., due to strict Captcha or IP block), the backend emits an error event.
  - The UI will then prompt the user with manual steps to retrieve the Auth Token from the browser and an input field to submit it.
- **Log Viewer**: An expandable terminal-like UI to display Server-Sent Events (SSE) logs from the backend.
- **Action Buttons**: 
  - **"Start Scraping"**: Initiates the background polling job.
  - **"Stop Scraping"**: A dedicated stop button to cancel the ongoing background polling job at any time.

## 3. Backend Express API (`backend/` folder)
The `texas-dps-scheduler-main` will be wrapped in an Express.js server with the following modifications:
- **Endpoints**:
  - `POST /api/schedule/start`: Receives the config payload, starts a new `TexasScheduler` instance, and returns a unique `jobId`.
  - `GET /api/schedule/logs/:jobId`: An SSE endpoint that streams logs and status events (like `AUTH_FAILED`) for the given job.
  - `POST /api/schedule/stop`: Cancels the polling queue and gracefully stops the job for the given `jobId`.
  - `POST /api/schedule/token`: Receives the manual auth token from the UI if automatic retrieval failed, allowing the paused job to resume.
- **Core Modifications to `TexasScheduler`**:
  - **Remove `process.exit()`**: Replace all `process.exit(0)` and `process.exit(1)` calls with graceful termination (e.g., stopping the `p-queue` and returning from the function) so the Express server doesn't crash.
  - **Dynamic Configuration**: Modify the class constructor to accept the configuration object passed from the Express route, rather than reading `config.yml`.
  - **Event-Driven Logging**: Modify `src/Log/index.ts` to emit events via an `EventEmitter`. The SSE endpoint will listen to these events to stream logs to the client.
  - **Timeout Implementation**: Add a timeout (e.g., 30 mins, based on config) that automatically pauses the queue and terminates the job if no slot is found.
  - **Authentication Fallback**: If `getAuthToken()` using the browser strategy fails, it emits an `AUTH_REQUIRED` event to the frontend via SSE and pauses execution until a manual token is supplied via the `/api/schedule/token` endpoint.

## 4. Deployment Steps for Render (To be provided to User)
1. Push the `backend/` folder to GitHub.
2. In Render, create a new "Web Service".
3. Set the Root Directory to `backend`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Provide the generated Render URL as an environment variable (`NEXT_PUBLIC_BACKEND_URL`) to the Vercel Next.js app.
