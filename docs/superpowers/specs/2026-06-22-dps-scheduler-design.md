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
  - **Authentication**: A section explaining how to retrieve the Auth Token manually (with steps/link to wiki), and an input field for the token.
- **Log Viewer**: An expandable terminal-like UI to display Server-Sent Events (SSE) logs from the backend.
- **Action Buttons**: "Start Scraping", "Stop Scraping".

## 3. Backend Express API (`backend/` folder)
The `texas-dps-scheduler-main` will be wrapped in an Express.js server with the following modifications:
- **Endpoints**:
  - `POST /api/schedule/start`: Receives the config payload, starts a new `TexasScheduler` instance, and returns a unique `jobId`.
  - `GET /api/schedule/logs/:jobId`: An SSE endpoint that streams logs for the given job.
  - `POST /api/schedule/stop`: Stops the polling queue for a given job.
- **Core Modifications to `TexasScheduler`**:
  - **Remove `process.exit()`**: Replace all `process.exit(0)` and `process.exit(1)` calls with graceful termination (e.g., stopping the `p-queue` and returning from the function) so the Express server doesn't crash.
  - **Dynamic Configuration**: Modify the class constructor to accept the configuration object passed from the Express route, rather than reading `config.yml`.
  - **Event-Driven Logging**: Modify `src/Log/index.ts` to emit events via an `EventEmitter`. The SSE endpoint will listen to these events to stream logs to the client.
  - **Timeout Implementation**: Add a timeout (e.g., 30 mins, based on config) that automatically pauses the queue and terminates the job if no slot is found.
  - **Manual Captcha Handling**: If the manual token is provided via the payload, it will be injected into the class directly, bypassing Puppeteer and saving execution time.

## 4. Deployment Steps for Render (To be provided to User)
1. Push the `backend/` folder to GitHub.
2. In Render, create a new "Web Service".
3. Set the Root Directory to `backend`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Provide the generated Render URL as an environment variable (`NEXT_PUBLIC_BACKEND_URL`) to the Vercel Next.js app.
