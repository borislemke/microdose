/// <reference types="node" />
import { IncomingMessage } from 'http';
export interface MicroRequest extends IncomingMessage, MicroRequestBuilder {
}
export declare class MicroRequestBuilder {
    native: IncomingMessage;
    body: any;
    local: any;
    params: any;
    constructor(request: any);
    static create(req: IncomingMessage): MicroRequest;
}
