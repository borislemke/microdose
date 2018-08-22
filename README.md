# microdose
A feather-light JavaScript API framework for Node, written 100% in TypeScript, built for micro-services. `microdose` is microdosing for servers.

[![codebeat badge](https://codebeat.co/badges/7dc9fafc-ccbc-4204-8390-82393527a667)](https://codebeat.co/projects/github-com-borislemke-microdose-master)
[![npm version](https://badge.fury.io/js/microdose.svg)](https://badge.fury.io/js/microdose)

This package is production ready.

## Documentation
Documentation can be found on `microdose`'s [GitBooks](https://borislemke.gitbooks.io/microdose/content/)

## Hello World
*src/server.ts*
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
