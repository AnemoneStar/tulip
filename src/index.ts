import Koa = require("koa")
import Router = require("koa-router")
import send = require("koa-send")
import bodyParser = require("koa-bodyparser")
import mongoose = require("mongoose")
import apiMiddleware from "./api"
import path = require("path")
import koaStatic = require("koa-static")
import koaPug = require("koa-pug")
import { User } from "./models/users"
import bcrypt = require("bcrypt")
import { convertValidateErrorToReadableError } from "./utils/convertValidateErrorToReadableError"
import session = require("koa-session")

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

const router = new Router()

router.use("/api", apiMiddleware)

router.get("*", koaStatic(path.join(__dirname, "../public/")))

router.get("/", async ctx => {
    ctx.render("index")
})

router.get("/login", async ctx => {
    ctx.render("login", {
        errors: {},
    })
})

router.post("/login", async ctx => {
    const { screenName, password } = ctx.request.body
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
    ctx.render("register", {
        errors: {},
        body: {},
    })
})

router.post("/register", async ctx => {
    const body = ctx.request.body

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
    console.log("b")
    ctx.redirect("/")
    console.log("b")
})

app.use(router.routes())
app.listen(process.env.PORT || 3000)
