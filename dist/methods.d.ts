import { MiddlewareFunction } from './middleware';
export declare const MicroMethod: {
    Get: (route?: string | Function, middleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Post: (route?: string | Function, middleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Put: (route?: string | Function, middleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Patch: (route?: string | Function, middleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
    Delete: (route?: string | Function, middleware?: MiddlewareFunction) => (target: any, descriptorKey: string, descriptor: any) => any;
};
