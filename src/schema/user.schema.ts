import {object, string, TypeOf} from "zod";

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        password: string({
            required_error: 'Name is required'
        }).min(6, 'password to short, should be 6 chars  minimum'),
        passwordConfirmation: string({
            required_error: 'passwordConfirm is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Not valid email'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'password do not match',
        path: ['passwordConfirmation']
    }),
});

export type  CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>;