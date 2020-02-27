import AxiosSugarStore from './store';
import { AxiosStatic, AxiosResponse, CancelTokenSource, AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios/index';
interface AxiosSugarRequestThenHook {
    (response: AxiosResponse, request: AxiosSugarRequest): void;
}
interface AxiosSugarRequestPreSendHook {
    (request: AxiosSugarRequest): boolean;
}
interface AxiosSugarRequestCatchHook {
    (response: AxiosError, request: AxiosSugarRequest): void;
}
export interface AxiosSugarRequestConfig {
    rid?: string;
    resend?: boolean;
    resendDelay?: number;
    resendNum?: number;
    store?: boolean;
    abort?: boolean;
    source: CancelTokenSource;
    hooks: {
        _preSendCb: AxiosSugarRequestPreSendHook;
        _thenCb: AxiosSugarRequestThenHook;
        _catchCb: AxiosSugarRequestCatchHook;
    };
}
export declare class AxiosSugarRequest {
    private _axios;
    private _resendCount;
    private _store?;
    private _thenCb;
    private _catchCb;
    private _preSendCb;
    sending: boolean;
    finish: boolean;
    config: AxiosSugarRequestConfig;
    state: 'abort' | 'store';
    queueIdx: number;
    waitQueueIdx: number;
    interval: number;
    constructor(axios: AxiosStatic | AxiosInstance, config: AxiosSugarRequestConfig);
    getStore(): AxiosSugarStore | null;
    request(config: AxiosRequestConfig): Promise<AxiosResponse>;
    private _execute;
    private _addCancelToken;
}
export {};
