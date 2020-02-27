import { AxiosSugarRequest, AxiosSugarRequestConfig } from './request';
import { AxiosStatic, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
interface AxiosSugarConfig extends AxiosSugarRequestConfig {
    interval: number;
}
declare class AxiosSugar {
    private _queue;
    private _waitQueue;
    private _interval;
    createRequest(_axios: AxiosStatic | AxiosInstance, config?: AxiosSugarConfig): AxiosSugarRequest;
    _preSend(request: AxiosSugarRequest): boolean;
    _then(response: AxiosResponse, request: AxiosSugarRequest): void;
    _catch(error: AxiosError, request: AxiosSugarRequest): void;
}
export default AxiosSugar;
