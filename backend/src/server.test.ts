import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from './server';
import { TexasScheduler } from './Client';

test('Express API Tests', async (t) => {
    let jobId: string;

    const originalRun = TexasScheduler.prototype.run;
    t.beforeEach(() => {
        TexasScheduler.prototype.run = async function() {
            // Mock run to do nothing
        };
    });

    t.afterEach(() => {
        TexasScheduler.prototype.run = originalRun;
    });

    await t.test('POST /api/schedule/start should start a job', async () => {
        const res = await request(app)
            .post('/api/schedule/start')
            .send({ 
                location: { zipCode: ['12345'], cityName: [] }, 
                personalInfo: { firstName: 'John' },
                appSettings: { maxExecutionTime: 1000 }
            });

        assert.strictEqual(res.status, 200);
        assert.ok(res.body.jobId);
        assert.strictEqual(res.body.status, 'started');
        jobId = res.body.jobId;
    });

    await t.test('GET /api/schedule/logs/:jobId with invalid id', async () => {
        const res = await request(app)
            .get(`/api/schedule/logs/invalid_id`);
        assert.strictEqual(res.status, 404);
    });

    await t.test('POST /api/schedule/token should accept token', async () => {
        const res = await request(app)
            .post('/api/schedule/token')
            .send({ jobId, token: 'my_token' });
            
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.status, 'token_accepted');
    });

    await t.test('POST /api/schedule/stop should stop job', async () => {
        const res = await request(app)
            .post('/api/schedule/stop')
            .send({ jobId });
            
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.status, 'stopped');
    });

    await t.test('POST /api/schedule/stop with invalid id', async () => {
        const res = await request(app)
            .post('/api/schedule/stop')
            .send({ jobId: 'invalid_id' });
            
        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.error, 'Job not found');
    });
});
