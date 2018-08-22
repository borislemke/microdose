export interface BootstrapConfig {
    port: number | string;
    turboMode?: boolean;
    server?: any;
}
export declare class uApp {
    static TURBO_MODE: boolean;
    static bootstrap(app: any, config?: BootstrapConfig): Promise<any>;
}
