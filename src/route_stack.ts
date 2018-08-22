import * as parseUrl from 'parseurl'
import { uResponse, uResponseBuilder } from './response'
import { uRequest, uRequestBuilder } from './request'
import { IncomingMessage, ServerResponse } from 'http'
import { HTTPStatusCodes } from './status_codes'
import { uApp } from './app'

export interface StackItem {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  handler: (req: uRequest, res: uResponse) => void
}

export interface RouteStackGroup {
  [method: string]: StackItem[]
}

const earlyReturn = (res: ServerResponse) => {
  res.writeHead(HTTPStatusCodes.NOT_FOUND, uResponseBuilder.defaultResponseHeaders)
  res.end('Not Found')
}

export class RouteStackC {

  /**
   * All path stack collected from the MicroMethod decorator will
   * end up here to be path-matched for each incoming request.
   * Filtering by method first has significant performance impact
   * @type {RouteStackGroup[]}
   */
  routeStack: RouteStackGroup = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
    PATCH: []
  }

  addStack (...stackItems: StackItem[]): void {

    // Ensure stackItems is an array
    stackItems = [].concat(stackItems)

    // Adds all provided path stack to the _routeStack property
    stackItems.forEach(_stack => {

      const targetStack = this.routeStack[_stack.method]

      targetStack.push(_stack)
    })
  }

  /**
   * Make as efficient as possible, this is the only function
   * that is run to map incoming requests.
   * Treat this as the most performance sensitive function of all
   */
  matchRequest (req: IncomingMessage, res: ServerResponse) {
    const matchingRoutesStack = this.routeStack[req.method.toUpperCase()]

    // Early return if routerStack by method has no handlers
    if (!matchingRoutesStack.length) {
      earlyReturn(res)
      return
    }

    // If TURBO_MODE is enabled, we only need to match the method as there can
    // only be a single handler function of each method. Path matching is disabled
    if (uApp.TURBO_MODE) {
      const mResponse = uResponseBuilder.create(res)

      const mRequest = uRequestBuilder.create(req)

      // Retrieve first handler of the matching router stack
      return matchingRoutesStack[0].handler(mRequest, mResponse)
    }

    // The URL of the current request
    const incomingRequestPath = parseUrl(req).pathname

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

      // Iterate over route patterns
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

    // Create the request and response object only after a route match has been found
    const uResponse = uResponseBuilder.create(res)

    const uRequest = uRequestBuilder.create(req)

    // Attach params to current request context
    if (params) {
      uRequest.params = params
    }

    // Execute matching route handler
    routeMatch.handler(uRequest, uResponse)
  }
}

export const RouteStack = new RouteStackC()
