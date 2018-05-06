import Router = require("koa-router")
import { Application } from "../models/apps";

const router = new Router()

router.get("/authorize", async ctx => {
    const app = await Application.findOne({
        clientId: ctx.query.client_id
    })
    if (!app) return ctx.render("oauth/error", { message: "client_idが不正な値です。" })

    ctx.render("oauth/authorize", {
        app
    })
})

export default router.routes()