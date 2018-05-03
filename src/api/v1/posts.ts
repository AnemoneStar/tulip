import Router = require("koa-router")
import { apiSuccess, apiFailed, apiFailedValidation } from "../../utils/apiResponse"
import getAuthUser from "../../utils/getAuthUser"
import { Post } from "../../models/posts"

const router = new Router()

router.get("/", async ctx => {
    ctx.body = apiSuccess(await Post.find())
})

router.post("/", async ctx => {
    // TODO: ちゃんとヘッダーを見て認証しているユーザーを取得する
    const authUser = await getAuthUser(ctx)
    if (!authUser) {
        return
    }

    const post = new Post()

    post.text = ctx.request.body.text
    post.user = authUser

    try {
        await post.validate()
    } catch (e) {
        ctx.status = 400
        ctx.body = apiFailedValidation(e)
    }
    await post.save()

    ctx.body = apiSuccess(post)
})

export default router.routes()
