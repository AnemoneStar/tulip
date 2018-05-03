import mongoose = require("mongoose")
import { IUser, IUserModel } from "./users"

export interface IPost {
    text: string
    user: string | IUser

    createdAt: Date
    updatedAt: Date
}

export interface IPostModel extends IPost, mongoose.Document {
    user: string | IUserModel
}

export const PostSchema = new mongoose.Schema({
    text: { type: String, required: true, maxlength: 500 },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
}, {
    timestamps: true,
})

export const Post = mongoose.model<IPostModel>("posts", PostSchema)
