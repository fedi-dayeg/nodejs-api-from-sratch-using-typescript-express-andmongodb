import {NextFunction, Request, Response} from "express";

/**
 * @param req
 * @param res
 * @param next
 * this handler is used for take the id with safe
 */
const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
        return res.sendStatus(403);
    }

    return next();
};

export default requireUser;