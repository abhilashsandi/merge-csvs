"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TexasScheduler = void 0;
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("timers/promises"));
const events_1 = require("events");
const log = __importStar(require("../Log"));
const dayjs_1 = __importDefault(require("dayjs"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
const Browser_1 = require("../Browser");
const CaptchaSolver_1 = require("../CaptchaSolver");
dayjs_1.default.extend(isBetween_1.default);
const prompts_1 = __importDefault(require("prompts"));
const PushNotification_1 = require("../PushNotification");
const fs_1 = require("fs");
const p_queue_1 = __importDefault(require("p-queue"));
let packagejson = {};
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    packagejson = require('../../package.json');
}
catch {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        packagejson = require('../package.json');
    }
    catch {
        packagejson.version = null;
    }
}
class TexasScheduler extends events_1.EventEmitter {
    requestClient = axios_1.default.create({
        baseURL: 'https://apptapi.txdpsscheduler.com',
        httpsAgent: new https_1.default.Agent({ rejectUnauthorized: false }),
    });
    config;
    logInfo(message) {
        log.info(message);
        this.emit('log', { type: 'info', message: `[${(0, dayjs_1.default)().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
    }
    logWarn(message) {
        log.warn(message);
        this.emit('log', { type: 'warn', message: `[${(0, dayjs_1.default)().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
    }
    logError(message, err) {
        log.error(message, err);
        const formatted = err ? `${message} ${err.message || err}` : message;
        this.emit('log', { type: 'error', message: `[${(0, dayjs_1.default)().format('MM/DD/YYYY h:mm:ss')}] ${formatted}` });
    }
    logDev(message) {
        log.dev(message);
        this.emit('log', { type: 'dev', message: `[${(0, dayjs_1.default)().format('MM/DD/YYYY h:mm:ss')}] ${message}` });
    }
    abortController = new AbortController();
    stopped = false;
    existBooking;
    availableLocation = null;
    isBooked = false;
    isHolded = false;
    queue = new p_queue_1.default({ concurrency: 1 });
    authToken = '';
    maxCaptchaSolverRetries = 25;
    responseId = null;
    userAgent = null;
    constructor(config) {
        super();
        this.config = config;
        this.logInfo(`Texas Scheduler v${packagejson.version} is starting...`);
        this.logInfo('Requesting Available Location....');
        if (!(0, fs_1.existsSync)('cache'))
            (0, fs_1.mkdirSync)('cache');
    }
    stop() {
        this.stopped = true;
        this.abortController.abort();
        this.queue.pause();
        this.queue.clear();
        this.logInfo('Job stopped manually.');
    }
    submitManualToken(token) {
        this.authToken = token;
        this.emit('manual_token_received');
    }
    async run() {
        try {
            if ((0, fs_1.existsSync)('././cache/token.tmp')) {
                this.logInfo('Getting auth token from cache...');
                this.authToken = (0, fs_1.readFileSync)('././cache/token.tmp', 'utf-8');
            }
            else
                await this.getAuthToken();
            if (this.responseId === null)
                await this.getResponseId();
            this.existBooking = await this.checkExistBooking();
            const { exist, response } = this.existBooking;
            if (exist) {
                this.logWarn(`You have an existing booking at ${response[0].SiteName} ${(0, dayjs_1.default)(response[0].BookingDateTime).format('MM/DD/YYYY hh:mm A')}`);
                if (!this.config.appSettings.cancelIfExist) {
                    this.logWarn(`The bot will continue to run, but WILL NOT cancel existing booking if it found a new one`);
                }
                else {
                    this.logWarn(`The bot will continue to run, but will cancel existing booking if it found a new one`);
                }
            }
            await this.requestAvailableLocation();
            await this.getLocationDatesAll();
        }
        catch (err) {
            if (err.name === 'AbortError' || err.code === 'ERR_CANCELED' || err.message === 'Aborted' || err.name === 'CanceledError') {
                this.logInfo('Scheduler aborted successfully.');
            }
            else {
                throw err;
            }
        }
    }
    async checkExistBooking() {
        const requestBody = {
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
            DateOfBirth: this.config.personalInfo.dob,
            LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
        };
        const response = await this.requestApi('/api/Booking', 'POST', requestBody)
            .then(res => res.data)
            .then((res) => res.filter((booking) => booking.ServiceTypeId == this.config.personalInfo.typeId));
        // if no booking found, the api will return empty array
        if (response.length > 0)
            return { exist: true, response };
        return { exist: false, response };
    }
    async cancelBooking(ConfirmationNumber) {
        const requestBody = {
            ConfirmationNumber,
            DateOfBirth: this.config.personalInfo.dob,
            LastFourDigitsSsn: this.config.personalInfo.lastFourSSN,
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
        };
        await this.requestApi('/api/CancelBooking', 'POST', requestBody);
        this.logInfo('Canceled booking successfully');
    }
    async getResponseId() {
        const requestBody = {
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
    async getAllLocation() {
        const zipcodeList = this.config.location.zipCode;
        const cityNameList = this.config.location.cityName;
        const typeId = this.config.personalInfo.typeId || 71;
        const finalArray = [];
        if (cityNameList.length > 0 && cityNameList[0] !== '') {
            for (const cityName of cityNameList) {
                const response = await this.getLocationForCity(cityName, typeId);
                finalArray.push(...response);
            }
        }
        else {
            for (const zipCode of zipcodeList) {
                const response = await this.getLocationForZipCode(zipCode, typeId);
                finalArray.push(...response);
            }
        }
        return this.filterAndSortLocations(finalArray);
    }
    async getLocationHelper(identifier, isCity, typeId) {
        const requestBody = isCity
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
            try {
                await promises_1.default.setTimeout(2000, undefined, { signal: this.abortController.signal });
            }
            catch { /* ignore */ }
            return [];
        }
        if (response.length !== 0) {
            this.logInfo(`Found ${response.length} locations for ${typeStrCaps}: ${identifier}`);
        }
        response.forEach(el => {
            if (isCity)
                el.CityName = identifier;
            else
                el.ZipCode = identifier;
        });
        return response;
    }
    async getLocationForCity(cityName, typeId) {
        return this.getLocationHelper(cityName, true, typeId);
    }
    async getLocationForZipCode(zipCode, typeId) {
        return this.getLocationHelper(zipCode, false, typeId);
    }
    async fetchLocationData(requestBody) {
        return await this.requestApi('/api/AvailableLocation/', 'POST', requestBody).then(res => res.data);
    }
    filterAndSortLocations(locations) {
        return locations.sort((a, b) => a.Distance - b.Distance).filter((elem, index, self) => self.findIndex(obj => obj.Id === elem.Id) === index);
    }
    async requestAvailableLocation() {
        const response = await this.getAllLocation();
        if (response.length === 0) {
            this.logError('No Available location found! You can try add more zipcodes or set city name!');
            this.stop();
            return;
        }
        if (this.config.location.pickDPSLocation) {
            if ((0, fs_1.existsSync)('././cache/location.json')) {
                this.availableLocation = JSON.parse((0, fs_1.readFileSync)('././cache/location.json', 'utf-8'));
                this.logInfo('Found cached location selection, using cached location selection');
                this.logInfo('If you want to change location selection, please delete cache folder!');
                return;
            }
            const userResponse = await (0, prompts_1.default)({
                type: 'multiselect',
                name: 'location',
                message: 'Choose DPS location, you can choose multiple locations!',
                choices: response.map(el => ({
                    title: `${el.Name} - ${el.Address} - ${el.Distance} miles away from ${el.ZipCode ? el.ZipCode : el.CityName}!`,
                    value: el,
                })),
                onState: (state) => {
                    if (state.aborted)
                        this.stop();
                },
            });
            if (this.stopped)
                return;
            if (!userResponse.location || userResponse.location.length === 0) {
                this.logError('You must choose at least one location!');
                this.stop();
                return;
            }
            this.availableLocation = userResponse.location;
            (0, fs_1.writeFileSync)('././cache/location.json', JSON.stringify(userResponse.location));
            return;
        }
        const filteredResponse = response.filter((location) => location.Distance < this.config.location.miles);
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
    async getLocationDatesAll() {
        this.logInfo('Checking Available Location Dates....');
        if (!this.availableLocation)
            return;
        const getLocationFunctions = this.availableLocation.map(location => () => promises_1.default.setTimeout(5000, undefined, { signal: this.abortController.signal }).then(() => this.getLocationDates(location)));
        while (!this.stopped) {
            console.log('--------------------------------------------------------------------------------');
            await this.queue.addAll(getLocationFunctions).catch(() => null);
            try {
                await promises_1.default.setTimeout(this.config.appSettings.interval, undefined, { signal: this.abortController.signal });
            }
            catch (err) {
                if (err.name === 'AbortError')
                    break;
                throw err;
            }
        }
    }
    async getLocationDates(location) {
        const locationConfig = this.config.location;
        const requestBody = {
            LocationId: location.Id,
            PreferredDay: 0,
            SameDay: locationConfig.sameDay,
            StartDate: null,
            TypeId: this.config.personalInfo.typeId || 71,
        };
        const response = (await this.requestApi('/api/AvailableLocationDates', 'POST', requestBody).then(res => res.data));
        let AvailableDates = response.LocationAvailabilityDates;
        if (!locationConfig.sameDay) {
            AvailableDates = response.LocationAvailabilityDates.filter(date => {
                const AvailabilityDate = (0, dayjs_1.default)(date.AvailabilityDate);
                const startDate = (0, dayjs_1.default)(this.config.location.daysAround.startDate);
                let preferredDaysCondition = true;
                if (locationConfig.preferredDays.length > 0)
                    preferredDaysCondition = locationConfig.preferredDays.includes(AvailabilityDate.day());
                return (AvailabilityDate.isBetween(startDate.add(locationConfig.daysAround.start, 'day'), startDate.add(locationConfig.daysAround.end, 'day'), 'day') &&
                    date.AvailableTimeSlots.length > 0 &&
                    preferredDaysCondition);
            });
        }
        if (AvailableDates.length !== 0) {
            const filteredAvailabilityDates = AvailableDates.map(date => {
                const filteredTimeSlots = date.AvailableTimeSlots.filter(timeSlot => {
                    const startDateTime = (0, dayjs_1.default)(timeSlot.StartDateTime);
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
            if (!this.queue.isPaused)
                this.queue.pause();
            if (!this.config.appSettings.cancelIfExist && this.existBooking?.exist) {
                this.logWarn('cancelIfExist is disabled! Please cancel existing appointment manually!');
                this.stop();
                return Promise.resolve(true);
            }
            this.holdSlot(booking, location);
            return Promise.resolve(true);
        }
        this.logInfo(`${location.Name} is not Available in ${locationConfig.sameDay
            ? 'the same day'
            : `around ${locationConfig.daysAround.start}-${locationConfig.daysAround.end} days from ${this.config.location.daysAround.startDate}!`} `);
        return Promise.reject();
    }
    async requestApi(path, method, body, retryTime = 0) {
        const headers = {
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
        if (this.authToken)
            headers['Authorization'] = this.authToken;
        const response = await this.requestClient.request({
            method,
            url: path,
            headers,
            timeout: this.config.appSettings.headersTimeout,
            data: method === 'POST' ? body : undefined, // Include body only for POST requests
            validateStatus: () => true,
            signal: this.abortController.signal,
        });
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
                    await promises_1.default.setTimeout(5000, undefined, { signal: this.abortController.signal });
                }
            }
            if (response.status === 403) {
                this.logWarn('Got rate limited, sleep for 10s...');
                await promises_1.default.setTimeout(10000, undefined, { signal: this.abortController.signal });
                return this.requestApi(path, method, body, retryTime + 1);
            }
            if (retryTime < this.config.appSettings.maxRetry) {
                this.logInfo(`Retrying failed request... (Retry ${retryTime + 1}/${this.config.appSettings.maxRetry})`);
                return this.requestApi(path, method, body, retryTime + 1);
            }
            this.logError(`Got ${response.status} status code, retrying failed!`);
            this.stop();
            throw new Error(`Got ${response.status} status code, retrying failed!`);
        }
        return response;
    }
    async holdSlot(booking, location) {
        if (this.isHolded)
            return;
        const requestBody = {
            DateOfBirth: this.config.personalInfo.dob,
            FirstName: this.config.personalInfo.firstName,
            LastName: this.config.personalInfo.lastName,
            Last4Ssn: this.config.personalInfo.lastFourSSN,
            SlotId: booking.SlotId,
        };
        const response = (await this.requestApi('/api/HoldSlot', 'POST', requestBody).then(res => res.data));
        if (response.SlotHeldSuccessfully !== true) {
            this.logError(`Failed to hold slot: ${response.ErrorMessage}`);
            if (this.queue.isPaused)
                this.queue.start();
            return;
        }
        this.logInfo('Slot hold successfully. Sleeping for 5s...');
        this.isHolded = true;
        await promises_1.default.setTimeout(5000, undefined, { signal: this.abortController.signal });
        await this.bookSlot(booking, location);
    }
    async bookSlot(booking, location) {
        if (this.isBooked)
            return;
        this.logInfo('Booking slot....');
        if (this.existBooking?.exist) {
            this.logInfo(`Canceling existing booking ${this.existBooking.response[0].ConfirmationNumber}`);
            await this.cancelBooking(this.existBooking.response[0].ConfirmationNumber);
        }
        const requestBody = {
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
            ResponseId: this.responseId,
            SendSms: !!this.config.personalInfo.phoneNumber,
            ServiceTypeId: this.config.personalInfo.typeId || 71,
            SiteId: location.Id,
            SpanishLanguage: 'N',
        };
        const response = await this.requestApi('/api/NewBooking', 'POST', requestBody);
        if (response.status === 200) {
            const bookingInfo = response.data;
            if (bookingInfo?.Booking === null) {
                if (this.queue.isPaused)
                    this.queue.start();
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
            if (this.config.appSettings.pushNotifcation.enabled) {
                this.logInfo('Sending notification...');
                await (0, PushNotification_1.pushNotifcation)(`Booked for ${this.config.personalInfo.firstName} ${this.config.personalInfo.lastName}. URL: ${appointmentURL}`).catch(error => {
                    this.logError('Failed to send notification', error);
                });
            }
            this.stop();
            return;
        }
        else {
            if (this.queue.isPaused)
                this.queue.start();
            this.logError('Failed to book slot');
            this.logError(response.data);
        }
    }
    async getAuthToken() {
        if (this.config.appSettings.captcha.strategy === 'solver') {
            const captchaToken = await this.getCaptchaToken();
            const requestBody = {
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
            const response = (await this.requestApi('/api/v1/account/auth', 'POST', requestBody).then(res => res.data));
            this.authToken = response.data.token;
        }
        else if (this.config.appSettings.captcha.strategy === 'browser') {
            try {
                const response = await (0, Browser_1.getAuthTokenFromBroswer)();
                const parsed = JSON.parse(response);
                this.authToken = parsed.data.token;
            }
            catch (err) {
                this.logError('Browser auth failed. Waiting for manual token...');
                this.emit('AUTH_REQUIRED');
                await new Promise((resolve, reject) => {
                    const onAbort = () => {
                        this.removeListener('manual_token_received', resolve);
                        reject(new Error('Aborted'));
                    };
                    if (this.abortController.signal.aborted)
                        return onAbort();
                    this.abortController.signal.addEventListener('abort', onAbort);
                    this.once('manual_token_received', () => {
                        this.abortController.signal.removeEventListener('abort', onAbort);
                        resolve();
                    });
                });
            }
        }
        else if (this.config.appSettings.captcha.strategy === 'manual') {
            const response = await (0, prompts_1.default)({
                type: 'text',
                name: 'token',
                message: 'Your captcha token is expired. Enter the new token: ',
                onState: (state) => {
                    if (state.aborted)
                        this.stop();
                },
            });
            if (this.stopped)
                return;
            this.authToken = response.token;
        }
        if (this.authToken) {
            (0, fs_1.writeFileSync)('././cache/token.tmp', this.authToken);
        }
    }
    async getCaptchaToken(taskId, retries = 0) {
        if (retries > this.maxCaptchaSolverRetries) {
            this.logError(`Get captcha token failed after ${this.maxCaptchaSolverRetries} retries! will retry!`);
            return await this.getCaptchaToken(null, 0);
        }
        if (!taskId)
            taskId = await (0, CaptchaSolver_1.CreateCaptchaSolverTask)();
        const captchaResult = await this.getCaptchaResult(taskId);
        if (captchaResult === undefined) {
            await promises_1.default.setTimeout(2000, undefined, { signal: this.abortController.signal });
            return this.getCaptchaToken(taskId, retries + 1);
        }
        if (captchaResult === null) {
            this.logError('get captcha token failed! will create new task and sleep 10s!');
            await promises_1.default.setTimeout(10000, undefined, { signal: this.abortController.signal });
            return this.getCaptchaToken(null, retries + 1);
        }
        this.logInfo('Captcha token received successfully');
        this.userAgent = captchaResult.userAgent;
        return captchaResult.captchaToken;
    }
    async getCaptchaResult(taskId) {
        if (!taskId)
            return null;
        this.logInfo(`Waiting for captcha token from task ${taskId}...`);
        try {
            const captchaResult = await (0, CaptchaSolver_1.GetCaptchaSolverResult)(taskId);
            if (captchaResult.status !== 'ready') {
                if (captchaResult.status === 'processing')
                    return undefined;
                else
                    return null;
            }
            return {
                captchaToken: captchaResult.solution.gRecaptchaResponse,
                userAgent: captchaResult.solution.userAgent,
            };
        }
        catch (err) {
            this.logError('Error while getting captcha token: ', err);
            return null;
        }
    }
}
exports.TexasScheduler = TexasScheduler;
exports.default = TexasScheduler;
