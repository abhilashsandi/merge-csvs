import _ from 'lodash';
import puppeteer from 'puppeteer-extra';
import { executablePath, Page } from 'puppeteer';
// This plugin prevent bot detection
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// This plugin anonymize user agent
import AnonymizeUA from 'puppeteer-extra-plugin-anonymize-ua';

import * as log from '../Log';
import parseConfig from '../Config';
import nodeTimer from 'node:timers/promises';

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUA({ stripHeadless: true, makeWindows: true }));

export const getAuthTokenFromBroswer = async (): Promise<string> => {
    const config = parseConfig();
    try {
        // Launch brower instance
        const browser = await puppeteer.launch({
            headless: process.env.HEADLESS?.toLowerCase() == 'false' ? false : 'shell',
            // headless: false,
            slowMo: 10,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disk-cache-size=0'],
            executablePath: executablePath(),
            timeout: 0,
        });
        const [page] = await browser.pages();

        // Randomize viewport size
        await page.setViewport({
            width: 1920 + _.random(0, 200),
            height: 1080 + _.random(0, 200),
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

        await nodeTimer.setTimeout(_.random(1000, 2000)); // Random delay

        log.info('Inputting personal info...');
        // Input indices based on image: 1: Card Number, 2: First Name, 3: Last Name, 4: DOB, 5: SSN, 6: Contact Method, 7: Phone
        await page.type('.v-input:nth-child(2) input', config.personalInfo.firstName, { delay: _.random(100, 300) });
        await page.type('.v-input:nth-child(3) input', config.personalInfo.lastName, { delay: _.random(100, 300) });
        await page.type('.v-input:nth-child(4) input', config.personalInfo.dob.replaceAll('/', ''), { delay: _.random(100, 300) });
        await page.type('.v-input:nth-child(5) input', config.personalInfo.lastFourSSN, { delay: _.random(100, 300) });

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
                await page.keyboard.type(config.personalInfo.phoneNumber, { delay: _.random(100, 300) });
            } else {
                log.warn('Could not find phone input by placeholder, trying fallback selector...');
                await page.type('.v-input:nth-child(7) input', config.personalInfo.phoneNumber, { delay: _.random(100, 300) });
            }
        }

        log.info('Input personal info done');

        log.info('Scrolling login button into view...');
        await page.evaluate(() => {
            const loginBtn = document.querySelector('.v-card__actions.text-center > button');
            if (loginBtn) {
                loginBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.scrollTo(0, document.body.scrollHeight);
            }
        });
        await nodeTimer.setTimeout(1000);

        log.dev('Setting up network interception...');
        const client = await page.createCDPSession();
        await client.send('Network.enable');

        const captchaTokenPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                log.error('URL capture timed out. Capturing screenshot for debug...');
                page.screenshot({ path: 'cache/debug_timeout.png' }).catch(() => null);
                reject(new Error('Auth token retrieval timed out after 60 seconds'));
            }, 60000);

            client.on('Network.responseReceived', async event => {
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
                    .catch(() => null);
            });
        });

        const tryAgainDialog = async (page: Page, retryTime = 0) => {
            log.info('Google captcha score too low, trying again!');
            if (retryTime > 10) throw new Error('Captcha token retrieval failed!');
            await nodeTimer.setTimeout(_.random(1000, 3000, false));
            const closeBtn = await page.$('.v-dialog--active > div > div > button');
            if (closeBtn) await closeBtn.click();
            await nodeTimer.setTimeout(_.random(1000, 3000, false));
            const loginBtn = await page.$('.v-card__actions.text-center > button');
            if (loginBtn) await loginBtn.click();
            page.waitForSelector('.v-dialog--active')
                .then(() => setTimeout(() => tryAgainDialog(page, retryTime + 1), 5000))
                .catch(() => null);
        };

        // Wait for the auth token
        const captchaToken = (await captchaTokenPromise) as string;
        // Close the browser
        await browser.close();

        log.info('Get captcha token successfully!');
        log.dev(`Captcha token: ${captchaToken}`);
        return captchaToken;
    } catch (err) {
        log.error('Error while getting captcha token: ', err as Error);
        log.info('Try to get captcha token again or manual set it in config.yml');
        process.exit(1);
    }
};
