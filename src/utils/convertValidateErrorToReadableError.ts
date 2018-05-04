export function convertValidateErrorToReadableError(error: any) {
    if (error.name !== "ValidationError") {
        throw error
    }
    const errorsArr = Object.entries(error.errors).map(a => {
        var name = a[0]
        const e = a[1] as any
        var message = e.message as string
        switch (e.kind) {
            case "required":
                message = "この項目は必須です"
                break
            case "unique":
                message = "既に使用されています。他の物にしてください"
                break
            case "maxlength":
                message = "長すぎます。"
                break
            default:
                console.log(e, e.kind)
                if (error.name === "CastError") { message = "値が異常です" }
        }
        switch (name) {
            case "screenNameLower":
                name = "screenName"
                break
            case "encryptedPassword":
                name = "password"
                break
        }
        return [
            name,
            message,
        ]
    })
    return errorsArr.reduce((obj, now) => {
        obj[now[0]] = now[1]
        return obj
    }, {} as {[key: string]: string})
}
