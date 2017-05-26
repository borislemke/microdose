import {IncomingMessage} from 'http'

export interface MicroRequest extends IncomingMessage, MicroRequestBuilder {
}

/**
 * We might not even need to have the request extended
 * we could theoretically leave it to middleware functions
 */
export class MicroRequestBuilder {

    /**
     * Reference to the nativeResponse Node IncomingMessage
     */
    nativeRequest: IncomingMessage

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
    params: any = {}

    constructor(request) {
        this.nativeRequest = request
    }

    public static create(req: IncomingMessage): MicroRequest {

        const _microRequest = new MicroRequestBuilder(req)

        /**
         * TODO(opt): Benchmark these
         * @date - 5/26/17
         * @time - 2:09 PM
         */
        // OPT1
        // Merges properties of IncomingMessage with MicroRequest
        for (let method in _microRequest) {
            req[method] = _microRequest[method]
        }

        /* OPT2
         req = {
         ...toJSON(req),
         ...toJSON(_microRequest)
         } as MicroRequest
         */

        /* OPT3
         * req = Object.assign({}, toJSON(req), toJSON(_microRequest))
         */

        return (req as MicroRequest)
    }

    /**
     * Is this necessary?
     * @param key
     * @returns {string|null}
     */
    public get(key: string): string {

        // Look up for a matching key value in the headers first
        // before looking up inside the request scoped `local` Object
        return this.nativeRequest.headers(key) || this.local[key] || null
    }
}
