import defaults, { AxiosSugarConfig } from '../defaults';
import axios from 'axios';
import { AxiosSugarInterceptorManager } from './AxiosSugarInterceptorManager';
import { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios/index';
import dispatchRequest, { MiddleRequestConfig } from './dispatchRequest'
import initInterceptors from './initInterceptors';
import { repeatTag } from './repeat';
import HttpStatusProcessor from './HttpStatusProcessor';
import MiddleData from './MiddleData';
import { isFn, isNum, isStr } from './utils';
import { deepMerge, merge } from './utils';
import { MiddleResponseError } from './dispatchRequest';

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


class AxiosSugarPrototype {
  defaults: AxiosSugarConfig;
  axiosDefaults: AxiosRequestConfig;
  httpStatusProcessor: HttpStatusProcessor;
  create: (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => AxiosSugar;
  get: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  post: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  head: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  options: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  delete: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  put: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  patch: (url: string, axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => Promise<any>;
  on: (event: Event, fn: Function) => void;
  off: (event: Event, fn: Function) => Boolean;
  repeatTag: (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) => string;
  isCancel: (err: AxiosError) => Boolean;
  cancelAll: () => void;
  cancelFilter: (cancelConfigs: Array<CancelConfig>) => Array<CancelConfig>;

  constructor () {
    this.httpStatusProcessor = new HttpStatusProcessor();
    this.defaults = defaults;
    this.axiosDefaults = axios.defaults;
  }

  request (axiosConfig: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig): Promise<any>;
  request (url: string, axiosConfig?: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig): Promise<any>;
  request (...args): Promise<any> {
    let axiosConfig: AxiosRequestConfig | MiddleResponseError;
    let config: AxiosSugarConfig;
    const _this = this as unknown as AxiosSugar

    if (isStr(args[0])) {
      axiosConfig = args[1] || {};
      (axiosConfig as AxiosRequestConfig).url = args[0];
      config = args[2];
    } else {
      axiosConfig = args[0] || {};
      config = args[1];
    }

    config = config ? deepMerge(defaults, config) : _this.config;
  
    const chain = [dispatchRequest.bind(this), undefined];
  
    const middleResponseError = (axiosConfig as MiddleResponseError);

    const data = middleResponseError.isAxiosSugarError ? {
      axios: middleResponseError.axios,
      sugar: middleResponseError.sugar,
      count: isNum(middleResponseError.count) ? ++middleResponseError.count : middleResponseError.count
    } : {
      axios: axiosConfig,
      sugar: config,
      cancelDisabled: false
    };
  
    // dispatch data to dispatchRequest and interceptors
    let promise: Promise<any> = Promise.resolve(data);
  
    _this.interceptors.request.each((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    })
  
    _this.interceptors.response.each((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    })
  
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    
    return promise;
  }
}

export class AxiosSugar extends AxiosSugarPrototype {
  axios: AxiosInstance;
  interceptors: Interceptors;
  config: AxiosSugarConfig;
  events: Events;
  // e.g. axiosSugar.get({}, {timeout: 1000})
  constructor (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) {
    super();
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

AxiosSugar.prototype.create = function (
  axiosConfig?: AxiosRequestConfig,
  config?: AxiosSugarConfig
): AxiosSugar {
  if (config) {
    config = deepMerge(defaults, config);
  }
  return new AxiosSugar(axiosConfig, config);
};

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

AxiosSugar.prototype.repeatTag = repeatTag;

AxiosSugar.prototype.on = function (event: Event, fn: Function) {
  this.events[event] = fn;
};

AxiosSugar.prototype.off = function (event: Event, fn: Function): Boolean {
  if (this.events[event] === fn) {
    this.events[event] = undefined;
    return true;
  }
  return false;
}

AxiosSugar.prototype.isCancel = function (err: AxiosError): Boolean {
  return axios.isCancel(err);
}

interface CancelConfig {
  cancel: Function;
  config: MiddleRequestConfig;
}

AxiosSugar.prototype.cancelAll = function (): void {
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

  cancelConfigs.forEach(c => {
    c.cancel();
  });
}

AxiosSugar.prototype.cancelFilter = function (cancelConfigs: Array<CancelConfig>): Array<CancelConfig> {
  return cancelConfigs.filter((c) => !c.config.cancelDisabled);
}
