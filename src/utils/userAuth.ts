import Koa = require("koa")
import { IUserModel, User } from "../models/users"

declare module "koa" {
    interface Context {
        state: any | {
            user?: IUserModel,
        }
    }
}

export async function authSession(ctx: Koa.Context, next?: () => Promise<any>) {
    console.log(ctx.session!.userId)
    ctx.state.user = (await User.findById(ctx.session!.userId)) || undefined
    console.log(ctx.state.user)
    if (next) { await next() }
    return ctx.state.user as (IUserModel | undefined)
}

export async function authToken(ctx: Koa.Context, next?: () => Promise<any>) {
    // TODO
    ctx.state.user = undefined
    if (next) { await next() }
    return ctx.user as (IUserModel | undefined)
}
