import { MiddlewareFunction } from './middleware';
export declare const uMethods: {
    get: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    post: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    put: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    patch: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    delete: (methodPath?: string | Function, methodMiddleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
};
