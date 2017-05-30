import {MicroRequest} from './request'
import {MicroResponse} from './response'

export interface NextFunction {
    (req?: MicroRequest, res?: MicroResponse): void
}

export interface RequestHandler {
    (req: MicroRequest, res: MicroResponse, next?: NextFunction): void
}

export interface MiddlewareFunction extends RequestHandler {
}
