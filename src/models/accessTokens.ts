import mongoose = require("mongoose")
import { IApplicationModel } from "./apps";
import { IUserModel } from "./users";
import { generateAccessToken } from "../utils/generateKey";

export interface IAccessToken {
    scope: string[]
}

export interface IAccessTokenModel extends IAccessToken, mongoose.Document {
    token: string

    app: string | IApplicationModel
    user: string | IUserModel
}

export const AccessTokenSchema = new mongoose.Schema({
    scope: [String],
    
    token: { type: String, default: generateAccessToken },
    app: { type: mongoose.Schema.Types.ObjectId, ref: "applications" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
})

export const AccessToken = mongoose.model<IAccessTokenModel>("access_tokens", AccessTokenSchema)