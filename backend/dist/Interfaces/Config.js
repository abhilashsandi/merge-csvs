"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configZod = void 0;
const zod_1 = require("zod");
const checkStartLowerThanEnd = (data) => data.start < data.end;
const configZod = zod_1.z.object({
    personalInfo: zod_1.z.object({
        loadFromEnv: zod_1.z.boolean().default(false),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        dob: zod_1.z.string(),
        email: zod_1.z.string(),
        lastFourSSN: zod_1.z.string(),
        phoneNumber: zod_1.z.string().optional().nullable(),
        typeId: zod_1.z.number().optional(),
        cardNumber: zod_1.z.string().optional(),
    }),
    location: zod_1.z.object({
        cityName: zod_1.z.string().array().optional(),
        zipCode: zod_1.z.string().array().optional(),
        pickDPSLocation: zod_1.z.boolean().default(false),
        miles: zod_1.z.number(),
        preferredDays: zod_1.z.number().array(),
        sameDay: zod_1.z.boolean(),
        daysAround: zod_1.z
            .object({
            startDate: zod_1.z.string(),
            start: zod_1.z.number(),
            end: zod_1.z.number(),
        })
            .refine(checkStartLowerThanEnd, { message: 'Start number must be lower than end number' }),
        timesAround: zod_1.z
            .object({
            start: zod_1.z.number(),
            end: zod_1.z.number(),
        })
            .refine(checkStartLowerThanEnd, { message: 'Start number must be lower than end number' }),
    }),
    appSettings: zod_1.z.object({
        cancelIfExist: zod_1.z.boolean().default(false),
        interval: zod_1.z.number().default(5000),
        webserver: zod_1.z.boolean().default(false),
        headersTimeout: zod_1.z.number().default(20000),
        maxRetry: zod_1.z.number().default(3),
        captcha: zod_1.z
            .object({
            strategy: zod_1.z.enum(['browser', 'solver', 'manual']).default('browser'),
            solverOptions: zod_1.z
                .object({
                solverService: zod_1.z.enum(['2captcha', 'capsolver']).optional(),
                solverApiToken: zod_1.z.string().optional(),
            })
                .optional()
                .nullable(),
        })
            .optional()
            .nullable()
            .refine(data => {
            if (data?.strategy === 'browser' || data?.strategy === 'manual')
                return true;
            return (typeof data?.solverOptions?.solverService === 'string' &&
                typeof data?.solverOptions?.solverApiToken === 'string' &&
                data?.solverOptions?.solverApiToken.length > 0);
        }, {
            message: 'If you want to use solver, please provide all required fields',
        }),
        pushNotifcation: zod_1.z
            .object({
            enabled: zod_1.z.boolean().default(false),
            baseURL: zod_1.z.string().optional(),
            topicName: zod_1.z.string().optional(),
            token: zod_1.z.string().optional(),
        })
            .refine(data => {
            if (!data.enabled)
                return true;
            return typeof data.baseURL === 'string' && typeof data.topicName === 'string' && typeof data.token === 'string';
        }, {
            message: 'If you want to enable push notification, please provide all required fields',
        }),
    }),
});
exports.configZod = configZod;
