import * as parseUrl from 'parseurl'
import {MicroResponse, MicroResponseBuilder} from './response'
import {MicroRequest, MicroRequestBuilder} from './request'
import {IncomingMessage, ServerResponse} from 'http'
import {HTTPStatusCodes} from './status_codes'
const pathToRegexp = require('path-to-regexp')


export interface StackItem {
    path: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    handler: (req: MicroRequest, res: MicroResponse) => void
}


export interface RouteStackGroup {
    [method: string]: StackItem[]
}


export class RouteStackCompiler {


    /**
     * All path stack collected from the MicroMethod decorator will
     * end up here to be path-matched for each incoming request
     * @type {RouteStackGroup[]}
     * @private
     */
    private _routeStack: RouteStackGroup = {
        GET: [],
        POST: [],
        PUT: [],
        DELETE: [],
        PATCH: []
    }


    addStack(...stackItems: StackItem[]): void {

        // Ensure stackItems is an array
        stackItems = [].concat(stackItems)

        // Adds all provided path stack to the _routeStack property
        stackItems.forEach(_stack => {

            const targetStack = this._routeStack[_stack.method]

            targetStack.push(_stack)
        })
    }


    /**
     * Make as efficient as possible, this is the only function
     * that is run to map incoming requests.
     * Treat this function as the most performance sensitive ever. EVER.
     */
    matchRequest(req: IncomingMessage, res: ServerResponse) {

        const incomingRequestRoute = parseUrl(req).pathname

        const matchingRoutesStack = this._routeStack[req.method]

        // Found a matching routerName stack
        let routeMatch

        // Found parameters inside path path
        let params = {}

        for (let i = 0; i < matchingRoutesStack.length; i++) {

            // The currently iterated routerName stack
            const curr = matchingRoutesStack[i]

            // Break loop if exact root match found
            if (curr.path === incomingRequestRoute) {
                routeMatch = curr
                break
            }

            // Checks if the currently iterated routeStack has a parameter identifier.
            // If it does not, immediately continue loop. Regex checking function below
            // this point is expensive, we want to prevent from doing it if not necessary.
            // e.g @MicroMethod.Post('/users/:userId') or ('/foo*')
            if (!/\/?:(.*)|\*/g.test(curr.path)) continue

            // MicroRequest should bind params data to the request
            // e.g req.params.userId = `value of :userId`
            /** TODO(perf): offload path matching to C module */
            const reg = pathToRegexp(curr.path)

            const regExec = reg.exec(incomingRequestRoute)

            if (!regExec) continue

            for (let i = 0; i < reg.keys.length; i++) {
                const matchValue = regExec[i + 1]
                const matchKey = reg.keys[i].name
                params[matchKey] = matchValue
            }

            if (Object.keys(params).length) {
                routeMatch = curr
                break
            }
        }

        const mResponse = MicroResponseBuilder.create(res)

        if (!routeMatch) {
            // No matching path handler found
            // Return 404
            mResponse.status(HTTPStatusCodes.NOT_FOUND).send('Not Found')
            return
        }

        const mRequest = MicroRequestBuilder.create(req)

        // Attach params to current request context
        if (params) mRequest.params = params

        routeMatch.handler(mRequest, mResponse)
    }
}

export const RouteStack = new RouteStackCompiler()
