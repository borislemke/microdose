**router tree**
```
[
    {
        party: 'MainRouter',
        routes: [{
            route: '/',
            handler: Function
        }],
        children: [
            {
                party: 'ChildRouter',
                routes: [{
                    route: '/party',
                    handler: Function
                }],
                children: [
                    {
                        party: 'GrandChildRoute',
                        routes: [{
                            route: '/party/grand',
                            handler: Function
                        }, {
                            route: '/party/grand/:guestId',
                            handler: Function
                        }]
                    }
                ]
            }
        ]
    }
]
```

**routes stack**
```
[
    {
        method: 'GET',
        route: '/',
        handler: Function
    },
    {
        method: 'GET',
        route: '/party',
        handler: Function
    },
    {
        method: 'GET',
        route: '/party/grand',
        handler: Function
    },
    {
        method: 'POST',
        route: '/party/grand/:guestId',
        handler: Function
    }
]
```

**routes index**
Grouping by request method allows for faster indexing as we can match the request method earlier.
```
{
    GET: [
        {
            route: '/',
            handler: Function
        },
        {
            route: '/party',
            handler: Function
        },
        {
            route: '/party/grand',
            handler: Function
        }
    ],
    POST: [
        {
            route: '/party/grand/:guestId',
            handler: Function
        }
    ]
}
```

**Node module matcher**
```
// JS routes hash map
const routeHashMap = {
    "someHashOfFunction": "/path/:match"
}

// Imaginary node binding
const matchHashMap = require('native-path-to-regexp')

const matchHandler = matchHashMap(req.url) // should return 'get_hashOfFunction' for req.url = '/path/john'

// Execute handler
RoutesIndex[req.method][matchHandler](req, res)
```
