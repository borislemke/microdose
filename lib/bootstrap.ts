import * as http from 'http'
import {RouteStack} from './route_stack'

import {microCredits} from './utils/credits'
import {PartyRouterStack} from './router'

export interface BootstrapConfig {
    port?: number
    turboMode?: boolean
    server?: any
}

export const MicroBootstrap = (serverApp, config?: BootstrapConfig | number, cb?: (err?: any) => void) => {

    if (typeof config === 'object') {

        // Default port if not provided
        config.port || (config.port = 3000)

        // Default server if not provided
        config.server || (config.server = http)

        if (config.turboMode) {

            /**
             * Checks if the developer is attempting to use path patterns
             * despite enabling Turbo Mode.
             */
            PartyRouterStack.forEach(_stack => {
                const conflictingPathUse = _stack.routerStack.find(_childStack => _childStack.path)
                if (conflictingPathUse) {
                    console.log('')
                    console.log('\x1b[33m%s\x1b[0m', 'WARNING: Handler with path pattern ' + conflictingPathUse.path
                        + ' will be ignored in Turbo Mode.\n')
                }
            })

            /**
             * TODO(global): Do not use global namespace
             * @date - 5/26/17
             * @time - 12:10 PM
             */
            Object.defineProperty(global, 'TURBO_MODE', {
                get: () => true
            })
        }
    }

    // Config passed as number, perceive as port argument
    if (typeof config === 'number') {
        config = {
            server: http,
            port: config
        }
    }

    // No config given, assign default port
    if (typeof config === 'undefined') {
        config = {
            port: 3000,
            server: http
        }
    }

    const topRoutes = PartyRouterStack.find(_stack => _stack.routerName === serverApp.name)

    if (!topRoutes) {
        console.log('WARNING: No root handlers found. If you intended not to add any RouterStack' +
            'items to the main Router, ignore this message.')
    } else {
        RouteStack.addStack(...topRoutes.routerStack)
    }

    const server = (config as BootstrapConfig).server.createServer((req, res) => RouteStack.matchRequest(req, res))

    /**
     * TODO(opt): Return as promise / callback
     * So the user knows for sure when microdose is up and running
     */
    server.listen(config.port, () => {

        if (process.env.NODE_ENV === 'development') {

            microCredits((config as BootstrapConfig).port)

            if ((config as BootstrapConfig).turboMode) {
                console.log('')
                console.log('\x1b[33m%s\x1b[0m', 'WARNING: Turbo Mode is enabled. Path matching is disabled and' +
                    ' request will only match request methods.\n')
            }
        }

        cb && cb()
    })
}
