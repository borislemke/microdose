import * as http from 'http'
import { RouteStack } from './route_stack'

import { PartyRouterStack } from './router'

export interface BootstrapConfig {
  port: number | string
  turboMode?: boolean
  server?: any
}

export class uApp {

  static TURBO_MODE = false

  static bootstrap (app, config?: BootstrapConfig): Promise<any> {
    // Default port if not provided
    if (typeof config.port === 'undefined') {
      throw new Error('`config.port` is not defined.')
    }

    // Default server if not provided
    config.server = config.server || http

    if (config.turboMode) {

      /**
       * Checks if the developer is attempting to use path patterns
       * despite enabling Turbo Mode.
       */
      PartyRouterStack.forEach(_stack => {
        const conflictingPathUse = _stack.routerStack
        .find(_childStack => _childStack.path)

        const conflictingPath = conflictingPathUse.path

        if (conflictingPathUse) {
          console.warn('\nWARNING: Handler with path pattern '
            + conflictingPath + ' will be ignored in Turbo Mode.')
        }
      })

      uApp.TURBO_MODE = true
    }

    const topRoutes = PartyRouterStack
    .find(_stack => _stack.routerName === app.name)

    if (!topRoutes) {
      console.warn('\nWARNING: No root handlers found. If you intended'
        + ' not to add any RouterStack items to the main Router, ignore'
        + ' this message.')
    } else {
      RouteStack.addStack(...topRoutes.routerStack)
    }

    const server = config.server
    .createServer((req, res) => RouteStack.matchRequest(req, res))

    return new Promise((resolve, reject) => {
      server.listen(config.port, (err) => {

        if (err) {
          reject(err)
        }

        if (process.env.NODE_ENV === 'development') {
          if (config.turboMode) {
            console.warn(
              '\nWARNING: Turbo Mode is enabled. Path matching is'
              + ' disabled and request will only match request methods.'
            )
          }
        }

        resolve()
      })
    })
  }
}
