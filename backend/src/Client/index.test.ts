import test from 'node:test';
import assert from 'node:assert';
import { EventEmitter } from 'events';
import { TexasScheduler } from './index';
import * as log from '../Log';

// Mock the Log so it doesn't spam console during tests
log.info = () => {};
log.error = () => {};
log.warn = () => {};
log.dev = () => {};

test('TexasScheduler - stop() correctly aborts the signal', () => {
    const scheduler = new TexasScheduler({
        appSettings: { captcha: { strategy: 'manual' } },
        personalInfo: {},
        location: {}
    });
    
    // @ts-ignore
    assert.strictEqual(scheduler.abortController.signal.aborted, false);
    scheduler.stop();
    // @ts-ignore
    assert.strictEqual(scheduler.abortController.signal.aborted, true);
});

test('TexasScheduler - auth fallback logic resolves on submitManualToken', async () => {
    const scheduler = new TexasScheduler({
        appSettings: { captcha: { strategy: 'browser' } },
        personalInfo: {},
        location: {}
    });

    let authRequiredEmitted = false;
    scheduler.on('AUTH_REQUIRED', () => {
        authRequiredEmitted = true;
        // Simulate user submitting token
        scheduler.submitManualToken('test-manual-token');
    });

    // Let the run() process for a bit, which will trigger the AUTH_REQUIRED
    await new Promise(resolve => setTimeout(resolve, 1000));

    assert.strictEqual(authRequiredEmitted, true);
    // @ts-ignore
    assert.strictEqual(scheduler.authToken, 'test-manual-token');
    scheduler.stop();
});

test('TexasScheduler - auth fallback aborts cleanly when stopped', async () => {
    const scheduler = new TexasScheduler({
        appSettings: { captcha: { strategy: 'browser' } },
        personalInfo: {},
        location: {}
    });

    let authRequiredEmitted = false;
    scheduler.on('AUTH_REQUIRED', () => {
        authRequiredEmitted = true;
        // Stop the scheduler instead of submitting token
        scheduler.stop();
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    assert.strictEqual(authRequiredEmitted, true);
    // @ts-ignore
    assert.strictEqual(scheduler.abortController.signal.aborted, true);
});
