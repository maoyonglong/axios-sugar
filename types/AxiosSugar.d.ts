import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { AxiosSugarConfig } from './default';
export interface AxiosSugar {
    requestConfigs: Array<AxiosRequestConfig>;
    config: AxiosSugarConfig;
    axiosInstance: AxiosInstance;
    injectProp: string;
    setConfig: Function;
    injectReqConfig: Function;
    beforeRequest: Function;
    beforeResponse: Function;
    beforeSuccess: Function;
    beforeError: Function;
    getStore: Function;
    clear: Function;
}
declare const axiosSugar: AxiosSugar;
export default axiosSugar;
