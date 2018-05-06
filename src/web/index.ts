import Koa = require("koa")
import Router = require("koa-router")
import { authSession } from "../utils/userAuth"
import rndstr from "rndstr"
import { User } from "../models/users"
import bcrypt = require("bcrypt")
import { convertValidateErrorToReadableError } from "../utils/convertValidateErrorToReadableError"
import devMiddleware from "./dev"
import oauthMiddleware from "./oauth"

const router = new Router()

router.use(authSession)

router.use(async (ctx, next) => {
    if (ctx.session!.csrfToken == null) {
        ctx.session!.csrfToken = rndstr()
        ctx.session!.save()
    }
    ctx.state.csrfToken = ctx.session!.csrfToken
    await next()
})

router.get("/", async ctx => {
    ctx.render("index")
})

router.get("/login", async ctx => {
    if (ctx.session!.userId) { return ctx.redirect("/") }
    ctx.render("login")
})

router.post("/login", async ctx => {
    const { screenName, password, csrfToken } = ctx.request.body

    if (ctx.session!.csrfToken !== csrfToken) {
        ctx.render("login", {
            errors: {csrfToken: "CSRFトークンの認証に失敗しました。もう一度試してください。"},
            screenName,
        })
        return
    }

    const user = await User.findOne({screenNameLower: screenName.toLowerCase()})

    if (!user) {
        ctx.render("login", {
            errors: {screenName: "このスクリーンネームは使われていません"},
            screenName,
        })
        return
    }

    if (!await bcrypt.compare(password, user.encryptedPassword)) {
        ctx.render("login", {
            errors: {password: "パスワードが間違っています"},
            screenName,
        })
        return
    }

    ctx.session!.userId = user.id
    ctx.session!.save()

    ctx.redirect("/")
})

router.get("/register", async ctx => {
    if (ctx.session!.userId) { return ctx.redirect("/") }
    ctx.render("register")
})

router.post("/register", async ctx => {
    const body = ctx.request.body

    if (ctx.session!.csrfToken !== body.csrfToken) {
        ctx.render("register", {
            errors: {csrfToken: "CSRFトークンの認証に失敗しました。もう一度試してください。"},
            body,
        })
        return
    }

    const user = new User()
    user.name = body.name
    user.screenName = body.screenName
    if (body.password) {
        const salt = await bcrypt.genSalt(12)
        user.encryptedPassword = await bcrypt.hash(body.password, salt)
    }

    try {
        await user.save()
    } catch (error) {
        const errors = convertValidateErrorToReadableError(error)
        return ctx.render("register", {errors, body})
    }

    ctx.session!.userId = user.id
    ctx.session!.save()

    ctx.redirect("/")
})

router.get("/logout", async ctx => {
    (ctx.session as any) = null
    ctx.redirect("/")
})

router.use("/dev", devMiddleware)
router.use("/oauth", oauthMiddleware)

export default router.routes()
