import Koa = require("koa")
import { IUserModel, User } from "../models/users";

declare module "koa" {
    interface Context {
        user?: IUserModel
    }
}

export async function authSession(ctx: Koa.Context, next?: () => Promise<any>) {
    ctx.user = await User.findById(ctx.session!.user) || undefined
    return ctx.user
}

export async function authToken(ctx: Koa.Context, next?: () => Promise<any>) {
    // TODO
    ctx.user = undefined
    return ctx.user
}