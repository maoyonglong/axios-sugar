import AxiosSugar from './AxiosSugar';
import AxiosSugarRequestStack from '../RequestStack';
import { notUndef, genSymbol } from './utils';
import { AxiosSugarError } from './SugarError';

export default function (
  sugar: AxiosSugar,
  stack: AxiosSugarRequestStack
) {
  const axios = sugar.axios;
  const storage = sugar.storage;
  const conf = sugar.config;
  const lifecycle = sugar.lifecycle;
  let error: AxiosSugarError | Error;

  axios.interceptors.response.use(res => {
    const config = res.config;
    const resData = res.data;

    let cycleRes = lifecycle.beforeResponse(res);
    if (!cycleRes.state) {
      error = { reason: 'beforeResponseBreack', message: cycleRes.message };
      return Promise.reject(error);
    }

    // get custom option
    const custom = config.custom;
    let isSave;
    if (custom) {
      isSave = notUndef(custom.isSave, conf.isSave);
    }

    // generate symbol string
    if (isSave) {
      const symbol = genSymbol(config);
      storage.set(symbol, resData);
    }

    return Promise.resolve(resData);
  }, err => {
    // if AxiosSugarError
    const reason = err.reason;
    if (reason) {
      switch (reason) {
        case 'existed':
          return;
        case 'saved':
          return Promise.resolve(err.data);
        case 'beforeRequestBreak':
        case 'beforeResponseBreak':
          return Promise.reject(err.message);
      }
    }

    const config = err.config;
    // axios error
    if (config) {
      // remove this request in stack
      stack.remove(config);

      // get custom options
      const custom = config[conf.prop];
      let isResend = conf.isResend,
        resendDelay = conf.resendDelay,
        resendTimes = conf.resendTimes,
        curResendTimes = 0;
      if (custom) {
        isResend = notUndef(custom.isResend, isResend);
        resendDelay = notUndef(custom.resendDelay, resendDelay);
        resendTimes = notUndef(custom.resendTimes, resendTimes);
        curResendTimes = notUndef(custom.curResendTimes, 0);
      }

      if (isResend && curResendTimes < resendTimes) {
        setTimeout(() => {
          if (!custom) {
            config.custom = {};
          }
          config.custom.curResendTimes = ++curResendTimes;
          axios.request(config);
        }, resendDelay);
        error = {reason: 'timeout', message: `current resend times is ${curResendTimes}.`};
        return Promise.reject(error);
      } else {
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  });
}