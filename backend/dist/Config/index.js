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
const fs_1 = require("fs");
const yaml_1 = __importDefault(require("yaml"));
const Config_1 = require("../Interfaces/Config");
const preferredDay_1 = __importDefault(require("../Assets/preferredDay"));
const log = __importStar(require("../Log"));
require("dotenv/config");
const dayjs_1 = __importDefault(require("dayjs"));
const parseConfig = () => {
    if (!(0, fs_1.existsSync)('./config.yml')) {
        log.error('Not found config.yml file');
        process.exit(0);
    }
    const file = (0, fs_1.readFileSync)('././config.yml', 'utf8');
    let configData = yaml_1.default.parse(file);
    configData = parsePersonalInfo(configData);
    configData.location.preferredDays = parsePreferredDays(configData.location.preferredDays);
    configData.personalInfo.phoneNumber = parsePhoneNumber(configData.personalInfo.phoneNumber);
    let startDate = (0, dayjs_1.default)(configData.location.daysAround.startDate);
    if (!configData.location.daysAround.startDate || !startDate.isValid() || startDate.isBefore((0, dayjs_1.default)())) {
        log.dev('Invalid date in config.yml, using current date');
        startDate = (0, dayjs_1.default)();
    }
    configData.location.daysAround.startDate = startDate.format('MM/DD/YYYY');
    try {
        return Config_1.configZod.parse(configData);
    }
    catch (e) {
        log.error('Config file is not valid');
        console.error(e);
        process.exit(1);
    }
};
exports.default = parseConfig;
function parsePhoneNumber(phoneNumber) {
    if (!phoneNumber)
        return null;
    // Phone format is ########## and we want to convert it to (###) ###-####
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}
function parsePreferredDays(preferredDay) {
    const convertedPreferredDay = preferredDay.map(day => preferredDay_1.default[day.toLowerCase()]).filter(e => e);
    return convertedPreferredDay;
}
function parsePersonalInfo(configData) {
    if (!configData.personalInfo.loadFromEnv)
        return configData;
    log.info('Loading personal info from environment variables.');
    const { FIRSTNAME, LASTNAME, DOB, EMAIL, LASTFOURSSN, PHONENUMBER, CARDNUMBER } = process.env;
    if (!FIRSTNAME || !LASTNAME || !DOB || !EMAIL || !LASTFOURSSN) {
        log.error('Missing environment variables for personal info. Please refer to example.env file.');
        process.exit(1);
    }
    configData.personalInfo.firstName = FIRSTNAME;
    configData.personalInfo.lastName = LASTNAME;
    configData.personalInfo.dob = DOB;
    configData.personalInfo.email = EMAIL;
    configData.personalInfo.lastFourSSN = LASTFOURSSN;
    configData.personalInfo.phoneNumber = PHONENUMBER;
    configData.personalInfo.cardNumber = CARDNUMBER;
    return configData;
}
