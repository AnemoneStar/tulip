import koa = require("koa")
import Router = require("koa-router")
import crypto = require("crypto")
import { Application } from "../models/apps";
import { scopeDict } from "../utils/scope";
import { AccessToken } from "../models/accessTokens";

const router = new Router()

function generateHash(ctx: koa.Context) {
    const seed = [
        ctx.session!.csrfToken,
        ctx.query.client_id,
        ctx.query.scopes,
        ctx.query.response_type,
        ctx.query.state,
        ctx.session!.userId,
    ].join(":")
    return crypto.createHash("sha512").update(seed).digest().toString("hex")
}

async function validateAuthorizeParams(ctx: koa.Context) {
    if (!["code", "token"].includes(ctx.query.response_type)) return "response_typeが不正な値です。"

    const app = await Application.findOne({
        clientId: ctx.query.client_id
    })
    if (!app) return "client_idが不正な値です。"

    if (!ctx.query.scope) return "scopeが指定されていません。一つ以上指定してください。"
    const scope = (ctx.query.scope as string).split(" ").map(scopeName => scopeDict[scopeName] || scopeName)
    if (!scope.length) return "scopeが指定されていません。一つ以上指定してください。"
    if (scope.filter(a => typeof a == "string").length) return "scopeに不正な値が含まれています: " + scope.filter(a => typeof a === "string").join(",")

    return {
        app,
        scope,
    }
}

router.get("/authorize", async ctx => {
    const res = await validateAuthorizeParams(ctx)
    if (typeof res == "string") {
        return ctx.render("oauth/error", { message: res })
    }
    const {
        app,
        scope,
    } = res

    ctx.render("oauth/authorize", {
        app,
        scopes: scope,
        hash: generateHash(ctx)
    })
})

router.post("/authorize", async ctx => {
    const res = await validateAuthorizeParams(ctx)
    if (typeof res == "string") {
        return ctx.render("oauth/error", { message: res })
    }
    
    const {
        app,
        scope,
    } = res

    if (!ctx.state.user) {
        return ctx.render("oauth/error", { message: "ログインしてください。" })
    }

    const hash = generateHash(ctx)
    if (hash !== ctx.request.body.requestHash) {
        return ctx.render("oauth/error", { message: "リクエストの検証に失敗しました。認証確認画面から再度お試しください。" })
    }

    const type = ctx.query.response_type

    if (type === "token") {
        const token = new AccessToken()
        token.scope = ctx.query.scope.split(" ")
        token.user = ctx.state!.user
        await token.save()

        var params = {
            access_token: token.token,
            token_type: "bearer",
        } as {[key: string]: string}
        if (ctx.query.state) {
            params.state = ctx.query.state
        }
        ctx.redirect("http://localhost:3001/oauth/end#"+Object.entries(params).map(a => {
            return a.map(b => encodeURIComponent(b)).join("=")
        }).join("&"))
        return
    }

    return ctx.render("oauth/error", { message: "このresponse_typeは実装中です。"})
})

export default router.routes()