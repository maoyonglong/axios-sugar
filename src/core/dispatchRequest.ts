import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios/index';
import { AxiosSugarConfig } from '../defaults';

export interface MiddleRequestConfig {
  axios: AxiosRequestConfig;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  cancelDisabled?: Boolean;
  sendingTime: number;
}

export interface MiddleResponseConfig {
  response: AxiosResponse;
  sugar: AxiosSugarConfig;
  index: number;
  sendingTime: number;
}

export interface MiddleResponseError {
  offlineTimer: NodeJS.Timeout | number;
  reason: AxiosError;
  axios: AxiosRequestConfig;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  sendingTime: number;
}

export default function (config: MiddleRequestConfig) {
  config.sendingTime = new Date().getTime();

  return this.axios.request(config.axios).then((response) => ({
    response,
    sugar: config.sugar,
    index: config.index
  }), (reason) => Promise.reject({
    reason,
    axios: config.axios,
    index: config.index,
    sugar: config.sugar,
    count: config.count,
    sendingTime: config.sendingTime
  }));
}