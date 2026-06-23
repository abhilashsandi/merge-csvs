### Task 6: Final Integration and Deployment

**Goal:** Deploy the backend to Render and the frontend to Vercel.

**Steps:**

- [ ] **Step 1: Read the CLI Skills**
You MUST read the following skill files to understand how to deploy using the installed CLIs:
- `C:\Users\abhilashsandi\.gemini\config\skills\render-cli\SKILL.md`
- `C:\Users\abhilashsandi\.gemini\config\skills\vercel-cli\SKILL.md`

- [ ] **Step 2: Backend Deployment (Render)**
Deploy the backend located in the `backend/` directory to Render.
We have already created a `render.yaml` file in `backend/render.yaml`.
Use the `render` CLI (or whatever the Render skill instructs) to deploy it.
Wait for it to be deployed and retrieve the public Render URL.

- [ ] **Step 3: Frontend Deployment (Vercel)**
Deploy the Next.js frontend (root directory) to Vercel.
Set the `NEXT_PUBLIC_BACKEND_URL_RENDER` environment variable to the Render URL you obtained in Step 2.
Use the `vercel` CLI to link and deploy to production (`vercel deploy --prod`).

- [ ] **Step 4: Report**
Report the final Vercel URL and Render URL in your task report.
