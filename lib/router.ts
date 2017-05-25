import {MiddlewareFunction} from './middleware'
import {RouteStack} from './route_stack'
import {ensureURIValid} from './utils/ensure_url'


export interface RouterChild {
    prefix: string
    router: Function
}

export interface RouterConfig {
    prefix?: string
    children?: RouterChild[]
    middleware?: MiddlewareFunction[]
}

export interface PartyStack {
    routerName: string
    routerStack: any[]
}

export const PartyRouterStack: PartyStack[] = []


export function MicroRouter(config: RouterConfig = null) {

    return function (target): any {

        /** TODO(opt): Optimise if conditions */
        if (config) {

            const routerPrefix = config.prefix || ''

            if (config.children) {

                config.children.forEach(_routerChild => {

                    let indexOfChildRouter = null

                    const partyRouterChildren = PartyRouterStack.find((_stack, index) => {

                        indexOfChildRouter = index

                        return _stack.routerName === _routerChild.router.name
                    })

                    if (partyRouterChildren && partyRouterChildren.routerStack.length) {

                        partyRouterChildren.routerStack.forEach(_childRoute => {

                            _childRoute.path = ensureURIValid(routerPrefix, _routerChild.prefix, _childRoute.path)

                            if (config.middleware && config.middleware.length) {

                                const originalHandler = _childRoute.handler

                                config.middleware.forEach(_middleware => {
                                    _childRoute.handler = (req, res) =>
                                        _middleware(req, res, (req2, res2) =>
                                            originalHandler(req2 || req, res2 || res))
                                })
                            }

                            RouteStack.addStack(_childRoute)
                        })
                    }
                })
            }

            if (config.middleware || config.prefix) {

                const _routerStack = PartyRouterStack.find(_stack => _stack.routerName === target.name)

                if (_routerStack) {

                    _routerStack.routerStack = _routerStack.routerStack.map(_stack => {

                        // Apply Router and Router children scoped prefix if provided
                        _stack.path = ensureURIValid(routerPrefix, _stack.path)

                        return _stack
                    })

                    if (config.middleware) {

                        config.middleware.forEach(_middleware => {

                            _routerStack.routerStack.forEach((_stack, index) => {

                                const originalHandler = _stack.handler

                                _stack.handler = (req, res) =>
                                    _middleware(req, res, (req2, res2) =>
                                        originalHandler(req2 || req, res2 || res))
                            })
                        })
                    }
                }
            }
        }
        return target
    }
}
