"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: 'Name is required'
        }),
        password: (0, zod_1.string)({
            required_error: 'Name is required'
        }).min(6, 'password to short, should be 6 chars  minimum'),
        passwordConfirmation: (0, zod_1.string)({
            required_error: 'passwordConfirm is required'
        }),
        email: (0, zod_1.string)({
            required_error: 'Email is required'
        }).email('Not valid email'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'password do not match',
        path: ['passwordConfirmation']
    }),
});