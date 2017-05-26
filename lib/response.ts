import {ServerResponse} from 'http'
import {HTTPStatusCodes} from './status_codes'

export interface MicroResponse extends ServerResponse, MicroResponseBuilder {
}

export interface ResponseHeaders {
    [key: string]: string
}

export class MicroResponseBuilder {

    /**
     * Reference to the original Node ServerResponse object
     */
    nativeResponse: ServerResponse

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
    private _responseHeaders: ResponseHeaders = {
        'Content-Type': 'text/plain; charset=utf-8'
    }

    constructor(_res: ServerResponse) {
        this.nativeResponse = _res
    }

    public static create(res: ServerResponse): MicroResponse {

        // Extended response object
        const microResponse = new MicroResponseBuilder(res)

        // Merge properties of ServerResponse with MicroResponse
        for (let method in microResponse) {
            res[method] = microResponse[method]
        }

        return (res as MicroResponse)
    }

    /**
     * Set header values for the response to be sent. This is just
     * @param key
     * @param value
     */
    public set(key: string, value: string): void {

        this.nativeResponse.setHeader(key, value)
    }

    /**
     * Sets the status code of the current response Object
     * @param statusCode
     * @returns {MicroResponse}
     */
    public status(statusCode: HTTPStatusCodes): MicroResponse {

        // Sets the status code of the next response
        this._statusCode = statusCode

        // Force type assertion as TS does not understand
        // that the Object has been dynamically merged
        return ((this as any) as MicroResponse)
    }

    public send(payload?: any): void {

        // Determine what the final payload should be
        // by analyzing it's type
        const payloadType = typeof payload

        // Convert payload to string if type is of Object
        if (payloadType === 'object') {
            payload = JSON.stringify(payload)
        }

        // Provide fallback content
        payload = payload || ''

        const contentLength = payload.length

        // Provide Content-Length header value
        this.nativeResponse.setHeader('Content-Length', contentLength)

        // End connection and send off payload
        this.nativeResponse.end(Buffer.from(payload))
    }
}
