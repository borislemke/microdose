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
     * Treat this as the most performance sensitive function of all
     */
    matchRequest(req: IncomingMessage, res: ServerResponse) {

        /**
         * TODO(global): Do not use global namespace
         * @date - 5/26/17
         * @time - 12:14 PM
         */
        const liteMode: boolean = typeof global['LITE_MODE'] !== 'undefined' && global['LITE_MODE']

        const incomingRequestRoute = parseUrl(req).pathname

        const matchingRoutesStack = this._routeStack[req.method]

        // If LITE_MODE is enabled, we only need to match the method as there
        // can only be a single instance for each method
        if (liteMode) {
            //
            const mResponse = MicroResponseBuilder.create(res)
            const mRequest = MicroRequestBuilder.create(req)
            matchingRoutesStack[0].handler(mRequest, mResponse)
            return
        }

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

            // Tries to look up a match to the incoming request's URL
            const regExec = reg.exec(incomingRequestRoute)

            // If no match found, return immediately
            if (!regExec) continue

            for (let i = 0; i < reg.keys.length; i++) {
                const matchValue = regExec[i + 1]
                const matchKey = reg.keys[i].name
                // Assign the matching parameters to the params object
                // to be passed on to the MicroResponse
                params[matchKey] = matchValue
            }

            // If any matching params were found
            // mark the currently iterated routerStack as a match
            // and break out of the loop
            if (Object.keys(params).length) {
                routeMatch = curr
                break
            }
        }

        const mResponse = MicroResponseBuilder.create(res)

        if (!routeMatch) {
            // No matching path handler found return 404
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
