export interface BootstrapConfig {
    port?: number;
    liteMode?: boolean;
    server?: any;
}
export declare const MicroBootstrap: (serverApp: any, config?: number | BootstrapConfig, cb?: (err?: any) => void) => void;
