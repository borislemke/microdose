import * as os from 'os'
import * as uws from 'uws'
import * as http from 'http'
import * as cluster from 'cluster'
import {RouteStack} from './route_stack'

import {microCredits} from './utils/credits'
import {PartyRouterStack} from './router'
const numCPUs = os.cpus().length

export interface BootstrapConfig {
    port?: number
    cluster?: boolean
    useSocket?: boolean
}

function startCluster(bootStrap: Function) {

    if (cluster.isMaster) {

        console.log(`Master ${process.pid} is running`)

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`)
        })
    }

    if (cluster.isWorker) {

        console.log(`Worker ${process.pid} started`)

        bootStrap()
    }
}

export const MicroBootstrap = (serverApp, config: BootstrapConfig | number) => {

    let port

    let clusterize = false

    if (typeof config === 'object') {
        port = config.port
        clusterize = config.cluster
    }

    if (typeof config === 'number') {
        port = (config as number)
    }

    if (typeof config === 'undefined') {
        port = 3000
    }

    port || (port = 3000)

    const bootStrap = () => {

        const topRoutes = PartyRouterStack.find(_stack => _stack.routerName === serverApp.name)

        if (!topRoutes) {
            console.log('WARNING: No root handlers found. If you intended not to add any RouterStack items to the main Router, ignore this message.')
        } else {
            RouteStack.addStack(...topRoutes.routerStack)
        }

        const useSocket = config && (config as BootstrapConfig).useSocket

        let server

        /** TODO(opt): Optimize statement */
        if (useSocket) {

            /**
             * TODO(opt): do not use global
             */
            Object.defineProperty(global, 'USE_SOCKET', {
                get: () => true
            })

            console.log('')
            console.log('\x1b[33m%s\x1b[0m', '    WARNING: BootstrapConfig.useSocket is a highly experimental feature. Do not rely on it in production.')
            console.log('')

            /** @experimental */
            /** @deprecated */
            server = uws.http.createServer((req, res) => RouteStack.matchRequest(req, res))

        } else {

            /**
             * TODO(opt): do not use global
             */
            Object.defineProperty(global, 'USE_SOCKET', {
                get: () => false
            })

            server = http.createServer((req, res) => RouteStack.matchRequest(req, res))
        }

        /**
         * TODO(opt): Return as promise / callback
         * So the user knows for sure when microdose is up and running
         */
        server.listen(port, () => microCredits(port))
    }

    if (clusterize) {
        /**
         * TODO(opt): We might want remove this from the core of microdose and
         * TODO(opt): leave it to the developer?
         */
        startCluster(bootStrap)
    } else {
        bootStrap()
    }
}
