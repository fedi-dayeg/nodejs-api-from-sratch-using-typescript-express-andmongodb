import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from "config";
import {UserDocument} from "./user.model";

// interface for user document
export interface SessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    valid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}


// define validation for the session schema
const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        valid: { type: Boolean, default: true },
        userAgent: { type: String },
    },
    {
        timestamps: true,
    }
);

// create mongoose model
const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;