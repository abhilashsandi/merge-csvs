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
const node_test_1 = __importStar(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const index_1 = require("./index");
const log = __importStar(require("../Log"));
const browser = __importStar(require("../Browser"));
const axios_1 = __importDefault(require("axios"));
const prompts_1 = __importDefault(require("prompts"));
node_test_1.default.describe('TexasScheduler', () => {
    node_test_1.default.beforeEach(() => {
        // Mock the Log so it doesn't spam console during tests
        node_test_1.mock.method(log, 'info', () => { });
        node_test_1.mock.method(log, 'error', () => { });
        node_test_1.mock.method(log, 'warn', () => { });
        node_test_1.mock.method(log, 'dev', () => { });
        // Mock external dependencies
        node_test_1.mock.method(axios_1.default, 'create', () => ({
            request: node_test_1.mock.fn(async () => ({ status: 200, data: [] }))
        }));
        node_test_1.mock.method(browser, 'getAuthTokenFromBroswer', async () => {
            throw new Error('Mocked browser fallback error');
        });
        // Mock prompts using inject (standard for prompts)
        prompts_1.default.inject(['test-manual-token']);
    });
    node_test_1.default.afterEach(() => {
        node_test_1.mock.restoreAll();
    });
    node_test_1.default.it('stop() correctly aborts the signal', async () => {
        const scheduler = new index_1.TexasScheduler({
            appSettings: { captcha: { strategy: 'manual' } },
            personalInfo: {},
            location: {}
        });
        // Since strategy is manual, run() would await prompts
        // We will call run() and then stop() to abort it
        const runPromise = scheduler.run().catch(() => { });
        node_assert_1.default.strictEqual(scheduler.abortController.signal.aborted, false);
        scheduler.stop();
        node_assert_1.default.strictEqual(scheduler.abortController.signal.aborted, true);
        await runPromise;
    });
    node_test_1.default.it('auth fallback logic resolves on submitManualToken', async () => {
        const scheduler = new index_1.TexasScheduler({
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
        node_assert_1.default.strictEqual(authRequiredEmitted, true);
        node_assert_1.default.strictEqual(scheduler.authToken, 'test-manual-token');
    });
    node_test_1.default.it('auth fallback aborts cleanly when stopped', async () => {
        const scheduler = new index_1.TexasScheduler({
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
        node_assert_1.default.strictEqual(authRequiredEmitted, true);
        node_assert_1.default.strictEqual(scheduler.abortController.signal.aborted, true);
    });
});
