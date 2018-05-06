import Router = require("koa-router")
import { Application } from "../models/apps"
import { convertValidateErrorToReadableError } from "../utils/convertValidateErrorToReadableError"

const router = new Router()

router.get("/", async ctx => {
    ctx.render("dev")
})

router.get("/apps", async ctx => {
    const apps = await Application.find({
        ownerUser: ctx.state.user.id,
    })
    ctx.render("dev/apps", {
        apps,
    })
})

router.get("/apps/new", async ctx => {
    ctx.render("dev/apps/new")
})

router.post("/apps/new", async ctx => {
    const { body } = ctx.request
    const {
        csrfToken,
        name,
        description,
        website,
        redirectUris,
    } = body

    if (ctx.session!.csrfToken !== csrfToken) {
        return ctx.render("dev/apps/new", {
            errors: {
                csrfToken: "CSRFトークンの認証に失敗しました。もう一度試してください。",
            },
            body,
        })
    }

    const app = new Application({
        name,
        description,
        website,
        redirectUris: redirectUris.split("\n"),
        ownerUser: ctx.state.user.id,
    })

    try {
        await app.save()
    } catch (error) {
        const errors = convertValidateErrorToReadableError(error)
        return ctx.render("dev/apps/new", {
            errors,
            body,
        })
    }

    ctx.redirect("/dev/apps")
})

router.get("/apps/:id", async ctx => {
    console.log(ctx.params)
    const app = await Application.findById(ctx.params.id)
    if (!app) { return }

    ctx.render("dev/apps/show", {
        app,
    })
})

export default router.routes()
