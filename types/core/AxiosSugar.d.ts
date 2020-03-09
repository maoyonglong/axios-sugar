import { AxiosInstance, AxiosStatic } from 'axios';
import AxiosSugarConfig from '../AxiosSugarConfig';
import { AxiosSugarStorage } from '../AxiosSugarStorage';
import AxiosSugarLifeCycle from '../AxiosSugarLifeCycle';
interface AxiosSugarOptions {
    config?: AxiosSugarConfig;
    storage?: AxiosSugarStorage;
    lifecycle?: AxiosSugarLifeCycle;
}
export default class AxiosSugar {
    private stack;
    axios: AxiosInstance | AxiosStatic;
    config: AxiosSugarConfig;
    storage: AxiosSugarStorage;
    lifecycle: AxiosSugarLifeCycle;
    constructor(axios: AxiosInstance | AxiosStatic, options?: AxiosSugarOptions);
    private init;
}
export {};
