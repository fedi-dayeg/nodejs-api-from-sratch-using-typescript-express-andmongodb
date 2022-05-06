import config from "config";
import {Request, Response} from "express";
import {validatePassword} from "../service/user.service";
import {createSession, findSessions, updateSession} from "../service/session.service";
import {signJwt} from "../utils/jwt.utils";
import logger from "../utils/logger";

export async function createUserSessionHandler(req: Request, res: Response) {

    // validate the user password
    const user = await validatePassword(req.body);

    if (!user) {
        return res.status(401).send("Invalid email or password");
    }

    // create session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // create access token
    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    );



    // create a refresh token

    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
    );

    // console.log('refreshToken', accessToken);
    logger.info('New user have been created');
    // return access and refresh token
    return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
    // get the user _id
    const userId = res.locals.user._id;

    // call findSession query  from session service
    const sessions = await findSessions({ user: userId, valid: true });

    // send session response
    return res.send(sessions);

}

export async function deleteSessionHandler(req: Request, res: Response) {
    // Get the session ID
    const sessionId = res.locals.user.session

    // execute query from service
    await updateSession({_id: sessionId}, {valid: false});

    // send response
    return res.status(200).send({
        accessToken: null,
        refreshToken: null
    });
}