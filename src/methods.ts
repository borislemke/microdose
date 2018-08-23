import { PartyRouterStack } from './router'
import { ensureURIValid } from './utils/ensure_url'
import { IRequestMethod, StackItem } from './route_stack'

const descriptorModifier = (method: IRequestMethod, methodPath: string) => {

  return function (target: any, propertyKey: string, property: any): any {
    let originalHandler = property.value

    let indexOfRouterGroup = -1

    const routerGroup = PartyRouterStack.find((stack, index) => {
      indexOfRouterGroup = index
      return stack.routerName === target.constructor.name
    })

    const stackItem: StackItem = {
      method,
      router: target.name,
      path: ensureURIValid(methodPath),
      handler: originalHandler
    }

    if (!routerGroup) {
      PartyRouterStack.push({
        routerName: target.constructor.name,
        routerStack: [stackItem]
      })
    } else {
      PartyRouterStack[indexOfRouterGroup].routerStack.push(stackItem)
    }

    return property
  }
}

const baseMethod = (method: IRequestMethod) => function (methodPath = '/') {

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
