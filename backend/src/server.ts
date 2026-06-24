import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { TexasScheduler } from './Client';

const app = express();
app.use(cors());
app.use(express.json());

interface JobEntry {
    scheduler: TexasScheduler;
    timeoutHandle: NodeJS.Timeout;
}
const jobs: Record<string, JobEntry> = {};

app.post('/api/schedule/start', async (req, res) => {
    const config = req.body;
    
    // Validate request body
    if (!config || !config.personalInfo) {
        return res.status(400).json({ error: 'Invalid configuration: missing personalInfo' });
    }

    let startDate = require('dayjs')(config.location?.daysAround?.startDate);
    if (!config.location?.daysAround?.startDate || !startDate.isValid() || startDate.isBefore(require('dayjs')().startOf('day'))) {
        startDate = require('dayjs')();
    }
    if (config.location && config.location.daysAround) {
        config.location.daysAround.startDate = startDate.format('MM/DD/YYYY');
    }
    const jobId = uuidv4();
    const scheduler = new TexasScheduler(config);

    // Timeout after config max time (default 30 mins)
    const maxTime = config.appSettings?.maxExecutionTime || 30 * 60 * 1000;
    const timeoutHandle = setTimeout(() => {
        if (jobs[jobId]) {
            jobs[jobId].scheduler.stop();
            delete jobs[jobId];
        }
    }, maxTime);

    jobs[jobId] = { scheduler, timeoutHandle };

    // Start asynchronously
    scheduler.run().then(() => {
        if (jobs[jobId]) {
            clearTimeout(jobs[jobId].timeoutHandle);
            delete jobs[jobId];
        }
    }).catch(err => {
        console.error(err);
        if (jobs[jobId]) {
            clearTimeout(jobs[jobId].timeoutHandle);
            delete jobs[jobId];
        }
    });

    res.json({ jobId, status: 'started' });
});

app.post('/api/schedule/stop', (req, res) => {
    const { jobId } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].scheduler.stop();
        clearTimeout(jobs[jobId].timeoutHandle);
        delete jobs[jobId];
        res.json({ status: 'stopped' });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.post('/api/schedule/token', (req, res) => {
    const { jobId, token } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].scheduler.submitManualToken(token);
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
    const job = jobs[jobId];

    if (!job) {
        res.status(404).end();
        return;
    }

    const logListener = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    job.scheduler.on('log', logListener);

    const authListener = () => {
        res.write(`data: ${JSON.stringify({ type: 'AUTH_REQUIRED', message: 'Manual Auth Token Required' })}\n\n`);
    };

    job.scheduler.on('AUTH_REQUIRED', authListener);

    const finishedListener = () => {
        res.write(`data: ${JSON.stringify({ type: 'FINISHED', message: 'Automation complete or terminated.' })}\n\n`);
        res.end();
    };

    job.scheduler.on('FINISHED', finishedListener);

    req.on('close', () => {
        job.scheduler.off('log', logListener);
        job.scheduler.off('AUTH_REQUIRED', authListener);
        job.scheduler.off('FINISHED', finishedListener);
    });
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT}`);
    });
}
export default app;
