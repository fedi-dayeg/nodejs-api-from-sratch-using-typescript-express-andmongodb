import {Request, Response} from "express";
import logger from "../utils/logger";
import {createUser} from "../service/user.service";
import {CreateUserInput} from "../schema/user.schema";
import {omit} from "lodash";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
        // call user service
        const user = await createUser(req.body);
        // omit for don't send the password in response
        return res.status(200).send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}