import { MiddleResponseError } from './dispatchRequest';
import { isNum, isFn } from './utils';
import { AxiosSugar } from './AxiosSugar';

export default function (config: MiddleResponseError) {
  const count = config.count;
  const _this = this as AxiosSugar;

  if (!isNum(count)) {
    config.count = 0;
  }

  if (
    isNum(config.sugar.retry.count) &&
    count <= config.sugar.retry.count
  ) {
    return new Promise((resolve) => {
     setTimeout(function () {
      resolve(_this.request(config));
     }, config.sugar.retry.delay);
    });
  } else {
    const retryFailed = _this.events['retryFailed'];

    if (isFn(retryFailed)) {
      retryFailed.call(_this, config);
    }

    return Promise.reject(config);
  }
}