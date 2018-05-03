import Router = require("koa-router")
import { apiSuccess, apiFailed, ApiErrorValidate, apiFailedValidation } from "../../utils/apiResponse";
import bcrypt = require("bcrypt")
import $ from "cafy"
import { ValidationError } from "mongoose";
import { User } from "../../models/users";
import mongoose = require("mongoose")

const router = new Router

router.get("/", async ctx => {
    ctx.body = apiSuccess(await User.find())
})

router.get("/:userId", async ctx => {
    const [userId, userIdErr] = $(ctx.params.userId).string().pipe(mongoose.Types.ObjectId.isValid).$

    if (userIdErr) {
        ctx.status = 400
        ctx.body = apiFailed([{
            type: "validate",
            name: ":userId",
            message: "format-invalid",
        }])
        return
    }

    const user = await User.findById(userId)
    if (!user) {
        ctx.status = 404
        ctx.body = apiFailed([{
            type: "normal",
            message: "user-not-found",
        }])
        return
    }

    ctx.body = apiSuccess(user)
})

export default router.routes()