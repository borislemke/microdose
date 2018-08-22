import {
  uApp,
  uMethod,
  uRequest,
  uResponse,
  uRouter
} from '../src'

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
.catch(err => console.error(err))
