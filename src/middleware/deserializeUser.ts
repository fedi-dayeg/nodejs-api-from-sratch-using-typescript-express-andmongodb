import {NextFunction, Request, Response} from "express";
import {get} from "lodash";
import {verifyJwt} from "../utils/jwt.utils";
import {reIssueAccessToken} from "../service/session.service";

/**
 * @param req
 * @param res
 * @param next
 * This middleware is for get the id from token
 */
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {

    // we need to get token from autorotation
    // remove Bearer from token
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );

    // get the refresh token from headers
    const refreshToken = get(req, "headers.x-refresh");


    if (!accessToken) {
        return next();
    }

    const { decoded, expired } = verifyJwt(accessToken);



    // if the user have token then we return next
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    //if the token has expired or refresh token
    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });

        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
        }

        const result = verifyJwt(newAccessToken as string);

        res.locals.user = result.decoded;
        return next();
    }

    return next();
};

export default deserializeUser;