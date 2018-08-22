import { uRequest } from './request'
import { uResponse } from './response'
import { Request, Response } from 'express'

export interface NextFunction {
  (req?: uRequest, res?: uResponse): void
}

export interface RequestHandler<Rq extends Request, Rs extends Response> {
  (req: uRequest & Rq, res: uResponse & Rs, next?: NextFunction): void
}

export interface MiddlewareFunction extends RequestHandler<any, any> {
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

export function uMiddleware (...middleware: MiddlewareFunction[]) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): any {
    descriptor.value = wrapMiddleware(middleware, descriptor.value)

    return descriptor
  }
}
