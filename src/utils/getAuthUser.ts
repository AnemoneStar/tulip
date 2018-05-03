import Koa = require("koa")
import { apiFailed } from "./apiResponse"
import { User } from "../models/users"

export default async function getAuthUser(ctx: Koa.Context, required: boolean = true) {
    const user = await User.findOne()
    if (!user && required) {
        ctx.status = 403
        ctx.body = apiFailed([{
            type: "normal",
            message: "auth-failed",
        }])
    }
    return user
}
