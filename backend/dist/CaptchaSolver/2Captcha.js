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
exports.TwoCaptchaGetResult = exports.TwoCaptchaCreateTask = void 0;
const axios_1 = __importDefault(require("axios"));
const log = __importStar(require("../Log"));
const captchaClient = axios_1.default.create({ baseURL: 'https://api.2captcha.com' });
const TwoCaptchaCreateTask = async (clientKey) => {
    const getTaskID = await captchaClient.post('/createTask', {
        clientKey,
        task: {
            type: 'RecaptchaV3TaskProxyless',
            websiteURL: 'https://www.txdpsscheduler.com',
            websiteKey: '6LesF7oaAAAAAEvJD0hjmTUib8Q5PGjTo54U2ieP',
            minScore: '0.9',
            isEnterprise: true,
            pageAction: 'login',
        },
    }, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
    });
    const taskIdRepsonse = getTaskID.data;
    if (getTaskID.status !== 200) {
        log.error(`${taskIdRepsonse.errorId}: ${taskIdRepsonse.errorDescription ?? 'No error description'} `);
        throw new Error(`Got ${getTaskID.status} status code`);
    }
    return taskIdRepsonse.taskId;
};
exports.TwoCaptchaCreateTask = TwoCaptchaCreateTask;
const TwoCaptchaGetResult = async (taskId, clientKey) => {
    const captchaResult = await captchaClient.post('/getTaskResult', {
        clientKey,
        taskId,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const captchaResultResponse = captchaResult.data;
    return captchaResultResponse;
};
exports.TwoCaptchaGetResult = TwoCaptchaGetResult;
