import {
  uApp,
  uMethods,
  uRequest,
  uResponse,
  uRouter
} from '../src'

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
