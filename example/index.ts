import { uApp } from '../src'
import { App } from './app'

const port = process.env.PORT || 3000

const config = {
  port,
  turboMode: !!process.env.TURBO
}

uApp.defaultRoute = (req, res) => {
  res.send('This is the default 404 response.')
}

uApp.bootstrap(App, config)
.then(() => console.log('\nListening on port:', config.port))
.catch(err => console.error(err))
