import { AxiosRequestConfig, AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import compare from './compare';
import { rule, getCompareSymbol } from './compare';
import defaultConfig from './default';
import { AxiosSugarConfig } from './default';
// import { merge } from 'axios/lib/utils';
import Store from './AxiosSugarStore';
const { merge } = require('axios/lib/utils');

export interface AxiosSugar {
  requestConfigs: Array<AxiosRequestConfig>;
  config: AxiosSugarConfig;
  _axios: AxiosInstance;
  injectProp: string;
  setConfig (config: AxiosSugarConfig);
  injectReqConfig (config: AxiosRequestConfig);
  beforeRequest: Function;
  beforeResponse: Function;
  beforeSuccess: Function;
  beforeError: Function;
}

const axiosSugar: AxiosSugar = {
  requestConfigs: [],
  config: null,
  _axios: null,
  injectProp: 'reqConf',
  setConfig (config: AxiosSugarConfig): AxiosSugar {
    this.config = merge(defaultConfig, config);
    return this;
  },
  injectReqConfig (reqConfig: AxiosRequestConfig): AxiosRequestConfig {
    const { resend } = this.config;
    if (resend) {
      reqConfig[this.injectProp].resendCount = 0;
    }
    return reqConfig;
  },
  beforeRequest () {
    const {compareRule, store} = this.config;
    axios.interceptors.request.use((config): Promise<AxiosRequestConfig> => {
      const injectProp = this.injectProp;
      config[injectProp] = {};
      if (store) {
        const symbol = getCompareSymbol(compareRule, injectProp, config);
        const saved = Store.contains(symbol);
        if (saved) {
          return Promise.reject({
            reason: 'saved',
            res: Store.get(symbol)
          });
        }
      }
      const existed = compare(compareRule, injectProp, config, this.requestConfigs);
      if (existed) {
        return Promise.reject({
          reason: 'existed'
        });
      } else {
        config = this.injectReqConfig(config)
        this.requestConfigs.push(config);
        return Promise.resolve(config);
      }
    }, (err) => {
      Promise.reject(err);
    });
  },
  beforeResponse () {
    axios.interceptors.response.use(this.beforeSuccess, this.beforeError);
  },
  beforeSuccess (res: AxiosResponse) {
    const {compareRule, store} = this.config;
    const symbol = getCompareSymbol(compareRule, this.injectProp, res.config);
    if (store) {
      const existed = Store.contains(symbol);
      if (!existed) {
        Store.save(symbol, res);
      }
    }
  },
  beforeError (err: AxiosError) {
    const {resend, resendDelay, resendNum} = this.config;
    const reqConfig = err.response.config;
    const _axios = this._axios || axios;
    // remove the config in requestConfigs and wait for resending.
    const requestConfigs = this.requestConfigs;
    const confIdx = requestConfigs.indexOf(reqConfig);
    requestConfigs.splice(confIdx, 1);
    if (resend && reqConfig[this.injectProp].resendCount < resendNum) {
      reqConfig[this.injectProp].resendCount++;
      setTimeout(() => {
        _axios.request(reqConfig);
      }, resendDelay);
    }
  }
};

// init lifecycles
axiosSugar.beforeRequest();
axiosSugar.beforeResponse();

export default axiosSugar;