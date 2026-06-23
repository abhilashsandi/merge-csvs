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
exports.getAuthTokenFromBroswer = void 0;
const lodash_1 = __importDefault(require("lodash"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_1 = require("puppeteer");
// This plugin prevent bot detection
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
// This plugin anonymize user agent
const puppeteer_extra_plugin_anonymize_ua_1 = __importDefault(require("puppeteer-extra-plugin-anonymize-ua"));
const log = __importStar(require("../Log"));
const Config_1 = __importDefault(require("../Config"));
const promises_1 = __importDefault(require("node:timers/promises"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_anonymize_ua_1.default)({ stripHeadless: true, makeWindows: true }));
const getAuthTokenFromBroswer = async () => {
    const config = (0, Config_1.default)();
    try {
        // Launch brower instance
        const browser = await puppeteer_extra_1.default.launch({
            headless: process.env.HEADLESS?.toLowerCase() == 'false' ? false : 'shell',
            // headless: false,
            slowMo: 10,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disk-cache-size=0'],
            executablePath: (0, puppeteer_1.executablePath)(),
            timeout: 0,
        });
        const [page] = await browser.pages();
        // Randomize viewport size
        await page.setViewport({
            width: 1920 + lodash_1.default.random(0, 200),
            height: 1080 + lodash_1.default.random(0, 200),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: true,
            isMobile: false,
        });
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
        log.dev('Navigating to DPS site...');
        await page.goto('https://www.txdpsscheduler.com/');
        // English button
        log.dev('Clicking English button...');
        await page.waitForSelector('.container > button');
        await page.click('.container > button');
        await page.waitForNetworkIdle();
        // Personal infomation form
        log.dev('Waiting for login form...');
        await page.waitForSelector('.v-card__text');
        await promises_1.default.setTimeout(lodash_1.default.random(1000, 2000)); // Random delay
        log.info('Inputting personal info...');
        // Input indices based on image: 1: Card Number, 2: First Name, 3: Last Name, 4: DOB, 5: SSN, 6: Contact Method, 7: Phone
        await page.type('.v-input:nth-child(2) input', config.personalInfo.firstName, { delay: lodash_1.default.random(100, 300) });
        await page.type('.v-input:nth-child(3) input', config.personalInfo.lastName, { delay: lodash_1.default.random(100, 300) });
        await page.type('.v-input:nth-child(4) input', config.personalInfo.dob.replaceAll('/', ''), { delay: lodash_1.default.random(100, 300) });
        await page.type('.v-input:nth-child(5) input', config.personalInfo.lastFourSSN, { delay: lodash_1.default.random(100, 300) });
        if (config.personalInfo.phoneNumber) {
            log.info('Inputting phone number...');
            // Try to find the input with the phone mask placeholder
            const phoneInputFound = await page.evaluate(() => {
                const inputs = Array.from(document.querySelectorAll('input'));
                const phoneInput = inputs.find(i => i.placeholder && i.placeholder.includes('###'));
                if (phoneInput) {
                    phoneInput.focus();
                    return true;
                }
                return false;
            });
            if (phoneInputFound) {
                await page.keyboard.type(config.personalInfo.phoneNumber, { delay: lodash_1.default.random(100, 300) });
            }
            else {
                log.warn('Could not find phone input by placeholder, trying fallback selector...');
                await page.type('.v-input:nth-child(7) input', config.personalInfo.phoneNumber, { delay: lodash_1.default.random(100, 300) });
            }
        }
        log.info('Input personal info done');
        log.info('Scrolling login button into view...');
        await page.evaluate(() => {
            const loginBtn = document.querySelector('.v-card__actions.text-center > button');
            if (loginBtn) {
                loginBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else {
                window.scrollTo(0, document.body.scrollHeight);
            }
        });
        await promises_1.default.setTimeout(1000);
        log.dev('Setting up network interception...');
        const client = await page.createCDPSession();
        await client.send('Network.enable');
        const captchaTokenPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                log.error('URL capture timed out. Capturing screenshot for debug...');
                page.screenshot({ path: 'cache/debug_timeout.png' }).catch((e) => log.warn(`Failed to capture debug screenshot: ${e}`));
                reject(new Error('Auth token retrieval timed out after 60 seconds'));
            }, 60000);
            client.on('Network.responseReceived', async (event) => {
                log.dev(`Intercepted: ${event.response.url} (Status: ${event.response.status})`);
                if (event.response.url.includes('/api/v1/account/auth') && event.response.status === 200) {
                    log.info('Auth endpoint hit! Extracting token...');
                    const response = await client.send('Network.getResponseBody', { requestId: event.requestId });
                    clearTimeout(timeout);
                    resolve(response.body);
                }
            });
            // Click the login button
            log.info('Clicking Login button...');
            page.waitForSelector('.v-card__actions.text-center > button').then(async () => {
                await page.click('.v-card__actions.text-center > button');
                page.waitForSelector('.v-dialog--active')
                    .then(() => setTimeout(() => tryAgainDialog(page), 5000))
                    .catch((e) => log.warn(`Failed to wait for selector: ${e}`));
            });
        });
        const tryAgainDialog = async (page, retryTime = 0) => {
            log.info('Google captcha score too low, trying again!');
            if (retryTime > 10)
                throw new Error('Captcha token retrieval failed!');
            await promises_1.default.setTimeout(lodash_1.default.random(1000, 3000, false));
            const closeBtn = await page.$('.v-dialog--active > div > div > button');
            if (closeBtn)
                await closeBtn.click();
            await promises_1.default.setTimeout(lodash_1.default.random(1000, 3000, false));
            const loginBtn = await page.$('.v-card__actions.text-center > button');
            if (loginBtn)
                await loginBtn.click();
            page.waitForSelector('.v-dialog--active')
                .then(() => setTimeout(() => tryAgainDialog(page, retryTime + 1), 5000))
                .catch((e) => log.warn(`Failed to wait for selector: ${e}`));
        };
        // Wait for the auth token
        const captchaToken = (await captchaTokenPromise);
        // Close the browser
        await browser.close();
        log.info('Get captcha token successfully!');
        log.dev(`Captcha token: ${captchaToken}`);
        return captchaToken;
    }
    catch (err) {
        log.error('Error while getting captcha token: ', err);
        log.info('Try to get captcha token again or manual set it in config.yml');
        process.exit(1);
    }
};
exports.getAuthTokenFromBroswer = getAuthTokenFromBroswer;
