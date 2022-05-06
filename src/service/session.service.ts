import SessionModel, {SessionDocument} from "../models/session.model";
import {FilterQuery, UpdateQuery} from 'mongoose';
import {signJwt, verifyJwt} from "../utils/jwt.utils";
import {get} from "lodash";
import {findUser} from "./user.service";
import config from "config";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });

    return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return SessionModel.find(query).lean();
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return SessionModel.updateOne(query, update);
}


/**
 * function for reissue the access token
 */
export async function reIssueAccessToken({refreshToken} : {refreshToken: string}) {
    // get the decoded token
    const { decoded } = verifyJwt(refreshToken);

    console.log('decoded',decoded);
   //  console.log('decodeeed', decoded);

    // get() for get the session _id
    if (!decoded || !get(decoded, "session")) return false;

    // get session by Id
    const session = await SessionModel.findById(get(decoded, "session"));
    console.log('decoded', {session});
    // if we have session or the session have valid false
    if (!session || !session.valid) return false;

    // we need to find the user
    const user = await findUser({ _id: session.user });

    // if we d'ont have user we return false
    if (!user) return false;

    // create new access token
    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    );

    return accessToken;
}