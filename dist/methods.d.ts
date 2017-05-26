import { MiddlewareFunction } from './middleware';
export declare const MicroMethod: {
    Get: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Post: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Put: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Patch: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Delete: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
};
