import * as parseUrl from 'parseurl'
import {MicroResponse, MicroResponseBuilder} from './response'
import {MicroRequest, MicroRequestBuilder} from './request'
import {IncomingMessage, ServerResponse} from 'http'
import {HTTPStatusCodes} from './status_codes'

export interface StackItem {
    path: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    handler: (req: MicroRequest, res: MicroResponse) => void
}

export interface RouteStackGroup {
    [method: string]: StackItem[]
}

const earlyReturn = (res: ServerResponse) => {
    res.writeHead(HTTPStatusCodes.NOT_FOUND, {'Content-Type': 'plain/text'})
    res.end('Not Found')
}

export class RouteStackCompiler {

    /**
     * All path stack collected from the MicroMethod decorator will
     * end up here to be path-matched for each incoming request.
     * Filtering by method first has significant performance impact
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
        const turboMode: boolean = typeof global['TURBO_MODE'] !== 'undefined' && global['TURBO_MODE']

        const matchingRoutesStack = this._routeStack[req.method]

        // Early return if routerStack by method has no handlers
        if (!matchingRoutesStack.length) {
            earlyReturn(res)
            return
        }

        // If TURBO_MODE is enabled, we only need to match the method as there can
        // only be a single handler function of each method. Path matching is disabled
        if (turboMode) {
            const mResponse = MicroResponseBuilder.create(res)
            const mRequest = MicroRequestBuilder.create(req)
            // Retrieve first handler of the matching router stack
            matchingRoutesStack[0].handler(mRequest, mResponse)
            // There can only be 1 handler per method if on turboMode
            if (matchingRoutesStack.length > 1 && process.env.NODE_ENV !== 'production') {
                console.log('')
                console.log('\x1b[33m%s\x1b[0m', `WARNING: 'Turbo Mode' is enable but microdose detected multiple
                handlers for ${req.method} requests.\n`)
            }
            return
        }

        // The URL of the current request
        const incomingRequestPath = parseUrl(req).pathname

        /**
         * TODO(production): Remove, browser testing only
         * @date - 5/27/17
         * @time - 2:56 AM
         */
        if (incomingRequestPath.includes('favicon')) {
            res.writeHead(204, {'Content-Type': 'plain/text'})
            res.end()
            return
        }

        // Matching routerStack for the current incoming request
        let routeMatch

        // Found parameters inside path path
        let params = {}

        // Incoming request URL split by slashes. Used for path matching later
        // e.g /users/userName => ['users', 'username']
        const pathChunks = incomingRequestPath.replace(/^\/+|\/+^/, '').split('/')

        for (let i = 0; i < matchingRoutesStack.length; i++) {

            // The currently iterated routerName stack
            const curr = matchingRoutesStack[i]

            // Break loop if exact root match found
            if (curr.path === incomingRequestPath) {
                routeMatch = curr
                break
            }

            // Checks if the currently iterated routeStack has a parameter identifier.
            // If it does not, immediately continue loop. Regex checking function below
            // this point is expensive, we want to prevent from doing it if not necessary.
            // e.g @MicroMethod.Post('/users/:userId') or ('/foo*')
            if (!/\/?:(.*)|\*/g.test(curr.path)) continue

            const matchChunks = curr.path.replace(/^\/+|\/+^/, '').split('/')

            // Continue loop early if request URL and currently iterated
            // router stack does not match in chunks length
            if (pathChunks.length !== matchChunks.length) continue

            for (let i = 0; i < matchChunks.length; i++) {

                const capture = matchChunks[i]

                if (/^:/.test(capture)) {
                    params[capture.replace(/^:/i, '')] = pathChunks[i]
                }
            }

            // If any matching params were found
            // mark the currently iterated routerStack as a match
            // and break out of the loop
            if (Object.keys(params).length) {
                routeMatch = curr
                break
            }
        }

        /**
         * TODO(production): Allow custom override of not found function
         * @date - 5/27/17
         * @time - 2:54 AM
         */
        if (!routeMatch) {
            // No matching path handler found return 404
            earlyReturn(res)
            return
        }

        const mResponse = MicroResponseBuilder.create(res)

        // Create the request object only after a route match has been found
        const mRequest = MicroRequestBuilder.create(req)

        // Attach params to current request context
        if (params) mRequest.params = params

        // Execute matching route handler
        routeMatch.handler(mRequest, mResponse)
    }
}

export const RouteStack = new RouteStackCompiler()
