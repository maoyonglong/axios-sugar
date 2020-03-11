import AxiosSugarRequestStack from "../RequestStack";
import { genSymbol, notUndef, normalizeProp } from './utils';
import AxiosSugar from "./AxiosSugar";
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

  axios.interceptors.request.use(config => {
    config = normalizeProp(config, conf.prop);

    if (stack.contains(config)) {
      error = { reason: 'existed' };
      return Promise.reject(error);
    }

    // get custom options
    const custom = config[conf.prop];
    let isSave = conf.isSave;
    if (custom) {
      isSave = notUndef(custom.isSave, isSave);
    }
    if (isSave) {
      const storageRes = storage.get(genSymbol(config));
      if (storageRes) {
        error = { reason: 'saved', data: storageRes };
        return Promise.reject(error);
      }
    }

    const cycleRes = lifecycle.beforeRequest(config);

    if (!cycleRes.state) {
      error = { reason: 'beforeRequestBreak', message: cycleRes.message };
      return Promise.reject(error);
    }

    // send request
    stack.push(config);
    return Promise.resolve(config);
  }, err => {
    Promise.reject(err);
  });
}