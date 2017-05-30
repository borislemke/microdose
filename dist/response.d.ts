/// <reference types="node" />
import { ServerResponse } from 'http';
import { HTTPStatusCodes } from './status_codes';
export interface MicroResponse extends ServerResponse, MicroResponseBuilder {
}
export interface ResponseHeaders {
    [key: string]: string;
}
export declare class MicroResponseBuilder {
    /**
     * Reference to the original Node ServerResponse object
     */
    nativeResponse: ServerResponse;
    /**
     * Default response status code
     * @type {number}
     * @private
     */
    private _statusCode;
    /**
     * Default Content-Type header
     * @type {ResponseHeaders}
     * @private
     */
    private _responseHeaders;
    constructor(_res: ServerResponse);
    static create(res: ServerResponse): MicroResponse;
    /**
     * Set header values for the response to be sent. This is just
     * @param key
     * @param value
     */
    set(key: string, value: string): void;
    /**
     * Sends an empty response with the response code only
     * as the header
     * @param statusCode
     */
    sendStatus(statusCode: number): void;
    /**
     * Sets the status code of the current response Object
     * @param statusCode
     * @returns {MicroResponse}
     */
    status(statusCode: HTTPStatusCodes): MicroResponse;
    send(payload?: any): void;
}
