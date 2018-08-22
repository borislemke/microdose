# microdose vs other frameworks, the battle is on

Benchmarked with `autocannon`:
- Run on a MacBook Pro (Retina, 13-inch, early 2015), 2,9 GHz Intel Core i5, 8 GB 1867 MHz DDR3, macOS 10.13.6

```sh
$ autocannon -p 10 -c 1000 -d 30 http://localhost:3000
```

## microdose
```typescript
import {
  uApp,
  uMethods,
  uRequest,
  uResponse,
  uRouter
} from 'microdose'

@uRouter()
class App {

  @uMethods.get()
  helloWorld (req: uRequest, res: uResponse) {
    res.send('Hello world!')
  }
}

const config = {
  port: 3000,
  turboMode: false
}

uApp.bootstrap(App, config)
.then(() => console.log('\nListening on port:', config.port))
```

## microdose with TurboMode
Same as above but `turboMode` is set to `true`.
```typescript
const config = {
  port: 3000,
  turboMode: true
}
```

## Pure Node.js
```typescript
const http = require('http')

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'plain/text; charset=utf-8'})
    res.end('Hello World')
}).listen(3000)
```

## koa.js
```typescript
const Koa = require('koa')
const app = new Koa()

app.use(ctx => ctx.body = 'Hello World')

app.listen(3000)
```

## express
```typescript
const app = require('express')()

app.get('/', (req, res) => res.send('Hello world'))

app.listen(3000)
```

## restify
```typescript
const restify = require('restify')

const server = restify.createServer()

server.get('/', (req, res) => res.send('Hello World'))

server.listen(3000)
```


Benchmark results:

| Framework        | Req/Sec   | Transfer/Sec(MB) | Avg. Latency(ms) | Max. Latency(ms) | Errors |
| ---------------- | --------: | ---------------: | ---------------: | ---------------: | -----: |
| Node.js          | 22,974.80 | 3.92             | 43.08            | 2,724.17         | 54     |
| microdose(Turbo) | 22,398.47 | 3.42             | 44.39            | 5,563.25         | 7      |
| microdose        | 19,068.87 | 2.92             | 52.07            | 3,904.16         | 4      |
| koa              | 17,660.2  | 2.69             | 56.19            | 4,202.71         | 2      |
| restify          | 14,023.64 | 2.29             | 70.98            | 2,772.03         | 8      |
| express          | 11,899.44 | 2.55             | 83.07            | 9,994.24         | 2      |
