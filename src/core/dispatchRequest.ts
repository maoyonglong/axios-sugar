import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios/index';
import { AxiosSugarConfig } from '../defaults';
import storage from './storage';

export interface MiddleRequestConfig {
  axios: AxiosRequestConfig;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  sendingTime: number;
  cacheTime?: number;
  completeTime: number;
}

export interface MiddleResponseConfig {
  completeTime: number;
  response: AxiosResponse;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  sendingTime: number;
  cacheTime?: number;
}

export class MiddleResponseError extends Error {
  reason: AxiosError | Error;
  axios: AxiosRequestConfig;
  sugar: AxiosSugarConfig;
  index: number;
  count?: number;
  sendingTime: number;
  completeTime: number;
  cacheTime?: number;
  isAxiosSugarError: boolean;
  name: string;

  constructor (reason, config) {
    super(reason.message);
    this.name = new.target.name;
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, new.target);
    }
    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      (this as any).__proto__ = new.target.prototype;
    }
    this.reason = reason;
    this.axios = config.axios;
    this.index = config.index;
    this.sugar = config.sugar;
    this.count = config.count;
    this.sendingTime = config.sendingTime;
    this.completeTime = config.completeTime;
    this.isAxiosSugarError = true;
  }
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
      cacheTime: cache.time,
      completeTime: new Date().getTime()
    });
  } else {
    return this.axios.request(config.axios).then((response) => {
      config.completeTime = new Date().getTime();

      return {
        response,
        sugar: config.sugar,
        index: config.index,
        sendingTime: config.sendingTime,
        completeTime: config.completeTime
      };
    }, (reason) => {
      config.completeTime = new Date().getTime();

      const error = new MiddleResponseError(reason, config);

      return Promise.reject(error);
    });
  }
}
