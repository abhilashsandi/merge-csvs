import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { TexasScheduler } from './Client';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Keep-alive health check endpoint for UptimeRobot
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), activeJobs: Object.keys(jobs).length });
});

interface JobEntry {
    scheduler: TexasScheduler;
    timeoutHandle: NodeJS.Timeout;
}
const jobs: Record<string, JobEntry> = {};

const activeJobsPath = path.join(__dirname, '..', 'cache', 'active_jobs.json');

function saveActiveJobs() {
    try {
        const jobsToSave: Record<string, any> = {};
        for (const jobId in jobs) {
            jobsToSave[jobId] = jobs[jobId].scheduler.config;
        }
        if (!fs.existsSync(path.dirname(activeJobsPath))) {
            fs.mkdirSync(path.dirname(activeJobsPath), { recursive: true });
        }
        fs.writeFileSync(activeJobsPath, JSON.stringify(jobsToSave, null, 2));
    } catch (e) {
        console.error('Failed to save active jobs', e);
    }
}

function startJob(jobId: string, config: any) {
    const scheduler = new TexasScheduler(config);

    const maxTime = config.appSettings?.maxExecutionTime || 0;
    const timeoutHandle = maxTime > 0 ? setTimeout(() => {
        if (jobs[jobId]) {
            jobs[jobId].scheduler.stop(`Job reached maximum execution time of ${Math.round(maxTime / 60000)} minutes. Stopping automatically.`);
            delete jobs[jobId];
            saveActiveJobs();
        }
    }, maxTime) : undefined as any;

    jobs[jobId] = { scheduler, timeoutHandle };
    saveActiveJobs();

    scheduler.run().then(() => {
        if (jobs[jobId]) {
            clearTimeout(jobs[jobId].timeoutHandle);
            delete jobs[jobId];
            saveActiveJobs();
        }
    }).catch(err => {
        console.error(err);
        if (jobs[jobId]) {
            clearTimeout(jobs[jobId].timeoutHandle);
            delete jobs[jobId];
            saveActiveJobs();
        }
    });
}

app.post('/api/schedule/restore', async (req, res) => {
    const { jobId, config } = req.body;
    if (!jobId || !config || !config.personalInfo) {
        return res.status(400).json({ error: 'Invalid configuration' });
    }
    if (!jobs[jobId]) {
        let startDate = require('dayjs')(config.location?.daysAround?.startDate);
        if (!config.location?.daysAround?.startDate || !startDate.isValid() || startDate.isBefore(require('dayjs')().startOf('day'))) {
            startDate = require('dayjs')();
        }
        if (config.location && config.location.daysAround) {
            config.location.daysAround.startDate = startDate.format('MM/DD/YYYY');
        }
        startJob(jobId, config);
    }
    res.json({ jobId, status: 'restored' });
});

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
    startJob(jobId, config);

    res.json({ jobId, status: 'started' });
});

app.post('/api/schedule/stop', (req, res) => {
    const { jobId } = req.body;
    if (jobs[jobId]) {
        jobs[jobId].scheduler.stop();
        clearTimeout(jobs[jobId].timeoutHandle);
        delete jobs[jobId];
        saveActiveJobs();
        res.json({ status: 'stopped' });
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

app.post('/api/admin/jobs', (req, res) => {
    const { password } = req.body;
    if (password !== '2026admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const activeJobs = Object.keys(jobs).map(jobId => {
        const job = jobs[jobId];
        return {
            jobId,
            firstName: job.scheduler.config?.personalInfo?.firstName,
            lastName: job.scheduler.config?.personalInfo?.lastName,
            email: job.scheduler.config?.personalInfo?.email,
            typeId: job.scheduler.config?.personalInfo?.typeId,
            zipCode: job.scheduler.config?.location?.zipCode,
        };
    });
    res.json({ jobs: activeJobs });
});

app.post('/api/admin/jobs/:jobId/stop', (req, res) => {
    const { password } = req.body;
    if (password !== '2026admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { jobId } = req.params;
    if (jobs[jobId]) {
        jobs[jobId].scheduler.stop();
        clearTimeout(jobs[jobId].timeoutHandle);
        delete jobs[jobId];
        saveActiveJobs();
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
        res.write(`data: ${JSON.stringify({ type: 'FINISHED', message: 'Job has ended or does not exist.' })}\n\n`);
        res.end();
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

function restoreActiveJobs() {
    try {
        if (fs.existsSync(activeJobsPath)) {
            const savedJobs = JSON.parse(fs.readFileSync(activeJobsPath, 'utf8'));
            for (const jobId in savedJobs) {
                console.log(`Restoring job ${jobId} from cache...`);
                startJob(jobId, savedJobs[jobId]);
            }
        }
    } catch (e) {
        console.error('Failed to restore active jobs', e);
    }
}

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
    restoreActiveJobs();
    app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT}`);
    });
}
export default app;
