import { uMethods, uRequest, uResponse, uRouter } from '../src'
import * as bodyParser from 'body-parser'
import { UsersRoute } from './users'

@uRouter({
  children: [UsersRoute],
  middleware: [
    bodyParser.json()
  ]
})
export class App {

  @uMethods.get()
  helloWorld (req: uRequest, res: uResponse) {
    res.send('Hello world!')
  }
}
