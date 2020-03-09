import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface AxiosSugarLifeCycleResult {
  state: boolean;
  message: string;
}

export default class AxiosSugarLifeCycle {
  beforeRequest (conf: AxiosRequestConfig): AxiosSugarLifeCycleResult {
    return {
      state: true,
      message: ''
    }
  }
  beforeResponse (res: AxiosResponse): AxiosSugarLifeCycleResult {
    return {
      state: true,
      message: ''
    }
  }
}