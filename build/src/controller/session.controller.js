"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionHandler = exports.getUserSessionHandler = exports.createUserSessionHandler = void 0;
const config_1 = __importDefault(require("config"));
const user_service_1 = require("../service/user.service");
const session_service_1 = require("../service/session.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const logger_1 = __importDefault(require("../utils/logger"));
function createUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate the user password
        const user = yield (0, user_service_1.validatePassword)(req.body);
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        // create session
        const session = yield (0, session_service_1.createSession)(user._id, req.get("user-agent") || "");
        // create access token
        const accessToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") } // 15 minutes
        );
        // create a refresh token
        const refreshToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("refreshTokenTtl") } // 15 minutes
        );
        // console.log('refreshToken', accessToken);
        logger_1.default.info('New user have been created');
        // return access and refresh token
        return res.send({ accessToken, refreshToken });
    });
}
exports.createUserSessionHandler = createUserSessionHandler;
function getUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // get the user _id
        const userId = res.locals.user._id;
        // call findSession query  from session service
        const sessions = yield (0, session_service_1.findSessions)({ user: userId, valid: true });
        // send session response
        return res.send(sessions);
    });
}
exports.getUserSessionHandler = getUserSessionHandler;
function deleteSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the session ID
        const sessionId = res.locals.user.session;
        // execute query from service
        yield (0, session_service_1.updateSession)({ _id: sessionId }, { valid: false });
        // send response
        return res.status(200).send({
            accessToken: null,
            refreshToken: null
        });
    });
}
exports.deleteSessionHandler = deleteSessionHandler;
