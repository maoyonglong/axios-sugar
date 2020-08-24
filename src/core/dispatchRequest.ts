import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios/index';
import { AxiosSugarConfig } from '../defaults';
import storage from './storage';

export interface MiddleRequestConfig {
  axios: AxiosRequestConfig;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  cancelDisabled?: Boolean;
  sendingTime: number;
  cacheTime?: number;
}

export interface MiddleResponseConfig {
  response: AxiosResponse;
  sugar: AxiosSugarConfig;
  index: number;
  sendingTime: number;
  cacheTime?: number;
}

export interface MiddleResponseError {
  offlineTimer: NodeJS.Timeout | number;
  reason: AxiosError;
  axios: AxiosRequestConfig;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  sendingTime: number;
  cacheTime?: number;
  isAxiosSugarError: Boolean;
}

export default function (
  config: MiddleRequestConfig
): Promise<MiddleResponseConfig | MiddleResponseError> {
  const cache = config.sugar.save.enable ? storage.get(config) : null;
  config.sendingTime = new Date().getTime();

  if (cache !== null) {
    return Promise.resolve({
      response: cache.response,
      sugar: config.sugar,
      index: config.index,
      sendingTime: config.sendingTime,
      cacheTime: cache.time
    })
  } else {
    return this.axios.request(config.axios).then((response) => ({
      response,
      sugar: config.sugar,
      index: config.index,
      sendingTime: config.sendingTime
    }), (reason) => Promise.reject({
      reason,
      axios: config.axios,
      index: config.index,
      sugar: config.sugar,
      count: config.count,
      sendingTime: config.sendingTime,
      isAxiosSugarError: true
    }));
  }
}