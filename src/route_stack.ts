import * as parseUrl from 'parseurl'
import { ResponseBuilder } from './response'
import { IncomingMessage, ServerResponse } from 'http'
import { HTTPStatusCodes } from './status_codes'
import { uApp } from './app'
import { RequestBuilder } from './request'
import { RequestHandler } from './middleware'

export type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface StackItem {
  router?: string
  path: string
  method?: IRequestMethod
  handler: RequestHandler
}

export interface RouteStackGroup {
  [method: string]: StackItem[]
}

const earlyReturn = (res: ServerResponse) => {
  res.writeHead(HTTPStatusCodes.NOT_FOUND, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not Found')
}

export class RouteStack {

  /**
   * All path stack collected from the MicroMethod decorator will
   * end up here to be path-matched for each incoming request.
   * Filtering by method first has significant performance impact
   * @type {RouteStackGroup[]}
   */
  static routeStack: RouteStackGroup = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
    PATCH: []
  }

  static addStack (...stackItems: StackItem[]): void {
    // Adds all provided path stack to the _routeStack property
    stackItems.forEach(stack => {
      const targetStack = this.routeStack[stack.method]

      targetStack.unshift({
        path: stack.path,
        handler: stack.handler
      })
    })
  }

  /**
   * Make as efficient as possible, this is the only function that is
   * run to map incoming requests. Treat this as the most performance
   * sensitive function of all.
   */
  static matchRequest (req: IncomingMessage, res: ServerResponse) {
    let matchingRoutesStack = this.routeStack[req.method.toUpperCase()]

    // Early return if routerStack by method has no handlers.
    if (!matchingRoutesStack.length) {
      return uApp.defaultRoute
        ? uApp.defaultRoute(req, res)
        : earlyReturn(res)
    }

    // If TURBO_MODE is enabled, we only need to match the method as
    // there can only be a single handler function of each method.
    if (uApp.TURBO_MODE) {
      return matchingRoutesStack[0].handler(
        RequestBuilder(req),
        ResponseBuilder(res)
      )
    }

    // The URL of the current request
    const incomingRequestPath = parseUrl(req).pathname

    // Matching routerStack for the current incoming request
    let routeMatch

    // Found parameters inside path path
    let params = {}

    // Incoming request URL split by slashes. Used for path matching later
    // e.g /users/userName => ['users', 'username']
    let pathChunks = incomingRequestPath.replace(/^\/+|\/+^/, '').split('/')

    for (let i = 0; i < matchingRoutesStack.length; i++) {

      // The currently iterated routerName stack.
      const curr = matchingRoutesStack[i]

      // Break loop if exact root match found.
      if (curr.path === incomingRequestPath) {
        routeMatch = curr
        break
      }

      // Checks if the currently iterated routeStack has a parameter
      // identifier. If it does not, immediately continue loop. Regex
      // checking function below this point is expensive, we want to
      // prevent from doing it if not necessary.
      // e.g @MicroMethod.Post('/users/:userId') or ('/foo*')
      if (!/\/?:(.*)|\*/g.test(curr.path)) {
        console.log('identifier')
        continue
      }

      const matchChunks = curr.path.replace(/^\/+|\/+^/, '').split('/')

      // Continue loop early if request URL and currently iterated
      // router stack does not match in chunks length.
      if (pathChunks.length !== matchChunks.length) continue

      // Iterate over route patterns.
      for (let i = 0; i < matchChunks.length; i++) {

        const capture = matchChunks[i]

        if (/^:/.test(capture)) {
          params[capture.replace(/^:/i, '')] = pathChunks[i]
        }

        if (/^\*/.test(capture)) {
          params[capture.replace(/^\*/i, '')] = pathChunks[i]
        }
      }

      // If any matching params were found mark the currently iterated
      // routerStack as a match and break out of the loop.
      if (Object.keys(params).length) {
        routeMatch = curr
        break
      }
    }

    if (!routeMatch) {
      return uApp.defaultRoute
        ? uApp.defaultRoute(req, res)
        : earlyReturn(res)
    }

    // Create the request and response object only after a route match has been found
    const uRes = ResponseBuilder(res)
    const uReq = RequestBuilder(req)

    // Attach params to current request context
    if (params) {
      uReq.params = params
    }

    // Execute matching route handler
    routeMatch.handler(uReq, uRes)
  }
}
