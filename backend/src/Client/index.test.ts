import test, { mock } from 'node:test';
import assert from 'node:assert';
import { TexasScheduler } from './index';
import * as log from '../Log';
import * as browser from '../Browser';
import axios from 'axios';
import prompts from 'prompts';

test.describe('TexasScheduler', () => {
    test.beforeEach(() => {
        // Mock the Log so it doesn't spam console during tests
        mock.method(log, 'info', () => {});
        mock.method(log, 'error', () => {});
        mock.method(log, 'warn', () => {});
        mock.method(log, 'dev', () => {});

        // Mock external dependencies
        mock.method(axios, 'create', () => ({
            request: mock.fn(async () => ({ status: 200, data: [] }))
        }));

        mock.method(browser, 'getAuthTokenFromBroswer', async () => {
            throw new Error('Mocked browser fallback error');
        });

        // Mock prompts using inject (standard for prompts)
        prompts.inject(['test-manual-token']);
    });

    test.afterEach(() => {
        mock.restoreAll();
    });

    test.it('stop() correctly aborts the signal', async () => {
        const scheduler = new TexasScheduler({
            appSettings: { captcha: { strategy: 'manual' } },
            personalInfo: {},
            location: {}
        });
        
        // Since strategy is manual, run() would await prompts
        // We will call run() and then stop() to abort it
        const runPromise = scheduler.run().catch(() => {});
        
        assert.strictEqual((scheduler as any).abortController.signal.aborted, false);
        scheduler.stop();
        assert.strictEqual((scheduler as any).abortController.signal.aborted, true);
        
        await runPromise;
    });

    test.it('auth fallback logic resolves on submitManualToken', async () => {
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

        await scheduler.run();

        assert.strictEqual(authRequiredEmitted, true);
        assert.strictEqual((scheduler as any).authToken, 'test-manual-token');
    });

    test.it('auth fallback aborts cleanly when stopped', async () => {
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

        await scheduler.run();

        assert.strictEqual(authRequiredEmitted, true);
        assert.strictEqual((scheduler as any).abortController.signal.aborted, true);
    });
});
