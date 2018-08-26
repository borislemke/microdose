import { RequestHandler, wrapMiddleware } from './middleware'
import { MethodStore } from './method'
import { ensureURIValid } from './utils/ensure_url'
import { RouteStack } from './route_stack'

export interface IRouterConfig {
  prefix?: string
  children?: any[]
  middleware?: RequestHandler[]
}

export class Routers {
  static routers: any[] = []

  static entryRouter: any

  static add (router: any) {
    this.routers.push(router)
  }

  static attach (app: any) {
    const entryRouter = this.entryRouter = this.routers.find(router => router.router === app.name)

    if (!entryRouter) {
      console.warn('No entry router provided')
    }

    this.flattenRouter()
  }

  static iterateOverChildren (router: any, parentMiddleware: RequestHandler[] = [], parentPrefix: string = '') {
    const {
      middleware = [],
      prefix
    } = router

    const previousMiddleware = [...parentMiddleware, ...middleware]

    const previousPrefix = ensureURIValid(parentPrefix, prefix)

    router.handlers.forEach(handler => {
      RouteStack.addStack({
        method: handler.method,
        path: ensureURIValid(previousPrefix, handler.path),
        handler: wrapMiddleware(handler.handler, previousMiddleware)
      })
    })

    if (router.children && router.children.length) {
      router.children.forEach(child => {
        child.forEach(c => this.iterateOverChildren(c, previousMiddleware, previousPrefix))
      })
    }
  }

  static flattenRouter () {
    this.iterateOverChildren(this.entryRouter)
  }
}

export function uRouter (config: IRouterConfig = {}) {
  const {
    prefix = '',
    children = [],
    middleware = []
  } = config

  return function (target: any): any {
    Routers.add({
      router: target.name,
      prefix,
      handlers: MethodStore.methods.filter(meth => meth.router === target.name),
      children: children.map(child => Routers.routers.filter(r => r.router === child.name)),
      middleware
    })

    return target
  }
}
