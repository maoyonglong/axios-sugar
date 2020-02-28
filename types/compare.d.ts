import { AxiosRequestConfig } from 'axios';
export declare type csymbol = string | number;
export declare type rule = 1 | 2;
export declare const getCompareSymbol: (rule: rule, injectProp: string, config: AxiosRequestConfig) => csymbol;
declare const _default: (rule: rule, injectProp: string, target: any, source: any[]) => boolean;
export default _default;
