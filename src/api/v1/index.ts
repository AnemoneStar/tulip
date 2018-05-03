import Router = require("koa-router")
import UsersRouter from "./users"
import PostsRouter from "./posts"
import { apiSuccess, apiFailed } from "../../utils/apiResponse";

const router = new Router()

router.use(async (ctx, next) => {
    try {
        await next()
    } catch(e) {
        console.error(e)
        ctx.status = 503
        ctx.body = apiFailed([
            { type: "normal", message: "server-side-error"}
        ])
    }
})

router.get("/", async ctx => {
    console.log(ctx.status)
    ctx.body = apiSuccess({})
})

router.use("/users", UsersRouter)
router.use("/posts", PostsRouter)

router.use(ctx => {
    ctx.status = 404
    ctx.body = apiFailed([
        { type: "normal", message: "api-not-found" },
    ])
})

export default router.routes()
