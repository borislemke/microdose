import { ensureURIValid } from './utils/ensure_url'
import { IRequestMethod, StackItem } from './route_stack'

export class Methods {
  static methods: StackItem[] = []
}

const descriptorModifier = (method: IRequestMethod, methodPath = '/') => {

  return function (target: any, propertyKey: string, property: any): any {
    Methods.methods.push({
      method,
      router: target.constructor.name,
      handler: property.value,
      path: ensureURIValid(methodPath)
    })

    return property.value
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
