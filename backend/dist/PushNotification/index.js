"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotifcation = void 0;
const axios_1 = __importDefault(require("axios"));
const Config_1 = __importDefault(require("../Config"));
const config = (0, Config_1.default)();
const pushNotifcation = async (message) => {
    await axios_1.default.post(`${config.appSettings.pushNotifcation.baseURL}/${config.appSettings.pushNotifcation.topicName}`, message, {
        headers: {
            Authorization: `Bearer ${config.appSettings.pushNotifcation.token}`,
            Title: 'DPS Scheduler',
        },
    });
};
exports.pushNotifcation = pushNotifcation;
