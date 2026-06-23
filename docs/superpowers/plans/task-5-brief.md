### Task 5: Implement Next.js UI (`/dl`)

**Files:**
- Create: `app/dl/page.tsx`
- Create: `components/DpsScheduler.tsx`

**Interfaces:**
- Consumes: User inputs (PII and config), `NEXT_PUBLIC_BACKEND_URL_RENDER`.
- Produces: API calls to backend, `localStorage` saves, SSE log stream rendering.

- [ ] **Step 1: Create the Component**

Build `components/DpsScheduler.tsx` (a Client Component `use client`) with:
- Form fields for config: `firstName`, `lastName`, `dob` (MM/DD/YYYY), `email`, `last4ssn`, `city` or `zipCode`.
- Initialize these from `localStorage` if they exist.
- Save to `localStorage` when "Start" is clicked.
- `NEXT_PUBLIC_BACKEND_URL_RENDER` used as API base URL (fallback to `http://localhost:3001` if undefined).
- Functions to call `/api/schedule/start` and `/api/schedule/stop`.
- SSE `EventSource` connection to `/api/schedule/logs/:jobId` to append logs to a visible `<pre>` or log window.
- When `AUTH_REQUIRED` event is received via SSE, show a prompt/modal/input for the user to paste their manual captcha token, and send it to `/api/schedule/token`.

- [ ] **Step 2: Create the Page**

Build `app/dl/page.tsx`:
```tsx
import DpsScheduler from '@/components/DpsScheduler';

export default function DlPage() {
    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Texas DPS Scheduler</h1>
            <DpsScheduler />
        </main>
    );
}
```

- [ ] **Step 3: Verification**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/dl/page.tsx components/DpsScheduler.tsx
git commit -m "feat: add Next.js UI for DPS scheduler"
```
