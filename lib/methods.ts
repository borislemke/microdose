import {MiddlewareFunction} from './middleware'
import {PartyRouterStack} from './router'
import {ensureURIValid} from './utils/ensure_url'
import {StackItem} from './route_stack'

const baseMethod = (method) => function (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) {

    if (arguments.length > 2) {
        throw new Error('@MicroRouter[method] requires exactly 2 parameters. 3 given')
    }

    // case: @MicroRouter.Get()
    if (typeof methodPath === 'undefined' && typeof methodMiddleware === 'undefined') {
        methodMiddleware = null
        methodPath = '/'
    }

    // case: @MicroRouter.Get(middlewareFunction)
    if (typeof methodPath === 'function' && typeof methodMiddleware === 'undefined') {
        methodMiddleware = (methodPath as MiddlewareFunction)
        methodPath = '/'
    }

    // Ensures that the routerStack path is valid
    // e.g //some-path/that//is/not-valid/// -> /some-path/that/is/not-valid
    /** TODO(opt): We might need to allow this? */
    methodPath = ensureURIValid(methodPath as string)

    return function (target, descriptorKey: string, descriptor: any): any {

        // Clone original handler function
        let handler = descriptor.value

        let indexOfPartyStack = -1

        const existingPartyStack = PartyRouterStack.find((_stack, index) => {

            indexOfPartyStack = index

            return _stack.routerName === target.constructor.name
        })

        if (methodMiddleware) {
            const originalFunction = handler
            handler = (req, res) =>
                methodMiddleware(req, res, (req2, res2) =>
                    originalFunction(req2 || req, res2 || res))
        }

        const stackItem: StackItem = {
            method,
            path: (methodPath as string),
            handler
        }

        if (!existingPartyStack) {
            PartyRouterStack.push({
                routerName: target.constructor.name,
                routerStack: [stackItem]
            })
        } else {
            PartyRouterStack[indexOfPartyStack].routerStack.push(stackItem)
        }

        return descriptor.value
    }
}

export const MicroMethod = {
    Get: baseMethod('GET'),
    Post: baseMethod('POST'),
    Put: baseMethod('PUT'),
    Patch: baseMethod('PATCH'),
    Delete: baseMethod('DELETE')
}
