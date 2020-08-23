import { AxiosSugar } from './AxiosSugar';
import { MiddleRequestConfig, MiddleResponseConfig, MiddleResponseError } from './dispatchRequest';
import MiddleData from './MiddleData';
import { isFn } from './utils';
import repeat, { isInInterval } from './repeat';
import storage from './storage';

export default function initInterceptors (axiosSugar: AxiosSugar) {
  axiosSugar.interceptors.request.use((config: MiddleRequestConfig) => {
    MiddleData.configs.push(config);

    // handle repeated requests
    config.index = repeat.bind(axiosSugar, config);

    // handle storage
    storage.get(config);

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
    if (isInInterval(config.sendingTime, config.sugar.repeat.interval)) {
      MiddleData.configs[config.index] = null;

      if (MiddleData.tags[config.index] !== null) {
        MiddleData.tags[config.index] = null;
        MiddleData.cancels[config.index] = null;
      }
    }

    return axiosSugar.httpStatusProcessor.dispatch.call(this, config.response.status, config);
  }, (err: MiddleResponseError) => {
    let result = err;

    // destory middle data about this request
    if (
      err.reason &&
      isInInterval(err.sendingTime, err.sugar.repeat.interval)
    ) {
      MiddleData.configs[err.index] = null;

      if (MiddleData.tags[err.index] !== null) {
        MiddleData.tags[err.index] = null;
        MiddleData.cancels[err.index] = null;
      }
    }

    // only handle http-status-code error
    if (err.reason.response) {
      result = axiosSugar.httpStatusProcessor.dispatch.call(this, err.reason.response.status, err);
    }

    return result instanceof Promise ? result : Promise.reject(result || err);
  });
}