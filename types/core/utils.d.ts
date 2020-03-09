import { AxiosRequestConfig } from 'axios';
export declare function genSymbol(config: AxiosRequestConfig): string;
export declare function notUndef<T = any, D = any>(targetVal: T, defaultVal: D): T | D;