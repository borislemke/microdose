# microdose
A feather-light JavaScript API framework for Node, written in TypeScript, built for micro-services.
This is the fastest Node.js framework on this planet. See the benchmark results [here](https://github.com/borislemke/microdose/blob/master/BENCHMARK.md)

[![codebeat badge](https://codebeat.co/badges/7dc9fafc-ccbc-4204-8390-82393527a667)](https://codebeat.co/projects/github-com-borislemke-microdose-master)
[![npm version](https://badge.fury.io/js/microdose.svg)](https://badge.fury.io/js/microdose)

## Documentation
Documentation can be found on [here](https://borislemke.gitbooks.io/microdose/content/).

## Hello World
*src/server.ts*
```typescript
import {
  uApp,
  uMethod,
  uRequest,
  uResponse,
  uRouter
} from 'microdose'

@uRouter()
class App {

  @uMethod.get()
  helloWorld (req: uRequest, res: uResponse) {
    res.send('Hello world!')
  }
}

const config = {
  port: 3000
}

uApp.bootstrap(App, config)
.then(() => console.log('\nListening on port:', config.port))
```

## Features
- Leverages TypeScript decorators for a concise, intuitive application design
- Can be used with standard `express.js` plugins

## Installation
```sh
$ npm install microdose
```

## Playground
Clone the repo from `https://github.com/borislemke/microdose`.

Install dependencies
```sh
$ npm install
```

Run the example
```sh
$ npm start
```

Visit `http://localhost:3000` to see `Hello World`.

## Future
 - [ ] Replace `path-to-regexp` with simpler custom alternative
 - [ ] Support URL queries (easy)

## Issues
Wildcard does not work on root router:
```typescript
@uRouter({
  children: [UsersRoute],
  middleware: [
    bodyParser.json()
  ]
})
export class App {

  @uMethod.get()
  helloWorld (req: uRequest, res: uResponse) {
    res.send('Hello world!')
  }

  @uMethod.get('/*')
  notFound (req: uRequest, res: uResponse) {
    res.send('Any are you okay?')
  }
}
```
Visiting `host:port/` will always return the `/*` handler first.
