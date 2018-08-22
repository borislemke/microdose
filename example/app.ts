import { uMethods, uRequest, uResponse, uRouter } from '../src'
import { UsersRoute } from './users'
import * as bodyParser from 'body-parser'
import { uMiddleware } from '../src/middleware'

const middlewareTest = (req: uRequest, res: uResponse, next) => {
  console.log('middlewareTest')
  if (!req.headers.authorization) {
    return void res.status(401).send('Auth missing')
  }
  next()
}

const boyMiddleware = (req: uRequest, res: uResponse, next) => {
  console.log('boyMiddleware')
  if (!req.headers.boy) {
    return void res.status(401).send('Boy missing')
  }
  next()
}

@uRouter({
  children: [UsersRoute],
  middleware: [
    bodyParser.json()
  ]
})
export class App {

  @uMethods.get()
  helloWow (req: uRequest, res: uResponse) {
    res.send('Hello wow!')
  }

  @uMethods.post()
  @uMiddleware(middlewareTest, boyMiddleware)
  addHello (req: uRequest, res: uResponse) {
    console.log('req.body', req.body)
    res.send(req.body)
  }

  @uMethods.put()
  putToTheTest (req: uRequest, res: uResponse) {
    console.log('put')
    res.send(req.body.putty)
  }

  @uMethods.patch()
  eyePath (req: uRequest, res: uResponse) {
    console.log('patch')
    res.send(req.body.patch_name)
  }

  @uMethods.delete()
  forgetMeNot (req: uRequest, res: uResponse) {
    res.send('Deleted!')
  }
}
