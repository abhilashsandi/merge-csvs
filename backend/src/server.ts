import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { TexasScheduler } from './Client';
import { logEmitter } from './Log';

const app = express();
app.use(cors());
app.use(express.json());

const jobs: Record<string, TexasScheduler> = {};

app.post('/api/schedule/start', async (req, res) => {
    const config = req.body;
    const jobId = uuidv4();
    const scheduler = new TexasScheduler(config);
    jobs[jobId] = scheduler;

    // Timeout after config max time (default 30 mins)
    const maxTime = config.appSettings?.maxExecutionTime || 30 * 60 * 1000;
    setTimeout(() => {
        if (jobs[jobId]) {
            jobs[jobId].stop();
            delete jobs[jobId];
        }
    }, maxTime);

    // Start asynchronously
    scheduler.run().catch(console.error);

    res.json({ jobId, status: 'started' });
});

app.post('/api/schedule/stop', (req, res) => {
    const { jobId } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].stop();
        delete jobs[jobId];
        res.json({ status: 'stopped' });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.post('/api/schedule/token', (req, res) => {
    const { jobId, token } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].submitManualToken(token);
        res.json({ status: 'token_accepted' });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.get('/api/schedule/logs/:jobId', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { jobId } = req.params;
    const scheduler = jobs[jobId];

    const logListener = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    logEmitter.on('log', logListener);

    if (scheduler) {
        scheduler.on('AUTH_REQUIRED', () => {
            res.write(`data: ${JSON.stringify({ type: 'AUTH_REQUIRED', message: 'Manual Auth Token Required' })}\n\n`);
        });
    }

    req.on('close', () => {
        logEmitter.off('log', logListener);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
