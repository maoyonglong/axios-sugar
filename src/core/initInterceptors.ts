import { AxiosSugar } from './AxiosSugar';
import { MiddleRequestConfig, MiddleResponseConfig, MiddleResponseError } from './dispatchRequest';
import MiddleData, { dataDestory } from './MiddleData';
import { isFn, isDef } from './utils';
import repeat, { isInInterval } from './repeat';
import storage from './storage';
import { AxiosError } from 'axios';
import normalize from './normalizeHttpStatusProcessorResult';

export default function initInterceptors (axiosSugar: AxiosSugar) {
  axiosSugar.interceptors.request.use((config: MiddleRequestConfig) => {

    MiddleData.configs.push(config);

    // handle repeated requests
    config.index = repeat.call(axiosSugar, config);

    return config;
  }, (err: Error) => {
    return Promise.reject(err);
  });

  axiosSugar.interceptors.response.use((config: MiddleResponseConfig) => {
    // store response
    if (storage.set(config)) {
      const stored = axiosSugar.events['stored'];
      if (isFn(stored)) {
        stored.call(axiosSugar, config);
      }
    }

    // destory middle data about this request
    if (!isInInterval(config.sendingTime, config.completeTime, config.sugar.repeat.interval)) {
      dataDestory(config.index);
    }

    return axiosSugar.httpStatusProcessor.dispatch(
      axiosSugar,
      config.response.status.toString(),
      config
    );
  }, (err) => {
    let result: any = err;

    // destory middle data about this request
    if (
      (err.reason &&
      !isInInterval(err.sendingTime, err.completeTime, err.sugar.repeat.interval))
    ) {
      dataDestory(err.index);
    }

    // only handle http-status-code error
    if (err.reason && (err.reason as AxiosError).response) {
      result = axiosSugar.httpStatusProcessor.dispatch(
        axiosSugar,
        (err.reason as AxiosError).response.status.toString(),
        err
      );
    }

    result = normalize(result);

    // delete middle data when encountered repeated request
    if (result instanceof Promise && err.count >= 1) {
      dataDestory(err.index);
    }
    
    return result instanceof Promise ? result : Promise.reject(result || err);
  });
}