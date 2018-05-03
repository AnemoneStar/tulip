export function apiSuccess<T>(result: T) {
    return {
        ok: true,
        result,
    }
}

export function apiFailed<T extends ApiError>(errors: T[]) {
    return {
        ok: false,
        errors,
    }
}

export function apiFailedValidation(error: any, nameMapper: {[key: string]: string} = {}) {
    if (error.name != "ValidationError") {
        console.error("what!? this error is not ValidationError")
        throw error
    }
    const errors = error.errors

    return apiFailed(Object.keys(errors).map(key => {
        const error = errors[key]
        var message = errors[key].message
        switch(error.kind) {
            case "required":
                message = "required"
                break
            case "unique":
                message = "already-used"
                break
            case "maxlength":
                message = "too-long"
                break
            default:
                message = "unknown,"+message
        }
        if (error.name == "CastError") message = "invalid-type"
        console.log(error)
        var name = nameMapper[key] || key
        return {
            type: "validate",
            name,
            message,
        } as ApiErrorValidate
    }))
}

export interface ApiErrorNormal {
    type: "normal"
    message: string
}

export interface ApiErrorValidate {
    type: "validate"
    message: string
    name: string
}

export type ApiError = ApiErrorNormal | ApiErrorValidate