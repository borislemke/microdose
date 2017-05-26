/// <reference types="node" />
import { IncomingMessage } from 'http';
export interface MicroRequest extends IncomingMessage, MicroRequestBuilder {
}
/**
 * We might not even need to have the request extended
 * we could theoretically leave it to middleware functions
 */
export declare class MicroRequestBuilder {
    /**
     * Reference to the native Node IncomingMessage
     */
    native: IncomingMessage;
    /**
     * Injected object from a request payload
     * e.g @MicroMethod.Post('/users') -> POST http://hostname/users {"user_name": "user", "password": "1234"}
     * body = {
     *      user_name: "user",
     *      password: "1234",
     * }
     * @type {{}}
     */
    body: any;
    /**
     * Request scoped Object
     * can be used to store and retrieve values on a per request basis
     * @type {{}}
     */
    local: any;
    /**
     * Params injected from matching URL patterns
     * e.g @MicroMethod.Get('/users/:userId') -> GET http://hostname/users/johnny
     * params = {
     *      userId: johnny // From the URL
     * }
     * @type {{}}
     */
    params: any;
    constructor(request: any);
    static create(req: IncomingMessage): MicroRequest;
    /**
     * Is this necessary?
     * @param key
     * @returns {string|null}
     */
    get(key: string): string;
}
