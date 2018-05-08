interface Scope {
    name: string
    children?: Scope[]
}

export var scopeDict: {[key: string]: Scope & {parents: string[]}} = {}

function scopeNormalize(scope: Scope, parents: string[] = []) {
    if(scope.children) scope.children = scope.children.map(childScope => {
        if (childScope.name.startsWith(":")) childScope.name = scope.name + childScope.name
        return scopeNormalize(childScope, [
            scope.name,
            ...parents,
        ])
    })
    scopeDict[scope.name] = {
        ...scope,
        parents,
    }
    return scope
}

export var scope: Scope = scopeNormalize({
    name: "all",
    children: [
        {
            name: "user",
            children: [
                { name: ":read" },
                { name: ":write" },
            ]
        },
        {
            name: "post",
            children: [
                { name: ":read" },
                { name: ":write" },
            ]
        }
    ]
})

console.log(scopeDict)

function checkScope(myScopeString: string) {
    const myScope = scopeDict[myScopeString]
    return myScope.parents.includes(myScopeString)
}