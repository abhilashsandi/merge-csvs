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
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const puppeteer_extra_plugin_anonymize_ua_1 = __importDefault(require("puppeteer-extra-plugin-anonymize-ua"));
const log = __importStar(require("../Log"));
const promises_1 = __importDefault(require("node:timers/promises"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_anonymize_ua_1.default)({ stripHeadless: true, makeWindows: true }));
const getAuthTokenFromBroswer = async (config, onLog) => {
    const emitLog = (msg, type = 'info') => {
        if (type === 'error')
            log.error(msg);
        else if (type === 'warn')
            log.warn(msg);
        else if (type === 'dev')
            log.dev(msg);
        else
            log.info(msg);
        if (onLog)
            onLog(msg, type);
    };
    try {
        const isHeadless = process.env.HEADLESS === 'true' || process.env.NODE_ENV === 'production' || !process.env.DISPLAY;
        // Use PUPPETEER_EXECUTABLE_PATH if set (e.g. system Chrome on Render),
        // otherwise fall back to puppeteer's bundled Chrome
        const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH || (0, puppeteer_1.executablePath)();
        emitLog(`Launching browser instance (headless=${isHeadless}, chrome=${chromePath})...`);
        const browser = await puppeteer_extra_1.default.launch({
            headless: isHeadless,
            slowMo: isHeadless ? 0 : 10,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-software-rasterizer',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disk-cache-size=0',
            ],
            executablePath: chromePath,
            timeout: 60000,
        });
        const [page] = await browser.pages();
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
        emitLog('Navigating to DPS site...');
        await page.goto('https://www.txdpsscheduler.com/');
        emitLog('Clicking English button...');
        await page.waitForSelector('.container > button');
        await page.click('.container > button');
        await page.waitForNetworkIdle();
        emitLog('Waiting for login form...', 'dev');
        await page.waitForSelector('.v-card__text');
        await promises_1.default.setTimeout(lodash_1.default.random(1000, 2000));
        emitLog('Inputting personal info...');
        await page.type('.v-input:nth-child(2) input', config.personalInfo.firstName, { delay: lodash_1.default.random(100, 300) });
        await page.type('.v-input:nth-child(3) input', config.personalInfo.lastName, { delay: lodash_1.default.random(100, 300) });
        await page.type('.v-input:nth-child(4) input', config.personalInfo.dob.replaceAll('/', ''), { delay: lodash_1.default.random(100, 300) });
        await page.type('.v-input:nth-child(5) input', config.personalInfo.lastFourSSN, { delay: lodash_1.default.random(100, 300) });
        if (config.personalInfo.phoneNumber) {
            emitLog('Inputting phone number...');
            await page.evaluate(() => {
                const phoneRadio = document.querySelector('input[type="radio"][value="phone"]');
                if (phoneRadio)
                    phoneRadio.click();
            });
            await promises_1.default.setTimeout(500);
            const phoneInputFound = await page.evaluate(() => {
                const cellPhoneInput = document.querySelector('#cellPhone');
                if (cellPhoneInput) {
                    cellPhoneInput.focus();
                    return true;
                }
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
                emitLog('Could not find phone input by placeholder, trying fallback selector...', 'warn');
                await page.type('.v-input:nth-child(7) input', config.personalInfo.phoneNumber, { delay: lodash_1.default.random(100, 300) });
            }
        }
        else if (config.personalInfo.email) {
            emitLog('Phone not provided, selecting Email instead...');
            // Click the email radio button
            await page.evaluate(() => {
                const emailRadio = document.querySelector('input[type="radio"][value="email"]');
                if (emailRadio)
                    emailRadio.click();
            });
            await promises_1.default.setTimeout(500);
            const emailInputFound = await page.evaluate(() => {
                const emailInput = document.querySelector('#email');
                if (emailInput) {
                    emailInput.focus();
                    return true;
                }
                return false;
            });
            if (emailInputFound) {
                await page.keyboard.type(config.personalInfo.email, { delay: lodash_1.default.random(100, 300) });
                await promises_1.default.setTimeout(200);
                const verifyEmailFound = await page.evaluate(() => {
                    const verifyEmailInput = document.querySelector('#verifyEmail');
                    if (verifyEmailInput) {
                        verifyEmailInput.focus();
                        return true;
                    }
                    return false;
                });
                if (verifyEmailFound) {
                    await page.keyboard.type(config.personalInfo.email, { delay: lodash_1.default.random(100, 300) });
                }
            }
        }
        emitLog('Input personal info done');
        emitLog('Scrolling login button into view...');
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
        emitLog('Setting up network interception...', 'dev');
        const client = await page.createCDPSession();
        await client.send('Network.enable');
        const captchaTokenPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                emitLog('URL capture timed out. Capturing screenshot for debug...', 'error');
                page.screenshot({ path: 'cache/debug_timeout.png' }).catch((e) => emitLog(`Failed to capture debug screenshot: ${e}`, 'warn'));
                reject(new Error('Auth token retrieval timed out after 60 seconds'));
            }, 60000);
            client.on('Network.responseReceived', async (event) => {
                emitLog(`Intercepted: ${event.response.url} (Status: ${event.response.status})`, 'dev');
                if (event.response.url.includes('/api/v1/account/auth') && event.response.status === 200) {
                    emitLog('Auth endpoint hit! Extracting token...');
                    const response = await client.send('Network.getResponseBody', { requestId: event.requestId });
                    clearTimeout(timeout);
                    resolve(response.body);
                }
            });
            emitLog('Clicking Login button...');
            page.waitForSelector('.v-card__actions.text-center > button').then(async () => {
                await page.click('.v-card__actions.text-center > button');
                page.waitForSelector('.v-dialog--active')
                    .then(() => setTimeout(() => tryAgainDialog(page), 5000))
                    .catch((e) => emitLog(`Failed to wait for selector: ${e}`, 'warn'));
            });
        });
        const tryAgainDialog = async (page, retryTime = 0) => {
            emitLog('Google captcha score too low, trying again!');
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
                .catch((e) => emitLog(`Failed to wait for selector: ${e}`, 'warn'));
        };
        const captchaToken = (await captchaTokenPromise);
        await browser.close();
        emitLog('Get captcha token successfully!');
        emitLog(`Captcha token: ${captchaToken}`, 'dev');
        return captchaToken;
    }
    catch (err) {
        emitLog(`Error while getting captcha token: ${err.message}`, 'error');
        throw err;
    }
};
exports.getAuthTokenFromBroswer = getAuthTokenFromBroswer;
