import rndstr from "rndstr"
import crypto = require("crypto")

export function generateClientKey() {
    return rndstr({
        length: 64,
        chars: "A-Za-z0-9_",
    })
}

export function generateAccessToken() {
    const rnd = rndstr({
        length: 64,
        chars: "A-Za-z0-9_",
    })
    const rnd2 = rndstr({
        length: 64,
        chars: "A-Za-z0-9_",
    })
    const time = Date.now().toString()
    return rnd + crypto.createHash("sha256").update(rnd2+time).digest().toString("hex")
}