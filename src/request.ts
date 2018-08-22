import { IncomingHttpHeaders, IncomingMessage } from 'http'
import { Socket } from 'net'

export interface uRequest extends IncomingMessage {
  body: IncomingHttpHeaders
  local: IncomingHttpHeaders
  params: IncomingHttpHeaders
  get: (key: string) => string
}

export const RequestBuilder = (req: IncomingMessage): uRequest => {
  const extended: uRequest = req as any

  /**
   * Injected object from a request payload
   * e.g @MicroMethod.Post('/users') -> POST http://hostname/users {"user_name": "user", "password": "1234"}
   * body = {
   *      user_name: "user",
   *      password: "1234",
   * }
   * @type {{}}
   */
  extended.body = {}

  /**
   * Request scoped Object
   * can be used to store and retrieve values on a per request basis
   * @type {{}}
   */
  extended.local = {}

  /**
   * Params injected from matching URL patterns
   * e.g @MicroMethod.Get('/users/:userId') -> GET http://hostname/users/johnny
   * params = {
   *      userId: johnny // From the URL
   * }
   * @type {{}}
   */
  extended.params = {}

  extended.get = function (key: string): string {
    // Look up for a matching key value in the headers first
    // before looking up inside the request scoped `local` Object
    return this.local[key] || this.headers[key] || null
  }

  return extended
}

export class uRequeste extends IncomingMessage {

  /**
   * Injected object from a request payload
   * e.g @MicroMethod.Post('/users') -> POST http://hostname/users {"user_name": "user", "password": "1234"}
   * body = {
   *      user_name: "user",
   *      password: "1234",
   * }
   * @type {{}}
   */
  body: any = {}

  /**
   * Request scoped Object
   * can be used to store and retrieve values on a per request basis
   * @type {{}}
   */
  local: any = {}

  /**
   * Params injected from matching URL patterns
   * e.g @MicroMethod.Get('/users/:userId') -> GET http://hostname/users/johnny
   * params = {
   *      userId: johnny // From the URL
   * }
   * @type {{}}
   */
  public params: any = {}

  constructor (connection: Socket) {
    super(connection)
  }

  static create (req: IncomingMessage): uRequest {
    const _uReq = new uRequeste(req.connection)

    // Merges properties of IncomingMessage with MicroRequest
    // Based on benchmarks of a couple methods to do this,
    // this is the most performant of all
    for (let method in _uReq) {
      _uReq[method] = req[method]
    }

    return _uReq
  }

  get (key: string): string {
    // Look up for a matching key value in the headers first
    // before looking up inside the request scoped `local` Object
    return this.local[key] || this.headers[key] || null
  }
}
