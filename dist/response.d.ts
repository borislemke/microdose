/// <reference types="node" />
import { ServerResponse } from 'http';
import { HTTPStatusCodes } from './status_codes';
export declare type uResponse = ServerResponse & uResponseBuilder;
export interface ResponseHeaders {
    [key: string]: string;
}
export declare class uResponseBuilder {
    /**
     * Reference to the original Node ServerResponse object.
     */
    nativeResponse: ServerResponse;
    /**
     * Default response status code.
     * @type {number}
     * @private
     */
    private statusCode;
    /**
     * Default Content-Type header.
     * @type {ResponseHeaders}
     */
    static defaultResponseHeaders: ResponseHeaders;
    constructor(_res: ServerResponse);
    static create(res: ServerResponse): uResponse;
    /**
     * Set header values for the response to be sent. This is just...
     * @param key
     * @param value
     */
    set(key: string, value: string): void;
    /**
     * Sends an empty response with the response code only as the header.
     * @param statusCode
     */
    sendStatus(statusCode: number): void;
    /**
     * Sets the status code of the current response Object.
     * @param statusCode
     * @returns {uResponse}
     */
    status(statusCode: HTTPStatusCodes): uResponse;
    send(payload?: any): void;
}
