/// <reference types="node" />
import { uResponse } from './response';
import { uRequest } from './request';
import { IncomingMessage, ServerResponse } from 'http';
export interface StackItem {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    handler: (req: uRequest, res: uResponse) => void;
}
export interface RouteStackGroup {
    [method: string]: StackItem[];
}
export declare class RouteStackC {
    /**
     * All path stack collected from the MicroMethod decorator will
     * end up here to be path-matched for each incoming request.
     * Filtering by method first has significant performance impact
     * @type {RouteStackGroup[]}
     */
    routeStack: RouteStackGroup;
    addStack(...stackItems: StackItem[]): void;
    /**
     * Make as efficient as possible, this is the only function
     * that is run to map incoming requests.
     * Treat this as the most performance sensitive function of all
     */
    matchRequest(req: IncomingMessage, res: ServerResponse): void;
}
export declare const RouteStack: RouteStackC;
