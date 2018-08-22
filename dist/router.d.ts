import { MiddlewareFunction } from './middleware';
export interface IRouterConfig {
    prefix?: string;
    children?: any[];
    middleware?: MiddlewareFunction[];
}
export interface IPartyStack {
    routerName: string;
    routerStack: any[];
}
export declare const PartyRouterStack: IPartyStack[];
export declare function uRouter(config?: IRouterConfig): (target: any) => any;
