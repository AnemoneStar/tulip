import mongoose = require("mongoose")
import { IUserModel, IUser } from "./users"
import { generateClientKey } from "../utils/generateKey"

export interface IApplication {
    name: string
    ownerUser?: string | IUser
    website?: string
}

export interface IApplicationModel extends IApplication, mongoose.Document {
    ownerUser?: string | IUserModel

    clientId: string
    clientSecret: string
    redirectUris: string[]
}

export const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 20 },
    description: { type: String, required: true, maxlength: 200 },
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    website: { type: String, maxlength: 256 },

    clientId: { type: String, required: true, default: generateClientKey },
    clientSecret: { type: String, required: true, default: generateClientKey },
    redirectUris: [ { type: String, maxlength: 256 } ],
})

export const Application = mongoose.model<IApplicationModel>("applications", ApplicationSchema)
