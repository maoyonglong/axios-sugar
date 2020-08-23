import defaults, { AxiosSugarConfig } from '../defaults';
import axios from 'axios'
import { AxiosSugarInterceptorManager } from './AxiosSugarInterceptorManager';
import { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios/index';
import dispatchRequest, { MiddleRequestConfig } from './dispatchRequest'
import initInterceptors from './initInterceptors';
import { repeatTag } from './repeat';
import HttpStatusProcessor from './HttpStatusProcessor';
import MiddleData from './MiddleData';
import { isFn } from './utils';
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
  request: (axiosConfig?: AxiosRequestConfig | MiddleResponseError, config?: AxiosSugarConfig) => Promise<any>;
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
}

export class AxiosSugar extends AxiosSugarPrototype {
  axios: AxiosInstance;
  interceptors: Interceptors;
  config: AxiosSugarConfig;
  events: Events;
  // 兼容axios的axios.get()和axios.get('', {})的写法，只在后面添加一个自定义的参数
  // axiosSugar.get({}, {timeout: 1000})和axios.get('', {}, {timeout: 1000})
  constructor (axiosConfig?: AxiosRequestConfig, config?: AxiosSugarConfig) {
    super();
    // config.axios可以是undefined
    this.axios = axios.create(axiosConfig);
    this.config = config || Object.assign({}, defaults);
    this.events = {};
    this.interceptors = {
      request: new AxiosSugarInterceptorManager(),
      response: new AxiosSugarInterceptorManager()
    };
    // 初始化当前拦截器
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

AxiosSugar.prototype.request = function (
  // MiddleResponseError is used to retry
  axiosConfig?: AxiosRequestConfig | MiddleResponseError,
  config?: AxiosSugarConfig
): Promise<any> {
  config = config ? deepMerge(defaults, config) : this.config;

  const chain = [dispatchRequest.bind(this), undefined];

  const middleResponseError = (axiosConfig as MiddleResponseError);

  const data = middleResponseError.count ? {
    axios: axiosConfig,
    sugar: config,
    cancelDisabled: false
  } : {
    axios: middleResponseError.axios,
    sugar: middleResponseError.sugar,
    count: ++middleResponseError.count
  }

  // dispatch data to dispatchRequest and interceptors
  let promise: Promise<any> = Promise.resolve(data);

  this.interceptors.request.each((interceptor) => {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  })

  this.interceptors.response.each((interceptor) => {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  })

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  
  return promise;
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
