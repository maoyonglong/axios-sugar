import { AxiosInstance, AxiosStatic } from 'axios';
import AxiosSugarConfig from '../AxiosSugarConfig';
import { AxiosSugarStorage, AxiosSugarInnerStorage } from '../AxiosSugarStorage';
import AxiosSugarRequestStack from '../RequestStack';
import responseInterceptors from './ResponseInterceptors';
import requestInterceptors from './Requestinterceptors';
import AxiosSugarLifeCycle from '../AxiosSugarLifeCycle';

interface AxiosSugarOptions {
  config?: AxiosSugarConfig;
  storage?: AxiosSugarStorage;
  lifecycle?: AxiosSugarLifeCycle;
}

export default class AxiosSugar {
  private stack: AxiosSugarRequestStack = new AxiosSugarRequestStack();
  axios: AxiosInstance | AxiosStatic;
  config: AxiosSugarConfig = new AxiosSugarConfig();
  storage: AxiosSugarStorage = new AxiosSugarInnerStorage();
  lifecycle: AxiosSugarLifeCycle = new AxiosSugarLifeCycle();
  constructor (axios: AxiosInstance | AxiosStatic, options: AxiosSugarOptions = {}) {
    this.axios = axios;
    ['config', 'storage', 'lifecycle'].forEach(option => {
      if (options[option]) {
        this[option] = options[option];
      }
    });
    this.init();
  }
  private init () {
    requestInterceptors(this, this.stack);
    responseInterceptors(this, this.stack);
  }
}