import * as http from 'http'
import { RouteStack } from './route_stack'
import { Routers } from './router'
import { RequestHandler } from './middleware'

export interface uAppConfig {
  port: number | string
  turboMode?: boolean
  server?: any
}

export class uApp {

  static TURBO_MODE = false

  static defaultRoute: RequestHandler

  static createServer (port: number | string, server: any) {
    const _server = server
    .createServer((req, res) => RouteStack.matchRequest(req, res))

    return new Promise((resolve, reject) => {
      _server.listen(port, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  static bootstrap (app, config?: uAppConfig): Promise<any> {
    const {
      port,
      server = http,
      turboMode = false
    } = config

    // Default port if not provided
    if (typeof port === 'undefined') {
      throw new Error('`config.port` is not defined.')
    }

    Routers.attach(app)

    this.TURBO_MODE = turboMode

    return this.createServer(port, server)
  }
}
