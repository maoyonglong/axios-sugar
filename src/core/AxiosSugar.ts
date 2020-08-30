import defaults, { AxiosSugarConfig } from '../defaults';
import axios from 'axios';
import { AxiosSugarInterceptorManager } from './AxiosSugarInterceptorManager';
import { AxiosRequestConfig, AxiosInstance } from 'axios/index';
import dispatchRequest, { MiddleRequestConfig } from './dispatchRequest';
import initInterceptors from './initInterceptors';
import { repeatTag } from './repeat';
import HttpStatusProcessor from './HttpStatusProcessor';
import MiddleData from './MiddleData';
import { isFn, isStr } from './utils';
import { merge } from './utils';
import mergeConfig from './mergeConfig';
import { MiddleResponseError } from './dispatchRequest';

const httpStatusProcessor = new HttpStatusProcessor();

export interface Interceptors {
  request: AxiosSugarInterceptorManager;
  response: AxiosSugarInterceptorManager;
}

type Event = 'retried' | 'retryFailed'
| 'stored' | 'repeated'
| 'offline' | 'onlineTimeout' | 'online';

type Events = {
  [key in Event]: Function;
} | {};

interface spreadCallback {
  (...args: unknown[]);
}

interface CancelConfig {
  cancel: Function;
  config: MiddleRequestConfig;
}

export class AxiosSugar {
  axios: AxiosInstance;
  interceptors: Interceptors;
  config: AxiosSugarConfig;
  events: Events;
  httpStatusProcessor: HttpStatusProcessor;
  // properties to static
  [key: string]: any;
  get: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  post: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  head: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  options: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  delete: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  put: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  patch: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;

  request (axiosConfig: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig): Promise<any>;
  request (url: string, axiosConfig?: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig): Promise<any>;
  request (...args): Promise<any> {
    let axiosConfig: AxiosRequestConfig | MiddleResponseError;
    let config: AxiosSugarConfig;
    const _this = this as unknown as AxiosSugar;

    if (isStr(args[0])) {
      axiosConfig = args[1] || {};
      (axiosConfig as AxiosRequestConfig).url = args[0];
      config = args[2];
    } else {
      axiosConfig = args[0] || {};
      config = args[1];
    }

    config = config ? mergeConfig(defaults, config) : _this.config;
  
    const chain = [dispatchRequest.bind(this), undefined];
  
    const middleResponseError = (axiosConfig as MiddleResponseError);

    const data = middleResponseError.isAxiosSugarError ? {
      axios: middleResponseError.axios,
      sugar: middleResponseError.sugar,
      count: middleResponseError.count
    } : {
      axios: axiosConfig,
      sugar: config
    };
  
    // dispatch data to dispatchRequest and interceptors
    let promise: Promise<any> = Promise.resolve(data);
  
    _this.interceptors.request.each((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
  
    _this.interceptors.response.each((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
  
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    
    return promise;
  }

  on (event: Event, fn: Function) {
    this.events[event] = fn;
  }
  
  off (event: Event, fn: Function): boolean {
    if (this.events[event] === fn) {
      this.events[event] = undefined;
      return true;
    }
    return false;
  }
  // e.g. axiosSugar.get({}, {timeout: 1000})
  constructor (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) {
    this.httpStatusProcessor = httpStatusProcessor;
    this.axios = axios.create(axiosConfig);
    this.config = config || Object.assign({}, defaults);
    this.events = {};
    this.interceptors = {
      request: new AxiosSugarInterceptorManager(),
      response: new AxiosSugarInterceptorManager()
    };

    initInterceptors(this);
  }
}

['delete', 'get', 'head', 'options'].forEach(function (method) {
  AxiosSugar.prototype[method] = function (
    url: string,
    axiosConfig: AxiosRequestConfig,
    config: AxiosSugarConfig
  ) {
    return this.request(merge(axiosConfig || {}, {
      method: method,
      url: url
    }), config);
  };
});

['post', 'put', 'patch'].forEach(function (method) {
  AxiosSugar.prototype[method] = function (
    url: string, data,
    axiosConfig: AxiosRequestConfig,
    config: AxiosSugarConfig
  ) {
    return this.request(merge(axiosConfig || {}, {
      method: method,
      url: url,
      data: data
    }), config);
  };
});

class AxiosSugarStatic extends AxiosSugar {
  defaults: AxiosSugarConfig;
  axiosDefaults: AxiosRequestConfig;
  axios: AxiosInstance;
  static AxiosSugarStatic: (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => AxiosSugar;
  [key: string]: any;
  create (
    axiosConfig?: AxiosRequestConfig,
    config?: AxiosSugarConfig
  ): AxiosSugar {
    if (config) {
      config = mergeConfig(defaults, config);
    }
    return new AxiosSugar(axiosConfig, config);
  }
  
  repeatTag = repeatTag;
  
  isCancel (err: MiddleResponseError): boolean {
    if (err.reason) {
      return axios.isCancel(err.reason);
    } else {
      return false;
    }
  }
  
  getUri (config: AxiosRequestConfig) {
    return axios.getUri(config);
  }
  
  spread (fn: spreadCallback) {
    return axios.spread(fn);
  }
  
  all (...args: unknown[]) {
    return axios.all(args);
  }
  
  cancelAll (): void {
    let cancelConfigs: Array<CancelConfig> = [];

    MiddleData.configs.map(c => {
      if (c !== null) {
        cancelConfigs.push({
          cancel: MiddleData.cancels[c.index],
          config: c
        });
      }
    });
  
    if (isFn(this.cancelFilter)) {
      cancelConfigs = this.cancelFilter(cancelConfigs);
    }

    console.log(cancelConfigs)
  
    cancelConfigs.forEach(c => {
      c.cancel();
    });
  }

  cancelFilter (cancelConfigs: Array<CancelConfig>): Array<CancelConfig> {
    return cancelConfigs.filter((c) => !c.config.sugar.cancelDisabled);
  }
  
  cancelAutoRetry (err: MiddleResponseError) {
    err.sugar.retry.auto = false;
  }

  constructor () {
    super();
    this.defaults = defaults;
    this.axiosDefaults = axios.defaults;
    this.axios = axios;
  }
}

export const SugarStatic = new AxiosSugarStatic();
