import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios/index';
import { AxiosSugarConfig } from '../defaults';
export interface MiddleRequestConfig {
    axios: AxiosRequestConfig;
    sugar: AxiosSugarConfig;
    index: number;
    count?: number;
    sendingTime: number;
    cacheTime?: number;
    completeTime: number;
}
export interface MiddleResponseConfig {
    completeTime: number;
    response: AxiosResponse;
    sugar: AxiosSugarConfig;
    index: number;
    count?: number;
    sendingTime: number;
    cacheTime?: number;
}
export declare class MiddleResponseError extends Error {
    reason: AxiosError | Error;
    axios: AxiosRequestConfig;
    sugar: AxiosSugarConfig;
    index: number;
    count?: number;
    sendingTime: number;
    completeTime: number;
    cacheTime?: number;
    isAxiosSugarError: boolean;
    name: string;
    constructor(reason: any, config: any);
}
export default function (config: MiddleRequestConfig): Promise<MiddleResponseConfig | MiddleResponseError>;
