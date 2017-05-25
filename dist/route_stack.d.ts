/// <reference types="node" />
import { MicroResponse } from './response';
import { MicroRequest } from './request';
import { IncomingMessage, ServerResponse } from 'http';
export interface StackItem {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    handler: (req: MicroRequest, res: MicroResponse) => void;
}
export interface RouteStackGroup {
    [method: string]: StackItem[];
}
export declare class RouteStackCompiler {
    /**
     * All path stack collected from the MicroMethod decorator will
     * end up here to be path-matched for each incoming request
     * @type {RouteStackGroup[]}
     * @private
     */
    private _routeStack;
    addStack(...stackItems: StackItem[]): void;
    /**
     * Make as efficient as possible, this is the only function
     * that is run to map incoming requests.
     * Treat this as the most performance sensitive function of all
     */
    matchRequest(req: IncomingMessage, res: ServerResponse): void;
}
export declare const RouteStack: RouteStackCompiler;
