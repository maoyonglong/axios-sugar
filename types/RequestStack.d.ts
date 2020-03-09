import { AxiosRequestConfig } from 'axios';
export default class AxiosSugarRequestStack {
    private confs;
    push(conf: AxiosRequestConfig): void;
    contains(conf: AxiosRequestConfig): boolean;
    remove(conf: AxiosRequestConfig): AxiosRequestConfig[];
    forEach(cb: any): void;
}
