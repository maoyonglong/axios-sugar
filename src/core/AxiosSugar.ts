import { AxiosInstance, AxiosStatic } from '../vendor/axios';
import AxiosSugarConfig from '../AxiosSugarConfig';
import { AxiosSugarStorage, AxiosSugarInnerStorage } from '../AxiosSugarStorage';
import { AxiosSugarRequestStack, AxiosStack } from '../stack';
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
  private init (): void {
    requestInterceptors(this, this.stack);
    responseInterceptors(this, this.stack);
  }
}

// the axios has been used
const usedAxios = new AxiosStack();

export function factory (
  axios: AxiosInstance | AxiosStatic,
  options: AxiosSugarOptions = {}
): undefined | AxiosSugar {
  if (usedAxios.contains(axios)) {
    console.error('[axios-sugar]: an axios static or instance only can call factory once.');
  } else {
    usedAxios.push(axios)
    return new AxiosSugar(axios, options);
  }
}
