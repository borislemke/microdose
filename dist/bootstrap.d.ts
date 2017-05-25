export interface BootstrapConfig {
    port?: number;
    cluster?: boolean;
    useSocket?: boolean;
}
export declare const MicroBootstrap: (serverApp: any, config: number | BootstrapConfig) => void;
