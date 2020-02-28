import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { AxiosSugarConfig } from './default';
export interface AxiosSugar {
    requestConfigs: Array<AxiosRequestConfig>;
    config: AxiosSugarConfig;
    _axios: AxiosInstance;
    injectProp: string;
    setConfig(config: AxiosSugarConfig): any;
    injectReqConfig(config: AxiosRequestConfig): any;
    beforeRequest: Function;
    beforeResponse: Function;
    beforeSuccess: Function;
    beforeError: Function;
}
declare const axiosSugar: AxiosSugar;
export default axiosSugar;
