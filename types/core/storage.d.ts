import { MiddleRequestConfig, MiddleResponseConfig } from './dispatchRequest';
import { AxiosResponse } from 'axios/index';
export interface StorageData {
    response: AxiosResponse;
    time: number;
    [key: string]: any;
}
declare const _default: {
    get(config: MiddleRequestConfig): StorageData | null;
    set(config: MiddleResponseConfig): boolean;
};
export default _default;
