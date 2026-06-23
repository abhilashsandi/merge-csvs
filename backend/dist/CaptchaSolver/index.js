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
exports.GetCaptchaSolverResult = exports.CreateCaptchaSolverTask = void 0;
const Capsolver = __importStar(require("./Capsolver"));
// 2captcha isn't stable
// import * as TwoCaptcha from './2Captcha';
const log = __importStar(require("../Log"));
const Config_1 = __importDefault(require("../Config"));
const config = (0, Config_1.default)();
const CreateCaptchaSolverTask = () => {
    switch (config.appSettings.captcha?.solverOptions?.solverService) {
        case 'capsolver':
            return Capsolver.CapSolverCreateTask(config.appSettings.captcha.solverOptions.solverApiToken);
        // case '2captcha':
        //     return TwoCaptcha.TwoCaptchaCreateTask(config.appSettings.captcha!.solverOptions!.solverApiToken!);
        default:
            log.error('Unknown captcha solver service');
            throw new Error('Unknown captcha solver service');
    }
};
exports.CreateCaptchaSolverTask = CreateCaptchaSolverTask;
const GetCaptchaSolverResult = (taskId) => {
    switch (config.appSettings.captcha?.solverOptions?.solverService) {
        case 'capsolver':
            return Capsolver.CapSolverGetResult(taskId, config.appSettings.captcha.solverOptions.solverApiToken);
        // case '2captcha':
        //     return TwoCaptcha.TwoCaptchaGetResult(taskId, config.appSettings.captcha!.solverOptions!.solverApiToken!);
        default:
            log.error('Unknown captcha solver service');
            throw new Error('Unknown captcha solver service');
    }
};
exports.GetCaptchaSolverResult = GetCaptchaSolverResult;
