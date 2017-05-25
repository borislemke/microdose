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
            console.warn('No root routerStack found. If you intended not to add any routerStack to the main Party, ignore this message.')
        } else {
            RouteStack.addStack(...topRoutes.routerStack)
        }

        const useSocket = config && (config as BootstrapConfig).useSocket

        let server

        /** TODO(opt): Optimize statement */
        if (useSocket) {

            Object.defineProperty(global, 'USE_SOCKET', {
                get: () => true
            })

            console.log('')
            console.log('\x1b[33m%s\x1b[0m', '    WARNING: BootstrapConfig.useSocket is a highly experimental feature. Do not rely on it in production.')
            console.log('')

            server = uws.http.createServer((req, res) => {
                RouteStack.matchRequest(req, res)
            })

        } else {

            /**
             * TODO(opt):
             */
            Object.defineProperty(global, 'USE_SOCKET', {
                get: () => false
            })

            server = http.createServer((req, res) => RouteStack.matchRequest(req, res))
        }

        server.listen(port, () => {
            microCredits(port)
        })
    }

    if (clusterize) {
        startCluster(bootStrap)
    } else {
        bootStrap()
    }
}
