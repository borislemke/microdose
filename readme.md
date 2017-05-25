# microdose
A feather-light JavaScript API framework for Node, written 100% in TypeScript, built for micro-services. `microdose` is microdosing for servers.

This project is in it's early design stages. Things will break and the syntax is changing rapidly. Contributions to the project is highly encouraged and appreciated.

## Documentation
Documentation can be found on `microdose`'s [GitBooks](https://borislemke.gitbooks.io/microdose/content/)

## Hello World
*src/server.ts*
```javascript
import {
    MicroBootstrap,
    MicroRouter,
    MicroMethod,
    MicroRequest,
    MicroResponse
} from 'microdose'

@MicroRouter()
class MyRouter {

    @MicroMethod.Get()
    helloWorld(req: MicroRequest, res: MicroResponse): void {
        res.send('Hello World')
    }
}

MicroBootstrap(MyRouter, 3000)
```

## Features
- Leverages TypeScript decorators for a concise, intuitive application design

## microdose vs other frameworks, the battle is on

All benchmarked with `autocannon` with the following parameters:
```
$ autocannon -p 10 -c 1000 -d 30 http://localhost:3000
```

### microdose

```
import {
    MicroBootstrap,
    MicroRouter,
    MicroResponse,
    MicroRequest,
    MicroMethod
} from 'microdose'

@MicroRouter()
export class MicroApp {

    @MicroMethod.Get()
    sayHello(req: MicroRequest, res: MicroResponse): void {
        res.send('Hello world')
    }
}

MicroBootstrap(MicroApp)
```
### microdose with uWebSocket(**Highly Experimental**)
```
...same as above except for the BootstrapConfig param

MicroBootstrap(MicroApp, {useSocket: true})
```

### Pure Node.js
```
const http = require('http')

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'plain/text; charset=utf-8'})
    res.end('Hello World')
}).listen(3000)
```
### koa.js
```
const Koa = require('koa')
const app = new Koa()

app.use(ctx => ctx.body = 'Hello World')

app.listen(3000)
```
### express
```
const app = require('express')()

app.get('/', (req, res) => res.send('Hello world'))

app.listen(3000)
```
### restify
```
const restify = require('restify')

const server = restify.createServer()

server.get('/', (req, res) => res.send('Hello World'))

server.listen(3000)
```


Benchmark results:

| Framework     | Req/Sec   | Transfer/Sec(MB) | Avg. Latency(ms) | Max. Latency(ms) | Errors |
| ------------- | --------: | ---------------: | ---------------: | ---------------: | -----: |
| microdose+uWS  | 25,229.34 | 1.25             | 51.82            | 1,934            | 0      |
| Node.js       | 12,195.20 | 1.88             | 81.43            | 3,299            | 40     |
| microdose      | 7,529.40  | 1.29             | 130.74           | 3,378            | 0      |
| koa           | 6,933.47  | 1.05             | 141.23           | 5,776            | 0      |
| express       | 5,512.54  | 1.19             | 176.45           | 7,783            | 12     |
| restify       | 3,470.2   | 0.503            | 272.28           | 9,549            | 0     |

As you can see `microdose` tops the chart amongst other popular Node frameworks, `microdose+uWS` is even faster than pure Node.js(**double!**) but there are some challenges before we can make it reliable in production. `microdose+uWS` is deemed to stall as the developers of `uWebSocket` have no interest in further developing the `uws.http` module. See this issue: [Cash for Code](https://github.com/uNetworking/uWebSockets/issues/590#issuecomment-299608041)

`microdose` currently uses the `pillarjs/path-to-regexp` module to compile routes and match them with the corresponding handler on each incoming request. We imagine that we would be able to offload that task to a native Node module(in C++) to gain even more performance boost.

## Installation
```
$ npm install microdose
```

## Playground

Clone the repo from `https://github.com/borislemke/microdose`.

Install dependencies
```
npm install
```

Run the example
```
npm start
```

Visit `http://localhost:3000` to see `Hello World`.

## Future
- Offload path mapping to native Node module
- Replace `path-to-regexp` with simpler custom alternative
