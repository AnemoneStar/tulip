import mongoose = require("mongoose")
import uniqueValidator = require("mongoose-unique-validator")
import validateRegex from "../utils/validateRegex"

export interface IUser {
    name: string
    screenName: string

    // counts
    postsCount: number

    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends IUser, mongoose.Document {
    screenNameLower: string
    encryptedPassword: string
}

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 },
    screenName: {type: String, required: true, maxlength: 20, match: validateRegex.users.screenName },
    screenNameLower: {type: String, required: true, lowercase: true, unique: true },
    encryptedPassword: {type: String, required: true},

    // counts
    postsCount: { type: Number, required: true, default: 0 },
}, {
    timestamps: true,
})

UserSchema.pre<mongoose.Document & IUserModel>("validate", function(next) {
    if (this.screenName) {
        this.screenNameLower = this.screenName.toLowerCase()
    }
    next()
})

UserSchema.plugin(uniqueValidator)

export const User = mongoose.model<IUserModel>("users", UserSchema)
