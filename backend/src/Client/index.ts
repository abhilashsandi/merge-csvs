import https from 'https';
import axios, { AxiosResponse } from 'axios';
import sleep from 'timers/promises';
import { EventEmitter } from 'events';
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
import type { HoldSlotPayload, HoldSlotResponse } from '../Interfaces/HoldSlot';
import type { BookSlotPayload, BookSlotResponse } from '../Interfaces/BookSlot';
import type { ExistBookingPayload, ExistBookingResponse } from '../Interfaces/ExistBooking';
import type { CancelBookingPayload } from '../Interfaces/CancelBooking';
import type { AuthPayload } from '../Interfaces/Auth';
import { pushNotifcation } from '../PushNotification';

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import PQueue from 'p-queue';

let packagejson: any = {};
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    packagejson = require('../../package.json');
} catch {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        packagejson = require('../package.json');
    } catch {
        packagejson.version = null;
    }
}

interface CaptchaResult {
    captchaToken: string;
    userAgent: string;
}

export class TexasScheduler extends EventEmitter {
    private readonly requestClient = axios.create({
        baseURL: 'https://apptapi.txdpsscheduler.com',
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    public config: any;

    public logInfo(message: string) {
        log.info(message);
        this.emit('log', { type: 'info', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
    }
    public logWarn(message: string) {
        log.warn(message);
        this.emit('log', { type: 'warn', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
    }
    public logError(message: string, err?: any) {
        log.error(message, err);
        const formatted = err ? `${message} ${err.message || err}` : message;
        this.emit('log', { type: 'error', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${formatted}` });
    }
    public logDev(message: string) {
        log.dev(message);
        this.emit('log', { type: 'dev', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
    }

    private abortController = new AbortController();
    private stopped = false;
    public existBooking: { exist: boolean; response: ExistBookingResponse[] } | undefined;

    private availableLocation: AvailableLocationResponse[] | null = null;
    private isBooked = false;
    private isHolded = false;
    private readonly queue = new PQueue({ concurrency: 1 });
    private authToken = '';
    private readonly maxCaptchaSolverRetries = 25;
    private responseId: number | null = null;
    private userAgent: string | null = null;

    public constructor(config: any) {
        super();
        this.config = config;
        this.logInfo(`Texas Scheduler v${packagejson.version} is starting...`);
        this.logInfo('Requesting Available Location....');
        if (!existsSync('cache')) mkdirSync('cache');
    }

    public stop() {
        this.stopped = true;
        this.abortController.abort();
        this.queue.pause();
        this.queue.clear();
        this.logInfo('Job stopped manually.');
    }

    public submitManualToken(token: string) {
        this.authToken = token;
        this.emit('manual_token_received');
    }

    public async run() {
        let runRetries = 0;
        while (runRetries < 5 && !this.stopped) {
            try {
                if (this.config.appSettings?.authToken) {
                    this.logInfo('Using provided Auth Token from config.');
                    this.authToken = this.config.appSettings.authToken;
                } else if (existsSync('././cache/token.tmp')) {
                    this.logInfo('Getting auth token from cache...');
                    this.authToken = readFileSync('././cache/token.tmp', 'utf-8');
                } else await this.getAuthToken();
                if (this.responseId === null) await this.getResponseId();
                this.existBooking = await this.checkExistBooking();
                const { exist, response } = this.existBooking;
                if (exist) {
                    this.logWarn(`You have an existing booking at ${response[0].SiteName} ${dayjs(response[0].BookingDateTime).format('MM/DD/YYYY hh:mm A')}`);
                    if (!this.config.appSettings.cancelIfExist) {
                        this.logWarn(`The bot will continue to run, but WILL NOT cancel existing booking if it found a new one`);
                    } else {
                        this.logWarn(`The bot will continue to run, but will cancel existing booking if it found a new one`);
                    }
                }
                await this.requestAvailableLocation();
                await this.getLocationDatesAll();
                this.emit('FINISHED');
                break; // success, break the retry loop
            } catch (err: any) {
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED' || err.message === 'Aborted' || err.name === 'CanceledError') {
                    this.logInfo('Scheduler aborted successfully.');
                    this.emit('FINISHED');
                    break;
                } else {
                    this.logError(`Fatal Error: ${err.message || err}`);
                    runRetries++;
                    if (runRetries >= 5) {
                        this.logError('Max retries reached (5). Stopping scheduler.');
                        this.emit('FINISHED');
                        throw err;
                    }
                    this.logInfo(`Retrying main loop in 10s... (Retry ${runRetries}/5)`);
                    try { await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal }); } catch { break; }
                }
            }
        }
    }

    private async checkExistBooking() {
        const requestBody: ExistBookingPayload = {
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
            DateOfBirth: this.config.personalInfo.dob,
            LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
        };

        const response: ExistBookingResponse[] = await this.requestApi('/api/Booking', 'POST', requestBody)
            .then(res => res.data)
            .then((res: ExistBookingResponse[]) => res.filter((booking: ExistBookingResponse) => booking.ServiceTypeId == this.config.personalInfo.typeId));
        // if no booking found, the api will return empty array
        if (response.length > 0) return { exist: true, response };
        return { exist: false, response };
    }

    private async cancelBooking(ConfirmationNumber: string) {
        const requestBody: CancelBookingPayload = {
            ConfirmationNumber,
            DateOfBirth: this.config.personalInfo.dob,
            LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
        };
        await this.requestApi('/api/CancelBooking', 'POST', requestBody);
        this.logInfo('Canceled booking successfully');
    }

    public async getResponseId() {
        const requestBody: EligibilityPayload = {
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
            DateOfBirth: this.config.personalInfo.dob,
            LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
            CardNumber: this.config.personalInfo.cardNumber,
        };
        const response = await this.requestApi('/api/Eligibility', 'POST', requestBody).then(res => res.data);
        this.responseId = response[0].ResponseId;
        return true;
    }

    public async getAllLocation(): Promise<AvailableLocationResponse[]> {
        const zipcodeList = this.config.location.zipCode;
        const cityNameList = this.config.location.cityName;
        const typeId = this.config.personalInfo.typeId || 71;

        const finalArray: AvailableLocationResponse[] = [];
        if (cityNameList.length > 0 && cityNameList[0] !== '') {
            for (const cityName of cityNameList) {
                const response = await this.getLocationForCity(cityName, typeId);
                finalArray.push(...response);
            }
        } else {
            for (const zipCode of zipcodeList) {
                const response = await this.getLocationForZipCode(zipCode, typeId);
                finalArray.push(...response);
            }
        }
        return this.filterAndSortLocations(finalArray);
    }

    private async getLocationHelper(identifier: string, isCity: boolean, typeId: number): Promise<AvailableLocationResponse[]> {
        const requestBody: AvailableLocationPayload = isCity 
            ? {
                  CityName: identifier,
                  PreferredDay: 0,
                  TypeId: typeId,
                  ZipCode: '',
              }
            : {
                  CityName: '',
                  PreferredDay: 0,
                  TypeId: typeId,
                  ZipCode: identifier,
              };

        const response = await this.fetchLocationData(requestBody);
        const typeStr = isCity ? 'city' : 'zipcode';
        const typeStrCaps = isCity ? 'City' : 'zipcode';

        if (response === null) {
            this.logWarn(`No location found for ${typeStr}: ${identifier}`);
            try { await sleep.setTimeout(2000, undefined, { signal: this.abortController.signal }); } catch { /* ignore */ }
            return [];
        }

        if (response.length !== 0) {
            this.logInfo(`Found ${response.length} locations for ${typeStrCaps}: ${identifier}`);
        }
        response.forEach(el => {
            if (isCity) el.CityName = identifier;
            else el.ZipCode = identifier;
        });
        return response;
    }

    private async getLocationForCity(cityName: string, typeId: number): Promise<AvailableLocationResponse[]> {
        return this.getLocationHelper(cityName, true, typeId);
    }

    private async getLocationForZipCode(zipCode: string, typeId: number): Promise<AvailableLocationResponse[]> {
        return this.getLocationHelper(zipCode, false, typeId);
    }

    private async fetchLocationData(requestBody: AvailableLocationPayload): Promise<AvailableLocationResponse[]> {
        return await this.requestApi('/api/AvailableLocation/', 'POST', requestBody).then(res => res.data as AvailableLocationResponse[]);
    }

    private filterAndSortLocations(locations: AvailableLocationResponse[]): AvailableLocationResponse[] {
        return locations.sort((a, b) => a.Distance - b.Distance).filter((elem, index, self) => self.findIndex(obj => obj.Id === elem.Id) === index);
    }

    public async requestAvailableLocation(): Promise<void> {
        const response = await this.getAllLocation();
        if (response.length === 0) {
            this.logError('No Available location found! You can try add more zipcodes or set city name!');
            this.stop();
            return;
        }
        if (this.config.location.pickDPSLocation) {
            if (existsSync('././cache/location.json')) {
                this.availableLocation = JSON.parse(readFileSync('././cache/location.json', 'utf-8'));
                this.logInfo('Found cached location selection, using cached location selection');
                this.logInfo('If you want to change location selection, please delete cache folder!');
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
                onState: (state: { aborted: boolean }) => {
                    if (state.aborted) this.stop();
                },
            });
            if (this.stopped) return;
            if (!userResponse.location || userResponse.location.length === 0) {
                this.logError('You must choose at least one location!');
                this.stop();
                return;
            }
            this.availableLocation = userResponse.location;
            writeFileSync('././cache/location.json', JSON.stringify(userResponse.location));
            return;
        }
        const filteredResponse = response.filter((location: AvailableLocationResponse) => location.Distance < this.config.location.miles);
        if (filteredResponse.length === 0) {
            this.logError(`No Available location found! Nearest location is ${response[0].Distance} miles away! Please change your config and try again!`);
            this.stop();
            return;
        }
        this.logInfo(`Found ${filteredResponse.length} Available location that match your criteria`);
        this.logInfo(`${filteredResponse.map(el => el.Name).join(', ')}`);
        this.availableLocation = filteredResponse;
        return;
    }

    private async getLocationDatesAll() {
        this.logInfo('Checking Available Location Dates....');
        if (!this.availableLocation) return;
        const getLocationFunctions = this.availableLocation.map(location => () => sleep.setTimeout(5000, undefined, { signal: this.abortController.signal }).then(() => this.getLocationDates(location)));
        while (!this.stopped) {
            console.log('--------------------------------------------------------------------------------');
            await this.queue.addAll(getLocationFunctions).catch(() => null);
            try {
                await sleep.setTimeout(this.config.appSettings.interval, undefined, { signal: this.abortController.signal });
            } catch (err: any) {
                if (err.name === 'AbortError') break;
                throw err;
            }
        }
    }

    private async getLocationDates(location: AvailableLocationResponse) {
        const locationConfig = this.config.location;
        const requestBody: AvailableLocationDatesPayload = {
            LocationId: location.Id,
            PreferredDay: 0,
            SameDay: locationConfig.sameDay,
            StartDate: null,
            TypeId: this.config.personalInfo.typeId || 71,
        };
        const response = (await this.requestApi('/api/AvailableLocationDates', 'POST', requestBody).then(res => res.data)) as AvailableLocationDatesResponse;
        let AvailableDates = response.LocationAvailabilityDates;

        if (!locationConfig.sameDay) {
            AvailableDates = response.LocationAvailabilityDates.filter(date => {
                const AvailabilityDate = dayjs(date.AvailabilityDate);
                const startDate = dayjs(this.config.location.daysAround.startDate);
                let preferredDaysCondition = true;
                if (locationConfig.preferredDays.length > 0) preferredDaysCondition = locationConfig.preferredDays.includes(AvailabilityDate.day());
                return (
                    AvailabilityDate.isBetween(startDate.add(locationConfig.daysAround.start, 'day'), startDate.add(locationConfig.daysAround.end, 'day'), 'day') &&
                    date.AvailableTimeSlots.length > 0 &&
                    preferredDaysCondition
                );
            });
        }

        if (AvailableDates.length !== 0) {
            const filteredAvailabilityDates = AvailableDates.map(date => {
                const filteredTimeSlots = date.AvailableTimeSlots.filter(timeSlot => {
                    const startDateTime = dayjs(timeSlot.StartDateTime);
                    const startHour = startDateTime.hour();
                    return startHour >= this.config.location.timesAround.start && startHour < this.config.location.timesAround.end;
                });
                return {
                    ...date,
                    AvailableTimeSlots: filteredTimeSlots,
                };
            }).filter(date => date.AvailableTimeSlots.length > 0);

            const booking = filteredAvailabilityDates[0].AvailableTimeSlots[0];

            this.logInfo(`${location.Name} is Available on ${booking.FormattedStartDateTime}`);
            if (!this.queue.isPaused) this.queue.pause();
            if (!this.config.appSettings.cancelIfExist && this.existBooking?.exist) {
                this.logWarn('cancelIfExist is disabled! Please cancel existing appointment manually!');
                this.stop();
                return Promise.resolve(true);
            }
            try {
                await this.holdSlot(booking, location);
            } catch (err: any) {
                this.logError('Error holding/booking slot', err);
            }
            return Promise.resolve(true);
        }
        this.logInfo(
            `${location.Name} is not Available in ${locationConfig.sameDay
                ? 'the same day'
                : `around ${locationConfig.daysAround.start}-${locationConfig.daysAround.end} days from ${this.config.location.daysAround.startDate}!`
            } `,
        );

        return Promise.reject();
    }

    private async requestApi(path: string, method: 'GET' | 'POST', body: object, retryTime = 0): Promise<AxiosResponse> {
        const headers: Record<string, string> = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,te;q=0.6,hi;q=0.5',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json;charset=UTF-8',
            'IsMFAEnabled': 'N',
            'Origin': 'https://www.txdpsscheduler.com',
            'Referer': 'https://www.txdpsscheduler.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': this.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        };
        if (this.authToken) headers['Authorization'] = this.authToken;

        let response;
        try {
            response = await this.requestClient.request({
                method,
                url: path,
                headers,
                timeout: this.config.appSettings.headersTimeout,
                data: method === 'POST' ? body : undefined, // Include body only for POST requests
                validateStatus: () => true,
                signal: this.abortController.signal,
            });
        } catch (err: any) {
            if (err.name === 'AbortError' || err.code === 'ERR_CANCELED' || err.message === 'canceled') throw err;
            if (retryTime < (this.config.appSettings.maxRetry || 5)) {
                this.logWarn(`Network request failed: ${err.message}. Retrying (${retryTime + 1}/${this.config.appSettings.maxRetry || 5})...`);
                await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
                return this.requestApi(path, method, body, retryTime + 1);
            }
            this.logError(`Network request failed after ${this.config.appSettings.maxRetry || 5} retries: ${err.message}`);
            this.stop();
            throw err;
        }

        if (response.status !== 200) {
            this.logWarn(`Got ${response.status} status code`);
            this.logInfo(`Endpoint: ${path}`);
            this.logDev(`Auth token: ${headers['Authorization']}`);
            if (response.status === 401) {
                this.logInfo('Auth token expired! Try to get new token...');
                await this.getAuthToken();
                const repsonseIdStatus = await this.getResponseId();

                if (repsonseIdStatus) {
                    this.logInfo('Auth token valid!');
                    this.logInfo('Sleeping for 5s...');
                    await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
                }
            }
            if (response.status === 403) {
                this.logWarn('Got rate limited, sleep for 10s...');
                await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal });
                return this.requestApi(path, method, body, retryTime + 1);
            }
            if (retryTime < (this.config.appSettings.maxRetry || 5)) {
                this.logInfo(`Retrying failed request... (Retry ${retryTime + 1}/${this.config.appSettings.maxRetry || 5})`);
                return this.requestApi(path, method, body, retryTime + 1);
            }
            this.logError(`Got ${response.status} status code, retrying failed!`);
            this.stop();
            throw new Error(`Got ${response.status} status code, retrying failed!`);
        }
        return response;
    }

    private async holdSlot(booking: AvailableTimeSlots, location: AvailableLocationResponse) {
        if (this.isHolded) return;
        const requestBody: HoldSlotPayload = {
            DateOfBirth: this.config.personalInfo.dob,
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
            Last4Ssn: this.config.personalInfo.lastFourSSN,
            SlotId: booking.SlotId,
        };
        const response = (await this.requestApi('/api/HoldSlot', 'POST', requestBody).then(res => res.data)) as HoldSlotResponse;
        if (response.SlotHeldSuccessfully !== true) {
            this.logError(`Failed to hold slot: ${response.ErrorMessage}`);
            if (this.queue.isPaused) this.queue.start();
            return;
        }
        this.logInfo('Slot hold successfully. Sleeping for 5s...');
        this.isHolded = true;
        await sleep.setTimeout(5000, undefined, { signal: this.abortController.signal });
        await this.bookSlot(booking, location);
    }

    private async bookSlot(booking: AvailableTimeSlots, location: AvailableLocationResponse) {
        if (this.isBooked) return;
        this.logInfo('Booking slot....');
        if (this.existBooking?.exist) {
            this.logInfo(`Canceling existing booking ${this.existBooking.response[0].ConfirmationNumber}`);
            await this.cancelBooking(this.existBooking.response[0].ConfirmationNumber);
        }
        const requestBody: BookSlotPayload = {
            AdaRequired: false,
            BookingDateTime: booking.StartDateTime,
            BookingDuration: booking.Duration,
            CardNumber: '',
            CellPhone: this.config.personalInfo.phoneNumber ? this.config.personalInfo.phoneNumber : '',
            DateOfBirth: this.config.personalInfo.dob,
            Email: this.config.personalInfo.email,
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
            HomePhone: '',
            Last4Ssn: this.config.personalInfo.lastFourSSN,
            ResponseId: this.responseId as number,
            SendSms: !!this.config.personalInfo.phoneNumber,
            ServiceTypeId: this.config.personalInfo.typeId || 71,
            SiteId: location.Id,
            SpanishLanguage: 'N',
        };

        const response = await this.requestApi('/api/NewBooking', 'POST', requestBody);
        if (response.status === 200) {
            const bookingInfo = response.data as BookSlotResponse;
            if (bookingInfo?.Booking === null) {
                if (this.queue.isPaused) this.queue.start();
                this.logError('Failed to book slot');
                this.logError(JSON.stringify(bookingInfo));
                this.isHolded = false;
                return;
            }
            const appointmentURL = `https://www.txdpsscheduler.com/?b=${bookingInfo.Booking.ConfirmationNumber}`;
            this.isBooked = true;
            this.logInfo(`Slot booked successfully. Confirmation Number: ${bookingInfo.Booking.ConfirmationNumber}`);
            this.logInfo(`Visiting this link to print your booking:`);
            this.logInfo(appointmentURL);
            if (this.config.appSettings.pushNotifcation?.enabled) {
                this.logInfo('Sending notification...');
                await pushNotifcation(`Booked for ${this.config.personalInfo.firstName} ${this.config.personalInfo.lastName}. URL: ${appointmentURL}`).catch(error => {
                    this.logError('Failed to send notification', error);
                });
            }
            this.stop();
            return;
        } else {
            if (this.queue.isPaused) this.queue.start();
            this.logError('Failed to book slot');
            this.logError(response.data);
        }
    }

    private async getAuthToken() {
        if (this.config.appSettings.captcha.strategy === 'solver') {
            const captchaToken = await this.getCaptchaToken();
            const requestBody: AuthPayload = {
                RecaptchaToken: {
                    Action: 'login',
                    Token: captchaToken,
                },
                UserName: `${this.config.personalInfo.firstName}_${this.config.personalInfo.lastName}_${this.config.personalInfo.lastFourSSN}`,
                Email: this.config.personalInfo.email || '',
                CellPhone: this.config.personalInfo.phoneNumber || '',
                UserDetails: {
                    FirstName: this.config.personalInfo.firstName,
                    LastName: this.config.personalInfo.lastName,
                    DateOfBirth: this.config.personalInfo.dob,
                    CardNumber: this.config.personalInfo.cardNumber || '',
                    LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
                },
                IsEmail: false,
                IsMobile: true,
                SelectedLanguage: 'EN',
            };

            this.logDev(`Captcha token: ${captchaToken}`);
            this.logDev(`Request body: ${JSON.stringify(requestBody)}`);
            const response = (await this.requestApi('/api/v1/account/auth', 'POST', requestBody).then(res => res.data)) as any;
            this.authToken = response.data.token;
        } else if (this.config.appSettings.captcha.strategy === 'browser') {
            try {
                const response = await getAuthTokenFromBroswer(this.config, (msg, type) => {
                    this.emit('log', { type: type || 'info', message: `[${dayjs().format('MM/DD/YYYY h:mm:ss')}] ${msg}` });
                });
                const parsed = JSON.parse(response);
                this.authToken = parsed.data.token;
            } catch (err) {
                this.logError('Browser auth failed. Waiting for manual token...');
                this.emit('AUTH_REQUIRED');
                await new Promise<void>((resolve, reject) => {
                    const onAbort = () => {
                        this.removeListener('manual_token_received', resolve);
                        reject(new Error('Aborted'));
                    };
                    if (this.abortController.signal.aborted) return onAbort();
                    this.abortController.signal.addEventListener('abort', onAbort);
                    this.once('manual_token_received', () => {
                        this.abortController.signal.removeEventListener('abort', onAbort);
                        resolve();
                    });
                });
            }
        } else if (this.config.appSettings.captcha.strategy === 'manual') {
            const response = await prompts({
                type: 'text',
                name: 'token',
                message: 'Your captcha token is expired. Enter the new token: ',
                onState: (state: { aborted: boolean }) => {
                    if (state.aborted) this.stop();
                },
            });
            if (this.stopped) return;
            this.authToken = response.token;
        }

        if (this.authToken) {
            writeFileSync('././cache/token.tmp', this.authToken);
        }
    }

    private async getCaptchaToken(taskId?: string | null, retries = 0): Promise<string> {
        if (retries > this.maxCaptchaSolverRetries) {
            this.logError(`Get captcha token failed after ${this.maxCaptchaSolverRetries} retries! will retry!`);
            return await this.getCaptchaToken(null, 0);
        }
        if (!taskId) taskId = await CreateCaptchaSolverTask();
        const captchaResult = await this.getCaptchaResult(taskId);
        if (captchaResult === undefined) {
            await sleep.setTimeout(2000, undefined, { signal: this.abortController.signal });
            return this.getCaptchaToken(taskId, retries + 1);
        }
        if (captchaResult === null) {
            this.logError('get captcha token failed! will create new task and sleep 10s!');
            await sleep.setTimeout(10000, undefined, { signal: this.abortController.signal });
            return this.getCaptchaToken(null, retries + 1);
        }
        this.logInfo('Captcha token received successfully');
        this.userAgent = captchaResult.userAgent;
        return captchaResult.captchaToken;
    }

    private async getCaptchaResult(taskId: string | null): Promise<CaptchaResult | undefined | null> {
        if (!taskId) return null;
        this.logInfo(`Waiting for captcha token from task ${taskId}...`);
        try {
            const captchaResult = await GetCaptchaSolverResult(taskId);
            if (captchaResult.status !== 'ready') {
                if (captchaResult.status === 'processing') return undefined;
                else return null;
            }
            return {
                captchaToken: captchaResult.solution.gRecaptchaResponse,
                userAgent: captchaResult.solution.userAgent,
            };
        } catch (err) {
            this.logError('Error while getting captcha token: ', err as Error);
            return null;
        }
    }
}

export default TexasScheduler;
