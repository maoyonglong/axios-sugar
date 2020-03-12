import { AxiosRequestConfig, AxiosResponse } from './vendor/axios/index';

interface AxiosSugarLifeCycleResult {
  state: boolean;
  message: string;
}

export default class AxiosSugarLifeCycle {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  beforeRequest (conf: AxiosRequestConfig): AxiosSugarLifeCycleResult {
    return {
      state: true,
      message: ''
    };
  }
  beforeResponse (res: AxiosResponse): AxiosSugarLifeCycleResult {
    return {
      state: true,
      message: ''
    };
  }
}