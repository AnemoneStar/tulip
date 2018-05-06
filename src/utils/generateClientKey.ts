import rndstr from "rndstr"

export function generateClientKey() {
    return rndstr({
        length: 64,
        chars: "A-Za-z0-9_",
    })
}
