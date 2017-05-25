import {ServerResponse} from 'http'
import {HTTPStatusCodes} from './status_codes'


export interface MicroResponse extends ServerResponse, MicroResponseBuilder {
}


export interface ResponseHeaders {
    [key: string]: string
}


export class MicroResponseBuilder {


    native: ServerResponse


    /**
     * Default response status code
     * @type {number}
     * @private
     */
    private _statusCode: HTTPStatusCodes = 200


    /**
     * Default Content-Type header
     * @type {ResponseHeaders}
     * @private
     */
    private _responseHeaders = {
        'Content-Type': 'text/plain; charset=utf-8'
    }


    constructor(_res: ServerResponse) {
        this.native = _res
    }


    public static create(res: ServerResponse): MicroResponse {

        const microResponse = new MicroResponseBuilder(res)

        /**
         * Merge ServerResponse with original MicroResponse
         */
        for (let meth in microResponse) {
            res[meth] = microResponse[meth]
        }

        return (res as MicroResponse)
    }


    set(key: string, value: string): void {

        this.native.setHeader(key, value)
    }


    /**
     * Sets the status code of the current response Object
     * @param statusCode
     * @returns {MicroResponse}
     */
    status(statusCode: HTTPStatusCodes): MicroResponse {

        this._statusCode = statusCode

        // Force type assertion as TS does not understand that the Object is dynamically merged
        return ((this as any) as MicroResponse)
    }


    public send(payload?: any): void {

        const payloadType = typeof payload

        if (payloadType === 'object') {
            payload = JSON.stringify(payload)
        }

        payload = payload && Buffer.from(payload)

        payload || (payload = 'undefined')

        this.native.setHeader('Content-Length', payload.length)

        /**
         * TODO(experimental): Optimize
         * @date - 5/25/17
         * @time - 2:32 AM
         */
        if (!global['USE_SOCKET']) {

            this.native.writeHead(this._statusCode, this._responseHeaders)
        }

        this.native.end(payload)
    }
}
