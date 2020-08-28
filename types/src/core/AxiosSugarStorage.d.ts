import { StorageData } from './storage';
export interface AxiosSugarStorage {
    data: {
        [key: string]: StorageData;
    };
    set: (tag: string, data: StorageData) => Boolean;
    get: (tag: string) => StorageData | null;
    [key: string]: any;
}
interface InnerStorageConfig {
    release?: boolean;
    duration?: number;
    limit?: number;
}
export declare class AxiosSugarInnerStorage implements AxiosSugarStorage {
    config: InnerStorageConfig;
    data: {
        [key: string]: StorageData;
    };
    constructor(config?: InnerStorageConfig);
    release(tag: string, data?: StorageData): void;
    full(tag: string, data: StorageData): void;
    set(tag: string, data: StorageData): Boolean;
    get(tag: string): StorageData | null;
}
export declare class AxiosSugarLocalStorage implements AxiosSugarStorage {
    data: {
        [key: string]: StorageData;
    };
    constructor();
    set(tag: string, data: StorageData): Boolean;
    get(tag: string): StorageData | null;
}
export {};
