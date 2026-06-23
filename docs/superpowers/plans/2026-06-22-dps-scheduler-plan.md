# DPS Scheduler UI Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Next.js `/dl` routing page UI to interact with a long-running Node.js Puppeteer scraper wrapped in an Express server and deployed to Render.

**Architecture:** Next.js frontend deployed to Vercel. Express backend (containing `texas-dps-scheduler` logic) deployed to Render. The frontend sends config to the backend, which runs the Puppeteer scraper and streams logs back via Server-Sent Events (SSE).

**Tech Stack:** Next.js, React, Express, Puppeteer, Render CLI, Vercel CLI.

## Global Constraints

- No PII data defaults in the UI; must be stored in `localStorage` after first entry.
- Automatic Puppeteer authentication by default; manual token input fallback if failed.
- Stop button available to terminate job anytime.
- Default retry interval 5000ms, max runtime 30 mins.
- Use `node:test` for backend tests.

---

### Task 1: Initialize Backend Structure

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/render.yaml`

**Interfaces:**
- Produces: A separate Node package in `backend/` that can be deployed via Render blueprints.

- [ ] **Step 1: Create `backend/package.json`**

```json
{
  "name": "dps-scheduler-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "node --test"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "colorette": "^2.0.20",
    "cors": "^2.8.5",
    "dayjs": "^1.11.13",
    "dotenv": "^16.4.7",
    "express": "^4.19.2",
    "lodash": "^4.17.21",
    "p-queue": "6.6.2",
    "prompts": "^2.4.2",
    "puppeteer": "^24.0.0",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-anonymize-ua": "^2.4.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "uuid": "^10.0.0",
    "yaml": "^2.7.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/lodash": "^4.17.14",
    "@types/node": "^22.10.5",
    "@types/prompts": "^2.4.9",
    "@types/uuid": "^10.0.0",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create `backend/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `render.yaml` Blueprint**

```yaml
services:
  - type: web
    name: dps-scheduler-api
    env: node
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: npm start
    plan: free
```

- [ ] **Step 4: Copy source files**

```bash
mkdir -p backend/src
cp -r ../Downloads/texas-dps-scheduler-main/texas-dps-scheduler-main/src/* backend/src/
# Remove the old CLI index
rm backend/src/index.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/package.json backend/tsconfig.json backend/render.yaml backend/src
git commit -m "feat: initialize backend structure"
```

---

### Task 2: Refactor Logging for SSE

**Files:**
- Modify: `backend/src/Log/index.ts`

**Interfaces:**
- Produces: `logEmitter` which emits `log` events with `{ type, message }`.

- [ ] **Step 1: Refactor `backend/src/Log/index.ts` to use EventEmitter**

```typescript
import { EventEmitter } from 'events';
import { yellow, green, red } from 'colorette';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Chicago');

export const logEmitter = new EventEmitter();

const timeNow = () => dayjs().format('MM/DD/YYYY h:mm:ss');

const emitLog = (type: string, message: string) => {
    const formattedMessage = `[${timeNow()}] ${message}`;
    logEmitter.emit('log', { type, message: formattedMessage });
};

const msg = (func: any, message: string) => {
    func(`${yellow(`[${timeNow()}]`)} ${green(message)}`);
    emitLog('info', message);
};

export const error = (message = 'Unknown error', err?: Error) => {
    console.error(`[${yellow(timeNow())}] ERROR: ${red(message)}`);
    if (err) console.error(err);
    emitLog('error', message + (err ? ` ${err.message}` : ''));
};

export const info = (message: string) => msg(console.info, message);

export const dev = (message: string) => {
    if (process.env.NODE_ENV === 'development') {
        msg(console.info, `${yellow('DEBUG ->')} ${message}`);
    }
};

export const warn = (message: string) => {
    msg(console.warn, `${yellow('WARNING ->')} ${message}`);
    emitLog('warn', message);
};
```

- [ ] **Step 2: Verify it compiles**

```bash
cd backend && npm install && npx tsc
```
Expected: successful compilation.

- [ ] **Step 3: Commit**

```bash
git add backend/src/Log/index.ts
git commit -m "refactor: add EventEmitter for logs"
```

---

### Task 3: Refactor TexasScheduler logic

**Files:**
- Modify: `backend/src/Client/index.ts`

**Interfaces:**
- Consumes: JSON config object instead of parsing `config.yml`.
- Produces: `TexasScheduler` class with `stop()` method and `manualAuthToken(token)` method.

- [ ] **Step 1: Refactor Constructor and configuration parsing**

Modify `backend/src/Client/index.ts` to accept `config` via constructor and remove `parseConfig` imports. Add an `abortController`.

```typescript
import { EventEmitter } from 'events';
// Remove import parseConfig from '../Config';
// Add AbortController

export class TexasScheduler extends EventEmitter {
    public config: any;
    private abortController = new AbortController();
    private stopped = false;
    // ... existing properties ...

    public constructor(config: any) {
        super();
        this.config = config;
        log.info(`Texas Scheduler is starting...`);
        // Remove webserver initialization and config reading
    }

    public stop() {
        this.stopped = true;
        this.abortController.abort();
        this.queue.pause();
        this.queue.clear();
        log.info('Job stopped manually.');
    }

    public submitManualToken(token: string) {
        this.authToken = token;
        this.emit('manual_token_received');
    }
}
```

- [ ] **Step 2: Refactor `process.exit` and queue logic**

Replace all `process.exit(0)` and `process.exit(1)` with `this.stop()` and return statements.
In `getLocationDatesAll`, check `this.stopped` to break the infinite loop:

```typescript
    private async getLocationDatesAll() {
        log.info('Checking Available Location Dates....');
        if (!this.availableLocation) return;
        const getLocationFunctions = this.availableLocation.map(location => () => sleep.setTimeout(5000).then(() => this.getLocationDates(location)));
        while (!this.stopped) {
            console.log('--------------------------------------------------------------------------------');
            await this.queue.addAll(getLocationFunctions).catch(() => null);
            await sleep.setTimeout(this.config.appSettings.interval);
        }
    }
```

- [ ] **Step 3: Handle Auth Fallback**

In `getAuthToken`, if `captcha.strategy === 'browser'`, and it fails, pause and emit `AUTH_REQUIRED`.

```typescript
    private async getAuthToken() {
        // ...
        } else if (this.config.appSettings.captcha.strategy === 'browser') {
            try {
                const response = await getAuthTokenFromBroswer();
                const parsed = JSON.parse(response);
                this.authToken = parsed.data.token;
            } catch (err) {
                log.error('Browser auth failed. Waiting for manual token...');
                this.emit('AUTH_REQUIRED');
                await new Promise<void>((resolve) => {
                    this.once('manual_token_received', resolve);
                });
            }
        }
        // ...
    }
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/Client/index.ts
git commit -m "refactor: adapt TexasScheduler for API usage and graceful stop"
```

---

### Task 4: Implement Express API

**Files:**
- Create: `backend/src/server.ts`

**Interfaces:**
- Produces: API running on PORT 3001 with `/api/schedule/start`, `/api/schedule/stop`, `/api/schedule/token`, `/api/schedule/logs/:jobId`.

- [ ] **Step 1: Write `backend/src/server.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { TexasScheduler } from './Client';
import { logEmitter } from './Log';

const app = express();
app.use(cors());
app.use(express.json());

const jobs: Record<string, TexasScheduler> = {};

app.post('/api/schedule/start', async (req, res) => {
    const config = req.body;
    const jobId = uuidv4();
    const scheduler = new TexasScheduler(config);
    jobs[jobId] = scheduler;

    // Timeout after config max time (default 30 mins)
    const maxTime = config.appSettings.maxExecutionTime || 30 * 60 * 1000;
    setTimeout(() => {
        if (jobs[jobId]) {
            jobs[jobId].stop();
            delete jobs[jobId];
        }
    }, maxTime);

    // Start asynchronously
    scheduler.run().catch(console.error);

    res.json({ jobId, status: 'started' });
});

app.post('/api/schedule/stop', (req, res) => {
    const { jobId } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].stop();
        delete jobs[jobId];
        res.json({ status: 'stopped' });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.post('/api/schedule/token', (req, res) => {
    const { jobId, token } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].submitManualToken(token);
        res.json({ status: 'token_accepted' });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.get('/api/schedule/logs/:jobId', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { jobId } = req.params;
    const scheduler = jobs[jobId];

    const logListener = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    logEmitter.on('log', logListener);

    if (scheduler) {
        scheduler.on('AUTH_REQUIRED', () => {
            res.write(`data: ${JSON.stringify({ type: 'AUTH_REQUIRED', message: 'Manual Auth Token Required' })}\n\n`);
        });
    }

    req.on('close', () => {
        logEmitter.off('log', logListener);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/server.ts
git commit -m "feat: implement express API for scheduler"
```

---

### Task 5: Build Next.js UI Form

**Files:**
- Create: `app/dl/page.tsx`

**Interfaces:**
- Consumes: Backend `/api/schedule/start`

- [ ] **Step 1: Implement basic form and local storage logic**

```tsx
'use client';
import { useState, useEffect } from 'react';

export default function DLPage() {
    const [pii, setPii] = useState({ firstName: '', lastName: '', dob: '', email: '', lastFourSSN: '', phoneNumber: '' });
    const [config, setConfig] = useState({ city: 'Plano', zipCode: '75068', miles: 5, sameDay: false });
    const [jobId, setJobId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('dps_pii');
        if (saved) setPii(JSON.parse(saved));
    }, []);

    const handleStart = async () => {
        localStorage.setItem('dps_pii', JSON.stringify(pii));
        const payload = {
            personalInfo: { ...pii, typeId: 81 },
            location: { cityName: [config.city], zipCode: [config.zipCode], miles: config.miles, sameDay: config.sameDay, preferredDays: [''], daysAround: { start: 0, end: 15 } },
            appSettings: { cancelIfExist: true, interval: 5000, maxExecutionTime: 30 * 60 * 1000, captcha: { strategy: 'browser' }, pushNotifcation: { enabled: false } }
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_RENDER}/api/schedule/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        setJobId(data.jobId);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">DPS Scheduler</h1>
            <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" value={pii.firstName} onChange={e => setPii({...pii, firstName: e.target.value})} className="border p-2" />
                <input placeholder="Last Name" value={pii.lastName} onChange={e => setPii({...pii, lastName: e.target.value})} className="border p-2" />
                <input placeholder="DOB (MM/DD/YYYY)" value={pii.dob} onChange={e => setPii({...pii, dob: e.target.value})} className="border p-2" />
                <input placeholder="Email" value={pii.email} onChange={e => setPii({...pii, email: e.target.value})} className="border p-2" />
                <input placeholder="Last 4 SSN" value={pii.lastFourSSN} onChange={e => setPii({...pii, lastFourSSN: e.target.value})} className="border p-2" />
                <input placeholder="Phone" value={pii.phoneNumber} onChange={e => setPii({...pii, phoneNumber: e.target.value})} className="border p-2" />
            </div>
            <button onClick={handleStart} className="bg-blue-600 text-white px-4 py-2 rounded">Start Scraping</button>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dl/page.tsx
git commit -m "feat: add initial UI form for scheduler"
```

---

### Task 6: Implement Frontend Log Viewer & Controls

**Files:**
- Modify: `app/dl/page.tsx`

**Interfaces:**
- Consumes: Backend `/api/schedule/logs/:jobId`, `/api/schedule/stop`, `/api/schedule/token`

- [ ] **Step 1: Add Log Viewer, Stop Button, and Manual Token Fallback**

Append logic to `DLPage`:

```tsx
    const [logs, setLogs] = useState<string[]>([]);
    const [authRequired, setAuthRequired] = useState(false);
    const [manualToken, setManualToken] = useState('');

    useEffect(() => {
        if (!jobId) return;
        const sse = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL_RENDER}/api/schedule/logs/${jobId}`);
        sse.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'AUTH_REQUIRED') setAuthRequired(true);
            setLogs(prev => [...prev, data.message]);
        };
        return () => sse.close();
    }, [jobId]);

    const handleStop = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_RENDER}/api/schedule/stop`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId })
        });
        setJobId(null);
    };

    const submitToken = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_RENDER}/api/schedule/token`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId, token: manualToken })
        });
        setAuthRequired(false);
    };
```

Update the JSX to include the logs div, stop button, and manual token input when `authRequired` is true.

- [ ] **Step 2: Commit**

```bash
git add app/dl/page.tsx
git commit -m "feat: add log viewer, stop button, and token fallback to UI"
```

---

### Task 7: Automated Deployment via CLIs

**Files:**
- Native CLI commands

- [ ] **Step 1: Deploy Backend to Render**

```bash
render blueprints apply backend/render.yaml --output json > render-output.json
```
Extract the service URL from `render-output.json` (assume it's parsed as `RENDER_URL`).

- [ ] **Step 2: Update Vercel Environment Variables**

```bash
vercel env add NEXT_PUBLIC_BACKEND_URL_RENDER production
# When prompted, provide the RENDER_URL
```

- [ ] **Step 3: Deploy Frontend to Vercel**

```bash
vercel --prod
```

- [ ] **Step 4: Commit cleanup**

```bash
rm render-output.json
```
