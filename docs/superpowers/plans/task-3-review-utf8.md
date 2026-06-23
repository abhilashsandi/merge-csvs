ebc87ba fix: refactor TexasScheduler logic according to review feedback
c36a9be fix: refactor TexasScheduler to handle abort controller and auth fallback
bf97e32 refactor: adapt TexasScheduler for API usage and graceful stop
 backend/src/Client/index.test.ts |  91 ++++++++++++++++++++++++++
 backend/src/Client/index.ts      | 138 ++++++++++++++++++++++++++-------------
 2 files changed, 185 insertions(+), 44 deletions(-)
diff --git a/backend/src/Client/index.test.ts b/backend/src/Client/index.test.ts
new file mode 100644
index 0000000..036cb99
--- /dev/null
+++ b/backend/src/Client/index.test.ts
@@ -0,0 +1,91 @@
+import test, { mock } from 'node:test';
+import assert from 'node:assert';
+import { TexasScheduler } from './index';
+import * as log from '../Log';
+import * as browser from '../Browser';
+import axios from 'axios';
+import prompts from 'prompts';
+
+test.describe('TexasScheduler', () => {
+    test.beforeEach(() => {
+        // Mock the Log so it doesn't spam console during tests
+        mock.method(log, 'info', () => {});
+        mock.method(log, 'error', () => {});
+        mock.method(log, 'warn', () => {});
+        mock.method(log, 'dev', () => {});
+
+        // Mock external dependencies
+        mock.method(axios, 'create', () => ({
+            request: mock.fn(async () => ({ status: 200, data: [] }))
+        }));
+
+        mock.method(browser, 'getAuthTokenFromBroswer', async () => {
+            throw new Error('Mocked browser fallback error');
+        });
+
+        // Mock prompts using inject (standard for prompts)
+        prompts.inject(['test-manual-token']);
+    });
+
+    test.afterEach(() => {
+        mock.restoreAll();
+    });
+
+    test.it('stop() correctly aborts the signal', async () => {
+        const scheduler = new TexasScheduler({
+            appSettings: { captcha: { strategy: 'manual' } },
+            personalInfo: {},
+            location: {}
+        });
+        
+        // Since strategy is manual, run() would await prompts
+        // We will call run() and then stop() to abort it
+        const runPromise = scheduler.run().catch(() => {});
+        
+        assert.strictEqual((scheduler as any).abortController.signal.aborted, false);
+        scheduler.stop();
+        assert.strictEqual((scheduler as any).abortController.signal.aborted, true);
+        
+        await runPromise;
+    });
+
+    test.it('auth fallback logic resolves on submitManualToken', async () => {
+        const scheduler = new TexasScheduler({
+            appSettings: { captcha: { strategy: 'browser' } },
+            personalInfo: {},
+            location: {}
+        });
+
+        let authRequiredEmitted = false;
+        scheduler.on('AUTH_REQUIRED', () => {
+            authRequiredEmitted = true;
+            // Simulate user submitting token
+            scheduler.submitManualToken('test-manual-token');
+        });
+
+        await scheduler.run();
+
+        assert.strictEqual(authRequiredEmitted, true);
+        assert.strictEqual((scheduler as any).authToken, 'test-manual-token');
+    });
+
+    test.it('auth fallback aborts cleanly when stopped', async () => {
+        const scheduler = new TexasScheduler({
+            appSettings: { captcha: { strategy: 'browser' } },
+            personalInfo: {},
+            location: {}
+        });
+
+        let authRequiredEmitted = false;
+        scheduler.on('AUTH_REQUIRED', () => {
+            authRequiredEmitted = true;
+            // Stop the scheduler instead of submitting token
+            scheduler.stop();
+        });
+
+        await scheduler.run();
+
+        assert.strictEqual(authRequiredEmitted, true);
+        assert.strictEqual((scheduler as any).abortController.signal.aborted, true);
+    });
+});
diff --git a/backend/src/Client/index.ts b/backend/src/Client/index.ts
index 430d3e2..603e74f 100644
--- a/backend/src/Client/index.ts
+++ b/backend/src/Client/index.ts
@@ -1,14 +1,14 @@
 import https from 'https';
 import axios, { AxiosResponse } from 'axios';
 import sleep from 'timers/promises';
