"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.dev = exports.info = exports.error = exports.logEmitter = void 0;
const events_1 = require("events");
const colorette_1 = require("colorette");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault('America/Chicago');
exports.logEmitter = new events_1.EventEmitter();
const timeNow = () => (0, dayjs_1.default)().format('MM/DD/YYYY h:mm:ss');
const emitLog = (type, message) => {
    const formattedMessage = `[${timeNow()}] ${message}`;
    exports.logEmitter.emit('log', { type, message: formattedMessage });
};
const msg = (func, message) => {
    func(`${(0, colorette_1.yellow)(`[${timeNow()}]`)} ${(0, colorette_1.green)(message)}`);
    emitLog('info', message);
};
const error = (message = 'Unknown error', err) => {
    console.error(`[${(0, colorette_1.yellow)(timeNow())}] ERROR: ${(0, colorette_1.red)(message)}`);
    if (err)
        console.error(err);
    emitLog('error', message + (err ? ` ${err.message}` : ''));
};
exports.error = error;
const info = (message) => msg(console.info, message);
exports.info = info;
const dev = (message) => {
    if (process.env.NODE_ENV === 'development') {
        msg(console.info, `${(0, colorette_1.yellow)('DEBUG ->')} ${message}`);
    }
};
exports.dev = dev;
const warn = (message) => {
    msg(console.warn, `${(0, colorette_1.yellow)('WARNING ->')} ${message}`);
    emitLog('warn', message);
};
exports.warn = warn;
