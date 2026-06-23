import { EventEmitter } from 'events';
import { yellow, green, red } from 'colorette';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Chicago');

export const logEmitter = new EventEmitter();

const timeNow = () => dayjs().format('MM/DD/YYYY h:mm:ss');

const emitLog = (type: string, message: string) => {
    const formattedMessage = `[${timeNow()}] ${message}`;
    logEmitter.emit('log', { type, message: formattedMessage });
};

const msg = (func: any, message: string) => {
    func(`${yellow(`[${timeNow()}]`)} ${green(message)}`);
    emitLog('info', message);
};

export const error = (message = 'Unknown error', err?: Error) => {
    console.error(`[${yellow(timeNow())}] ERROR: ${red(message)}`);
    if (err) console.error(err);
    emitLog('error', message + (err ? ` ${err.message}` : ''));
};

export const info = (message: string) => msg(console.info, message);

export const dev = (message: string) => {
    if (process.env.NODE_ENV === 'development') {
        msg(console.info, `${yellow('DEBUG ->')} ${message}`);
    }
};

export const warn = (message: string) => {
    msg(console.warn, `${yellow('WARNING ->')} ${message}`);
    emitLog('warn', message);
};
