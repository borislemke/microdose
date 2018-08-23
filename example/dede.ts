const pre: any = [
    {
        name: 'C'
    },
    {
        name: 'B',
        children: ['C']
    },
    {
        name: 'A',
        children: ['B']
    }
]

const test1 = [
    {
        name: 'C'
    },
    {
        name: 'B',
        children: ['C']
    },
    {
        name: 'A',
        children: ['B']
    }
]

const post = test1.map((obj) => {
    const result = recursiveChecker(obj)
    return result
})

function recursiveChecker(obj: any) {
    if (!obj.children) return obj

    const childrenMapping = obj.children.map((child: string) => {
        const rawChild = pre.find((raw: any) => {
            return raw.name === child
        })

        if (rawChild.children) return recursiveChecker(rawChild)
        else return rawChild
    })

    return {
        name: obj.name,
        children: childrenMapping
    };
}

console.log(JSON.stringify(post))