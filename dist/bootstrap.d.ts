export interface BootstrapConfig {
    port?: number;
    cluster?: boolean;
    useSocket?: boolean;
    liteMode?: boolean;
}
export declare const MicroBootstrap: (serverApp: any, config?: number | BootstrapConfig) => void;
