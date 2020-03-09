import { AxiosRequestConfig, AxiosResponse } from 'axios';
interface AxiosSugarLifeCycleResult {
    state: boolean;
    message: string;
}
export default class AxiosSugarLifeCycle {
    beforeRequest(conf: AxiosRequestConfig): AxiosSugarLifeCycleResult;
    beforeResponse(res: AxiosResponse): AxiosSugarLifeCycleResult;
}
export {};