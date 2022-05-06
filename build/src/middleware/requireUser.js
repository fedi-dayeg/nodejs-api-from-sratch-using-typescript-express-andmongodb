"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param req
 * @param res
 * @param next
 * this handler is used for take the id with safe
 */
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        return res.sendStatus(403);
    }
    return next();
};
exports.default = requireUser;
