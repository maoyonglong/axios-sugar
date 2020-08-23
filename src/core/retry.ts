import { MiddleResponseError } from './dispatchRequest';
import { isNum } from './utils';
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
    _this.events['retryFailed'].call(_this, config);
    return Promise.reject(config);
  }
}