-import parseConfig from '../Config';
+import { EventEmitter } from 'events';
 import * as log from '../Log';
 import dayjs from 'dayjs';
 import isBetween from 'dayjs/plugin/isBetween';
 import { getAuthTokenFromBroswer } from '../Browser';
 import { CreateCaptchaSolverTask, GetCaptchaSolverResult } from '../CaptchaSolver';
 dayjs.extend(isBetween);
 import prompts from 'prompts';
 import type { EligibilityPayload } from '../Interfaces/Eligibility';
 import type { AvailableLocationPayload, AvailableLocationResponse } from '../Interfaces/AvailableLocation';
 import type { AvailableLocationDatesPayload, AvailableLocationDatesResponse, AvailableTimeSlots } from '../Interfaces/AvailableLocationDates';
@@ -33,67 +33,86 @@ try {
     } catch {
         packagejson.version = null;
     }
 }
 
 interface CaptchaResult {
     captchaToken: string;
     userAgent: string;
 }
 
-class TexasScheduler {
+export class TexasScheduler extends EventEmitter {
     private readonly requestClient = axios.create({
         baseURL: 'https://apptapi.txdpsscheduler.com',
         httpsAgent: new https.Agent({ rejectUnauthorized: false }),
     });
-    public config = parseConfig();
+    public config: any;
+    private abortController = new AbortController();
+    private stopped = false;
     public existBooking: { exist: boolean; response: ExistBookingResponse[] } | undefined;
 
     private availableLocation: AvailableLocationResponse[] | null = null;
     private isBooked = false;
     private isHolded = false;
     private readonly queue = new PQueue({ concurrency: 1 });
     private authToken = '';
     private readonly maxCaptchaSolverRetries = 25;
     private responseId: number | null = null;
     private userAgent: string | null = null;
 
-    public constructor() {
-        if (this.config.appSettings.webserver)
-            // eslint-disable-next-line  @typescript-eslint/no-require-imports
-            require('http')
-                .createServer((req: any, res: any) => res.end('Bot is alive!'))
-                .listen(process.env.PORT || 3000);
+    public constructor(config: any) {
+        super();
+        this.config = config;
         log.info(`Texas Scheduler v${packagejson.version} is starting...`);
         log.info('Requesting Available Location....');
         if (!existsSync('cache')) mkdirSync('cache');
-        this.run();
+    }
+
+    public stop() {
+        this.stopped = true;
+        this.abortController.abort();
+        this.queue.pause();
+        this.queue.clear();
+        log.info('Job stopped manually.');
+    }
+
+    public submitManualToken(token: string) {
+        this.authToken = token;
+        this.emit('manual_token_received');
     }
 
     public async run() {
-        if (existsSync('././cache/token.tmp')) {
-            log.info('Getting auth token from cache...');
-            this.authToken = readFileSync('././cache/token.tmp', 'utf-8');
-        } else await this.getAuthToken();
-        if (this.responseId === null) await this.getResponseId();
-        this.existBooking = await this.checkExistBooking();
-        const { exist, response } = this.existBooking;
-        if (exist) {
-            log.warn(`You have an existing booking at ${response[0].SiteName} ${dayjs(response[0].BookingDateTime).format('MM/DD/YYYY hh:mm A')}`);
-            if (!this.config.appSettings.cancelIfExist) {
-                log.warn(`The bot will continue to run, but WILL NOT cancel existing booking if it found a new one`);
+        try {
+            if (existsSync('././cache/token.tmp')) {
+                log.info('Getting auth token from cache...');
+                this.authToken = readFileSync('././cache/token.tmp', 'utf-8');
+            } else await this.getAuthToken();
+            if (this.responseId === null) await this.getResponseId();
+            this.existBooking = await this.checkExistBooking();
+            const { exist, response } = this.existBooking;
+            if (exist) {
+                log.warn(`You have an existing booking at ${response[0].SiteName} ${dayjs(response[0].BookingDateTime).format('MM/DD/YYYY hh:mm A')}`);
+                if (!this.config.appSettings.cancelIfExist) {
+                    log.warn(`The bot will continue to run, but WILL NOT cancel existing booking if it found a new one`);
+                } else {
+                    log.warn(`The bot will continue to run, but will cancel existing booking if it found a new one`);
+                }
+            }
+            await this.requestAvailableLocation();
+            await this.getLocationDatesAll();
+        } catch (err: any) {
+            if (err.name === 'AbortError' || err.code === 'ERR_CANCELED' || err.message === 'Aborted' || err.name === 'CanceledError') {
+                log.info('Scheduler aborted successfully.');
             } else {
-                log.warn(`The bot will continue to run, but will cancel existing booking if it found a new one`);
+                throw err;
             }
         }
-        await this.requestAvailableLocation();
-        await this.getLocationDatesAll();
     }
 
     private async checkExistBooking() {
         const requestBody: ExistBookingPayload = {
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
             DateOfBirth: this.config.personalInfo.dob,
             LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
         };
 
@@ -164,21 +183,21 @@ class TexasScheduler {
                   TypeId: typeId,
                   ZipCode: identifier,
               };
 
         const response = await this.fetchLocationData(requestBody);
         const typeStr = isCity ? 'city' : 'zipcode';
         const typeStrCaps = isCity ? 'City' : 'zipcode';
 
         if (response === null) {
             log.warn(`No location found for ${typeStr}: ${identifier}`);
-            sleep.setTimeout(2000);
+            try { await sleep.setTimeout(2000, undefined, { signal: this.abortController.signal }); } catch { /* ignore */ }
             return [];
         }
 
         if (response.length !== 0) {
             log.info(`Found ${response.length} locations for ${typeStrCaps}: ${identifier}`);
         }
         response.forEach(el => {
             if (isCity) el.CityName = identifier;
             else el.ZipCode = identifier;
         });
@@ -198,66 +217,77 @@ class TexasScheduler {
     }
 
     private filterAndSortLocations(locations: AvailableLocationResponse[]): AvailableLocationResponse[] {
         return locations.sort((a, b) => a.Distance - b.Distance).filter((elem, index, self) => self.findIndex(obj => obj.Id === elem.Id) === index);
     }
 
     public async requestAvailableLocation(): Promise<void> {
         const response = await this.getAllLocation();
         if (response.length === 0) {
             log.error('No Available location found! You can try add more zipcodes or set city name!');
-            process.exit(0);
+            this.stop();
+            return;
         }
         if (this.config.location.pickDPSLocation) {
             if (existsSync('././cache/location.json')) {
                 this.availableLocation = JSON.parse(readFileSync('././cache/location.json', 'utf-8'));
                 log.info('Found cached location selection, using cached location selection');
                 log.info('If you want to change location selection, please delete cache folder!');
                 return;
             }
             const userResponse = await prompts({
                 type: 'multiselect',
                 name: 'location',
                 message: 'Choose DPS location, you can choose multiple locations!',
                 choices: response.map(el => ({
                     title: `${el.Name} - ${el.Address} - ${el.Distance} miles away from ${el.ZipCode ? el.ZipCode : el.CityName}!`,
                     value: el,
                 })),
-                onState: (state: { aborted: boolean }) => (state.aborted ? process.exit(1) : null),
+                onState: (state: { aborted: boolean }) => {
+                    if (state.aborted) this.stop();
+                },
             });
+            if (this.stopped) return;
             if (!userResponse.location || userResponse.location.length === 0) {
                 log.error('You must choose at least one location!');
-                process.exit(1);
+                this.stop();
+                return;
             }
             this.availableLocation = userResponse.location;
             writeFileSync('././cache/location.json', JSON.stringify(userResponse.location));
             return;
         }
         const filteredResponse = response.filter((location: AvailableLocationResponse) => location.Distance < this.config.location.miles);
         if (filteredResponse.length === 0) {
             log.error(`No Available location found! Nearest location is ${response[0].Distance} miles away! Please change your config and try again!`);
-            process.exit(0);
+            this.stop();
+            return;
         }
         log.info(`Found ${filteredResponse.length} Available location that match your criteria`);
         log.info(`${filteredResponse.map(el => el.Name).join(', ')}`);
         this.availableLocation = filteredResponse;
         return;
     }
 
     private async getLocationDatesAll() {
         log.info('Checking Available Location Dates....');
         if (!this.availableLocation) return;
-        const getLocationFunctions = this.availableLocation.map(location => () => sleep.setTimeout(5000).then(() => this.getLocationDates(location)));
-        for (; ;) {
+        const getLocationFunctions = this.availableLocation.map(location => () => sleep.setTimeout(5000, undefined, { signal: this.abortController.signal }).then(() => this.getLocationDates(location)));
+        while (!this.stopped) {
             console.log('--------------------------------------------------------------------------------');
             await this.queue.addAll(getLocationFunctions).catch(() => null);
-            await sleep.setTimeout(this.config.appSettings.interval);
+            try {
+                await sleep.setTimeout(this.config.appSettings.interval, undefined, { signal: this.abortController.signal });
+            } catch (err: any) {
+                if (err.name === 'AbortError') break;
+                throw err;
+            }
         }
     }
 
     private async getLocationDates(location: AvailableLocationResponse) {
         const locationConfig = this.config.location;
         const requestBody: AvailableLocationDatesPayload = {
             LocationId: location.Id,
             PreferredDay: 0,
             SameDay: locationConfig.sameDay,
             StartDate: null,
@@ -292,21 +322,22 @@ class TexasScheduler {
                     AvailableTimeSlots: filteredTimeSlots,
                 };
             }).filter(date => date.AvailableTimeSlots.length > 0);
 
             const booking = filteredAvailabilityDates[0].AvailableTimeSlots[0];
 
             log.info(`${location.Name} is Available on ${booking.FormattedStartDateTime}`);
             if (!this.queue.isPaused) this.queue.pause();
             if (!this.config.appSettings.cancelIfExist && this.existBooking?.exist) {
                 log.warn('cancelIfExist is disabled! Please cancel existing appointment manually!');
-                process.exit(0);
+                this.stop();
+                return Promise.resolve(true);
             }
             this.holdSlot(booking, location);
             return Promise.resolve(true);
         }
         log.info(
             `${location.Name} is not Available in ${locationConfig.sameDay
                 ? 'the same day'
                 : `around ${locationConfig.daysAround.start}-${locationConfig.daysAround.end} days from ${this.config.location.daysAround.startDate}!`
             } `,
         );
@@ -333,48 +364,50 @@ class TexasScheduler {
         };
         if (this.authToken) headers['Authorization'] = this.authToken;
 
         const response = await this.requestClient.request({
             method,
             url: path,
             headers,
             timeout: this.config.appSettings.headersTimeout,
             data: method === 'POST' ? body : undefined, // Include body only for POST requests
             validateStatus: () => true,
+            signal: this.abortController.signal,
         });
 
         if (response.status !== 200) {
             log.warn(`Got ${response.status} status code`);
             log.info(`Endpoint: ${path}`);
             log.dev(`Auth token: ${headers['Authorization']}`);
             if (response.status === 401) {
                 log.info('Auth token expired! Try to get new token...');
                 await this.getAuthToken();
                 const repsonseIdStatus = await this.getResponseId();
 
                 if (repsonseIdStatus) {
                     log.info('Auth token valid!');
                     log.info('Sleeping for 5s...');
-                    await sleep.setTimeout(5000);
+                    await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
                 }
             }
             if (response.status === 403) {
                 log.warn('Got rate limited, sleep for 10s...');
-                await sleep.setTimeout(10000);
+                await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal });
                 return this.requestApi(path, method, body, retryTime + 1);
             }
             if (retryTime < this.config.appSettings.maxRetry) {
                 log.info(`Retrying failed request... (Retry ${retryTime + 1}/${this.config.appSettings.maxRetry})`);
                 return this.requestApi(path, method, body, retryTime + 1);
             }
             log.error(`Got ${response.status} status code, retrying failed!`);
-            process.exit(1);
+            this.stop();
+            throw new Error(`Got ${response.status} status code, retrying failed!`);
         }
         return response;
     }
 
     private async holdSlot(booking: AvailableTimeSlots, location: AvailableLocationResponse) {
         if (this.isHolded) return;
         const requestBody: HoldSlotPayload = {
             DateOfBirth: this.config.personalInfo.dob,
             FirstName: this.config.personalInfo.firstName,
             LastName: this.config.personalInfo.lastName,
@@ -382,21 +415,21 @@ class TexasScheduler {
             SlotId: booking.SlotId,
         };
         const response = (await this.requestApi('/api/HoldSlot', 'POST', requestBody).then(res => res.data)) as HoldSlotResponse;
         if (response.SlotHeldSuccessfully !== true) {
             log.error(`Failed to hold slot: ${response.ErrorMessage}`);
             if (this.queue.isPaused) this.queue.start();
             return;
         }
         log.info('Slot hold successfully. Sleeping for 5s...');
         this.isHolded = true;
-        await sleep.setTimeout(5000);
+        await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
         await this.bookSlot(booking, location);
     }
 
     private async bookSlot(booking: AvailableTimeSlots, location: AvailableLocationResponse) {
         if (this.isBooked) return;
         log.info('Booking slot....');
         if (this.existBooking?.exist) {
             log.info(`Canceling existing booking ${this.existBooking.response[0].ConfirmationNumber}`);
             await this.cancelBooking(this.existBooking.response[0].ConfirmationNumber);
         }
@@ -433,21 +466,22 @@ class TexasScheduler {
             this.isBooked = true;
             log.info(`Slot booked successfully. Confirmation Number: ${bookingInfo.Booking.ConfirmationNumber}`);
             log.info(`Visiting this link to print your booking:`);
             log.info(appointmentURL);
             if (this.config.appSettings.pushNotifcation.enabled) {
                 log.info('Sending notification...');
                 await pushNotifcation(`Booked for ${this.config.personalInfo.firstName} ${this.config.personalInfo.lastName}. URL: ${appointmentURL}`).catch(error => {
                     log.error('Failed to send notification', error);
                 });
             }
-            process.exit(0);
+            this.stop();
+            return;
         } else {
             if (this.queue.isPaused) this.queue.start();
             log.error('Failed to book slot');
             log.error(response.data);
         }
     }
 
     private async getAuthToken() {
         if (this.config.appSettings.captcha.strategy === 'solver') {
             const captchaToken = await this.getCaptchaToken();
@@ -469,56 +503,72 @@ class TexasScheduler {
                 IsEmail: false,
                 IsMobile: true,
                 SelectedLanguage: 'EN',
             };
 
             log.dev(`Captcha token: ${captchaToken}`);
             log.dev(`Request body: ${JSON.stringify(requestBody)}`);
             const response = (await this.requestApi('/api/v1/account/auth', 'POST', requestBody).then(res => res.data)) as any;
             this.authToken = response.data.token;
         } else if (this.config.appSettings.captcha.strategy === 'browser') {
-            const response = await getAuthTokenFromBroswer();
             try {
+                const response = await getAuthTokenFromBroswer();
                 const parsed = JSON.parse(response);
                 this.authToken = parsed.data.token;
-            } catch {
-                this.authToken = response;
+            } catch (err) {
+                log.error('Browser auth failed. Waiting for manual token...');
+                this.emit('AUTH_REQUIRED');
+                await new Promise<void>((resolve, reject) => {
+                    const onAbort = () => {
+                        this.removeListener('manual_token_received', resolve);
+                        reject(new Error('Aborted'));
+                    };
+                    if (this.abortController.signal.aborted) return onAbort();
+                    this.abortController.signal.addEventListener('abort', onAbort);
+                    this.once('manual_token_received', () => {
+                        this.abortController.signal.removeEventListener('abort', onAbort);
+                        resolve();
+                    });
+                });
             }
         } else if (this.config.appSettings.captcha.strategy === 'manual') {
             const response = await prompts({
                 type: 'text',
                 name: 'token',
                 message: 'Your captcha token is expired. Enter the new token: ',
-                onState: (state: { aborted: boolean }) => (state.aborted ? process.exit(1) : null),
+                onState: (state: { aborted: boolean }) => {
+                    if (state.aborted) this.stop();
+                },
             });
+            if (this.stopped) return;
             this.authToken = response.token;
         }
 
         if (this.authToken) {
             writeFileSync('././cache/token.tmp', this.authToken);
         }
     }
 
     private async getCaptchaToken(taskId?: string | null, retries = 0): Promise<string> {
         if (retries > this.maxCaptchaSolverRetries) {
             log.error(`Get captcha token failed after ${this.maxCaptchaSolverRetries} retries! will retry!`);
             return await this.getCaptchaToken(null, 0);
         }
         if (!taskId) taskId = await CreateCaptchaSolverTask();
         const captchaResult = await this.getCaptchaResult(taskId);
         if (captchaResult === undefined) {
-            await sleep.setTimeout(2000);
+            await sleep.setTimeout(2000, undefined, { signal: this.abortController.signal });
             return this.getCaptchaToken(taskId, retries + 1);
         }
         if (captchaResult === null) {
             log.error('get captcha token failed! will create new task and sleep 10s!');
-            await sleep.setTimeout(10000);
+            await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal });
             return this.getCaptchaToken(null, retries + 1);
         }
         log.info('Captcha token received successfully');
         this.userAgent = captchaResult.userAgent;
         return captchaResult.captchaToken;
     }
 
     private async getCaptchaResult(taskId: string | null): Promise<CaptchaResult | undefined | null> {
         if (!taskId) return null;
         log.info(`Waiting for captcha token from task ${taskId}...`);
