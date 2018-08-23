import { uRequest } from './request'
import { uResponse } from './response'
import { IncomingMessage, ServerResponse } from 'http'

export type NextFunction = (err?: any) => void

export interface RequestHandler<Rq extends IncomingMessage = any, Rs extends ServerResponse = any> {
  (req: uRequest & Rq, res: uResponse & Rs, next?: NextFunction): void
}

/**
 * Wraps a function inside an array of middlewares / functions.
 * Eg:
 * middlewares = [
 *   fn1,
 *   fn2
 * ]
 * const fn3
 * const fn4 = wrapMiddleware(middlewares, fn3)
 * fn4 => fn2((...params) => fn1((...params) => fn3(...params)))
 * @param middleware
 * @param originalMethod
 */
export const wrapMiddleware = (middleware: Function[], originalMethod: Function): Function => {
  middleware.reverse()
  .forEach(_middleware => {
    const originalHandler = originalMethod
    originalMethod = (req, res) => {
      _middleware(req, res, (req2, res2) => {
        originalHandler(req2 || req, res2 || res)
      })
    }
  })

  return originalMethod
}

export function uMiddleware<Rq extends IncomingMessage, Rs extends ServerResponse> (...middleware: RequestHandler<Rq, Rs>[]) {
  return function (target: any, propertyKey: string | symbol, property: PropertyDescriptor): any {
    property.value = wrapMiddleware(middleware, property.value)

    return property
  }
}
