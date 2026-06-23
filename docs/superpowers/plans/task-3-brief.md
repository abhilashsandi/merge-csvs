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
