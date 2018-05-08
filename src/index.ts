import Koa = require("koa")
import Router = require("koa-router")
import send = require("koa-send")
import bodyParser = require("koa-bodyparser")
import koaStatic = require("koa-static")
import koaPug = require("koa-pug")
import session = require("koa-session")
import mongoose = require("mongoose")
import path = require("path")
import apiMiddleware from "./api"
import webMiddleware from "./web"

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/tulip_dev")

const app = new Koa()

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        ctx.status = 500
        ctx.body = "<h1>500 Internal Server Error</h1>sry..."
        console.error(e)
    }
})

app.use(bodyParser())
app.use(session({
    maxAge: 1000 * 60 * 60 * 24 * 30,
}, app))
app.keys = ["shibuyarin"]

const pug = new koaPug({
    viewPath: path.join(__dirname, "..", "views"),
    noCache: true,
})
pug.use(app as any)

app.use(async (ctx, next) => {
    if (ctx.query.next && !(ctx.query.next as string).startsWith("/")) {
        ctx.status = 400
        ctx.body = "invalid next query"
        return
    }
    await next()
})

app.use(async (ctx, next) => {
    ctx.state.errors = {}
    ctx.state.body = {}
    ctx.state.url = ctx.url
    await next()
})

const router = new Router()

router.use("/api", apiMiddleware)

router.get("*", koaStatic(path.join(__dirname, "../public/")))

router.use(webMiddleware)

app.use(router.routes())
app.listen(process.env.PORT || 3000)
