import { MiddleResponseError } from './dispatchRequest';
import { isNum, isFn } from './utils';
import { AxiosSugar } from './AxiosSugar';

export default function (err: MiddleResponseError) {
  const _this = this as AxiosSugar;

  if (isNum(err.count)) {
    err.count += 1;
  } else {
    err.count = 1;
  }

  if (
    isNum(err.sugar.retry.count) &&
    err.count <= err.sugar.retry.count
  ) {
    const retried = _this.events['retried'];
    if (retried) {
      retried.call(_this, err);
    }
    return new Promise((resolve, reject) => {
     setTimeout(function () {
      reject(_this.request(err));
     }, err.sugar.retry.delay);
    });
  } else {
    const retryFailed = _this.events['retryFailed'];

    if (isFn(retryFailed)) {
      retryFailed.call(_this, err);
    }

    return new Error('[axios-sugar]: retryFiled.');
  }
}