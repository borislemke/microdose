import { uRequest } from './request';
import { uResponse } from './response';
import { Request, Response } from 'express';
export interface NextFunction {
    (req?: uRequest, res?: uResponse): void;
}
export interface RequestHandler<Rq extends Request, Rs extends Response> {
    (req: uRequest & Rq, res: uResponse & Rs, next?: NextFunction): void;
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
export declare const wrapMiddleware: (middleware: Function[], originalMethod: Function) => Function;
export declare function uMiddleware(...middleware: MiddlewareFunction[]): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => any;
