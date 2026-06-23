"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("./server"));
const Client_1 = require("./Client");
(0, node_test_1.default)('Express API Tests', async (t) => {
    let jobId;
    const originalRun = Client_1.TexasScheduler.prototype.run;
    t.beforeEach(() => {
        Client_1.TexasScheduler.prototype.run = async function () {
            // Mock run to simulate pending job
            return new Promise(() => { });
        };
    });
    t.afterEach(() => {
        Client_1.TexasScheduler.prototype.run = originalRun;
    });
    await t.test('POST /api/schedule/start should start a job', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/schedule/start')
            .send({
            location: { zipCode: ['12345'], cityName: [] },
            personalInfo: { firstName: 'John' },
            appSettings: { maxExecutionTime: 1000 }
        });
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.ok(res.body.jobId);
        node_assert_1.default.strictEqual(res.body.status, 'started');
        jobId = res.body.jobId;
    });
    await t.test('GET /api/schedule/logs/:jobId with invalid id', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .get(`/api/schedule/logs/invalid_id`);
        node_assert_1.default.strictEqual(res.status, 404);
    });
    await t.test('POST /api/schedule/token should accept token', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/schedule/token')
            .send({ jobId, token: 'my_token' });
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.strictEqual(res.body.status, 'token_accepted');
    });
    await t.test('POST /api/schedule/stop should stop job', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/schedule/stop')
            .send({ jobId });
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.strictEqual(res.body.status, 'stopped');
    });
    await t.test('POST /api/schedule/stop with invalid id', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/schedule/stop')
            .send({ jobId: 'invalid_id' });
        node_assert_1.default.strictEqual(res.status, 404);
        node_assert_1.default.strictEqual(res.body.error, 'Job not found');
    });
});
