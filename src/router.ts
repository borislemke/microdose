import { MiddlewareFunction, wrapMiddleware } from './middleware'
import { ensureURIValid } from './utils/ensure_url'
import { RouteStack } from './route_stack'

export interface IRouterConfig {
  prefix?: string
  children?: any[]
  middleware?: MiddlewareFunction[]
}

export interface IPartyStack {
  routerName: string
  routerStack: any[]
}

export const PartyRouterStack: IPartyStack[] = []

export function uRouter (config: IRouterConfig = {}) {
  const {
    prefix = '',
    children = [],
    middleware
  } = config

  return function (target): any {
    if (children) {
      children.forEach(rChild => {
        /**
         * Look up for a RouterStack that is a direct child of the current RouterStack
         * @type {IPartyStack}
         */
        const partyRouterChildren = PartyRouterStack.find(r => r.routerName === rChild.name)

        if (partyRouterChildren && partyRouterChildren.routerStack.length) {
          PartyRouterStack.splice(PartyRouterStack.indexOf(partyRouterChildren), 1)

          partyRouterChildren
          .routerStack
          .forEach(cRoute => {
            cRoute.path = ensureURIValid(prefix, rChild.prefix, cRoute.path)

            if (middleware && middleware.length) {
              cRoute.handler = wrapMiddleware(middleware, cRoute.handler)
            }

            RouteStack.addStack(cRoute)
          })
        }
      })
    }

    const rStack = PartyRouterStack
    .find(_stack => _stack.routerName === target.name)

    if (rStack) {
      rStack.routerStack = rStack.routerStack.map(stack => {
        // Apply Router and Router children scoped `prefix` if provided
        stack.path = ensureURIValid(prefix, stack.path)

        return stack
      })

      /**
       * Wrap all functions inside a MiddlewareFunction if provided.
       * The order of the middleware MUST be reversed before being???
       * applied.
       */
      if (middleware && middleware.length) {
        rStack.routerStack.forEach(stack => {
          stack.handler = wrapMiddleware(middleware, stack.handler)
        })
      }
    }

    return target
  }
}
