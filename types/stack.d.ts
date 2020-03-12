import { AxiosRequestConfig, AxiosInstance, AxiosStatic } from 'axios';
export declare class Stack<el> {
    protected stack: el[];
    push(el: el): number;
    pop(): el;
    contains(el: el): boolean;
    remove(el: el): el;
    indexOf(el: el): number;
}
export declare class AxiosSugarRequestStack extends Stack<AxiosRequestConfig> {
    forEach(cb: any): void;
}
declare type AxiosEl = AxiosStatic | AxiosInstance;
export declare class AxiosStack extends Stack<AxiosEl> {
}
export {};
