import { MiddlewareFunction } from './middleware';
export interface RouterChild {
    prefix: string;
    router: Function;
}
export interface RouterConfig {
    prefix?: string;
    children?: RouterChild[];
    middleware?: MiddlewareFunction[];
}
export interface PartyStack {
    routerName: string;
    routerStack: any[];
}
export declare const PartyRouterStack: PartyStack[];
export declare function MicroRouter(config?: RouterConfig): (target: any) => any;
