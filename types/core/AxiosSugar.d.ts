import { AxiosSugarConfig } from '../defaults';
import { AxiosSugarInterceptorManager } from './AxiosSugarInterceptorManager';
import { AxiosRequestConfig, AxiosInstance } from 'axios/index';
import { MiddleRequestConfig } from './dispatchRequest';
import { repeatTag } from './repeat';
import HttpStatusProcessor from './HttpStatusProcessor';
import { MiddleResponseError } from './dispatchRequest';
export interface Interceptors {
    request: AxiosSugarInterceptorManager;
    response: AxiosSugarInterceptorManager;
}
declare type Event = 'retried' | 'retryFailed' | 'stored' | 'repeated' | 'offline' | 'onlineTimeout' | 'online';
declare type Events = {
    [key in Event]: Function;
} | {};
interface spreadCallback {
    (...args: unknown[]): any;
}
interface CancelConfig {
    cancel: Function;
    config: MiddleRequestConfig;
}
export declare class AxiosSugar {
    axios: AxiosInstance;
    interceptors: Interceptors;
    config: AxiosSugarConfig;
    events: Events;
    httpStatusProcessor: HttpStatusProcessor;
    [key: string]: any;
    get: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    post: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    head: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    options: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    delete: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    put: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    patch: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
    request(axiosConfig: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig): Promise<any>;
    request(url: string, axiosConfig?: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig): Promise<any>;
    on(event: Event, fn: Function): void;
    off(event: Event, fn: Function): boolean;
    constructor(axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig);
}
declare class AxiosSugarStatic extends AxiosSugar {
    defaults: AxiosSugarConfig;
    axiosDefaults: AxiosRequestConfig;
    axios: AxiosInstance;
    static AxiosSugarStatic: (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => AxiosSugar;
    [key: string]: any;
    create(axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig): AxiosSugar;
    repeatTag: typeof repeatTag;
    isCancel(err: MiddleResponseError): boolean;
    getUri(config: AxiosRequestConfig): string;
    spread(fn: spreadCallback): (array: unknown[]) => any;
    all(...args: unknown[]): Promise<unknown[]>;
    cancelAll(): void;
    cancelFilter(cancelConfigs: Array<CancelConfig>): Array<CancelConfig>;
    cancelAutoRetry(err: MiddleResponseError): void;
    constructor();
}
export declare const SugarStatic: AxiosSugarStatic;
export {};
