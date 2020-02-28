import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import compare, { getCompareSymbol } from './compare';
import defaultConfig, { AxiosSugarConfig } from './default';
import { merge, capitalize } from './utils';
import Store, { AxiosSugarStore } from './AxiosSugarStore';

export interface AxiosSugar {
  requestConfigs: Array<AxiosRequestConfig>;
  config: AxiosSugarConfig;
  axiosInstance: AxiosInstance;
  injectProp: string;
  setConfig: Function;
  injectReqConfig: Function;
  beforeRequest: Function;
  beforeResponse: Function;
  beforeSuccess: Function;
  beforeError: Function;
  getStore: Function;
  clear: Function;
}

const axiosSugar: AxiosSugar = {
  requestConfigs: [],
  config: defaultConfig,
  axiosInstance: null,
  injectProp: "reqConf",
  clear (): void {
    this.requestConfigs.forEach(c => {
      c[this.injectProp].cancelTokenSource.cancel();
    });
  },
  getStore (): AxiosSugarStore {
    return Store;
  },
  setConfig (config: AxiosSugarConfig): void {
    this.config = merge(defaultConfig, config);
  },
  injectReqConfig (reqConfig: AxiosRequestConfig): AxiosRequestConfig {
    const { resend } = this.config;
    const injectProp = this.injectProp;
    if (resend && !reqConfig[injectProp].resendCount) {
      reqConfig[injectProp].resendCount = 0;
    }
    reqConfig[injectProp].cancelTokenSource = axios.CancelToken.source();
    return reqConfig;
  },
  beforeRequest () {
    axios.interceptors.request.use((config): Promise<AxiosRequestConfig> => {
      const {compareRule, store} = this.config;
      const injectProp = this.injectProp;
      config[injectProp] = config[injectProp] || {};
      if (store) {
        const symbol = getCompareSymbol(compareRule, injectProp, config);
        const saved = Store.contains(symbol);
        if (saved) {
          return Promise.reject({
            reason: "saved",
            message: "this request has been saved.",
            res: Store.get(symbol)
          });
        }
      }
      const existed = compare(compareRule, injectProp, config, this.requestConfigs);
      if (existed) {
        return Promise.reject({
          reason: "existed",
          message: "a same request has been already sent, waiting for response."
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
    axios.interceptors.response.use(this.beforeSuccess.bind(this), this.beforeError.bind(this));
  },
  beforeSuccess (res: any): Promise<any> {
    const {compareRule, store} = this.config;
    const requestConfigs = this.requestConfigs;
    const reqConfig = res.config;
    const symbol = getCompareSymbol(compareRule, this.injectProp, reqConfig);
    const confIdx = requestConfigs.indexOf(reqConfig);
    requestConfigs.splice(confIdx, 1);
    if (store) {
      const existed = Store.contains(symbol);
      if (!existed) {
        Store.save(symbol, res);
      }
    }
    return Promise.resolve(res);
  },
  beforeError (err: any): Promise<any> {
    // give up the no sending request
    if (err.reason) {
      this['on' + capitalize(err.reason)].call(this, err);
      return;
    }
    const {resend, resendDelay, resendNum} = this.config;
    const reqConfig = err.response.config;
    const axiosInstance = this.axiosInstance || axios;
    // remove the config in requestConfigs and wait for resending.
    const requestConfigs = this.requestConfigs;
    const confIdx = requestConfigs.indexOf(reqConfig);
    requestConfigs.splice(confIdx, 1);
    if (resend && reqConfig[this.injectProp].resendCount < resendNum) {
      reqConfig[this.injectProp].resendCount++;
      setTimeout(() => {
        axiosInstance.request(reqConfig);
      }, resendDelay);
    }
    return Promise.reject(err);
  }
};

// no send callback
["Saved", "Existed"].forEach(reason => {
  axiosSugar['on' + reason] = (err) => {
    console.log(`[No Send]: ${err.reason} - ${err.message}`);
  };
});

// init lifecycles
axiosSugar.beforeRequest.bind(axiosSugar)();
axiosSugar.beforeResponse.bind(axiosSugar)();

export default axiosSugar;