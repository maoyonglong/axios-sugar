import { AxiosRequestConfig } from 'axios/index';
import { MiddleRequestConfig } from './dispatchRequest';
import { AxiosSugarConfig } from '../defaults';
export declare function genSymbol(config: AxiosRequestConfig): string;
export declare function isInInterval(sendingTime: number, completeTime: number, interval: number): Boolean;
export declare function repeatTag(axiosConfig: AxiosRequestConfig, config?: AxiosSugarConfig): string;
export default function (config: MiddleRequestConfig): number;
