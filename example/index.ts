import { uApp } from '../src'
import { App } from './app'

const port = process.env.PORT || 3000

const config = {
  port,
  turboMode: !!process.env.TURBO
}

uApp.bootstrap(App, config)
.then(() => console.log('\nListening on port:', config.port))
.catch(err => console.error(err))
