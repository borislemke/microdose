import { PartyRouterStack } from './router'
import { ensureURIValid } from './utils/ensure_url'
import { IRequestMethod, StackItem } from './route_stack'

const descriptorModifier = (method: IRequestMethod, methodPath: string) => {
  return function (target, descriptorKey: string, descriptor: any): any {
    let originalHandler = descriptor.value

    let indexOfPartyStack = -1

    const existingPartyStack = PartyRouterStack.find((_stack, index) => {
      indexOfPartyStack = index
      return _stack.routerName === target.constructor.name
    })

    // Ensures that the routerStack path is valid
    // e.g //some-path/that//is/not-valid/// -> /some-path/that/is/not-valid
    methodPath = ensureURIValid(methodPath as string)

    const stackItem: StackItem = {
      method,
      path: (methodPath as string),
      handler: originalHandler
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

const baseMethod = (method) => function (methodPath = '/') {

  if (arguments.length > 2) {
    throw new Error('@MicroRouter[method] requires exactly 2 parameters. 3 given')
  }

  return descriptorModifier(method, methodPath)
}

export const uMethod = {
  get: baseMethod('GET'),
  post: baseMethod('POST'),
  put: baseMethod('PUT'),
  patch: baseMethod('PATCH'),
  delete: baseMethod('DELETE')
}
