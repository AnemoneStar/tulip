import mongoose = require("mongoose")
import { IUserModel, IUser } from "./users";

export interface IClient {
    name: string
    ownerUser?: string | IUser
}

export interface IClientModel extends IClient, mongoose.Document {
    clientId: string
    clientSecret: string

    ownerUser?: string | IUserModel
}
