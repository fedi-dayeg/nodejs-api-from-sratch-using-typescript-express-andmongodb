"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = require("pino");
const dayjs_1 = __importDefault(require("dayjs"));
const transport = pino_1.pino.transport({
    target: 'pino-pretty',
    options: { colorize: true }
});
const log = (0, pino_1.pino)({
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${(0, dayjs_1.default)().format()}"`
}, transport);
exports.default = log;
