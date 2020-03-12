import { AxiosRequestConfig } from '../vendor/axios';
import { isDef } from '../utils';

// where the sending data in ? (params or data)
function sendDataWay (method: string): 'data' | 'params' | 'both' {
  const isInData = ['post', 'put', 'patch'].indexOf(method) >= 0,
    isInParams = method === 'get';
  return isInData ? 'data' : (isInParams ? 'params' : 'both');
}

export function normalizeProp (config: AxiosRequestConfig, prop = 'custom'): AxiosRequestConfig {
  // if custom prop in data
  if (sendDataWay(config.method) === 'data' && config.data) {
    const propVal = config.data[prop];
    if (propVal) {
      config[prop] = propVal;
      delete config.data[prop];
    }
  }
  return config;
}

export function genSymbol (config: AxiosRequestConfig): string {
  let { url } = config;
  const { method } = config;
  // the data send before
  let data;

  function getParamsSymbolData (params: object): string {
    let data = '';
    if (/\?/.test(url)) {
      const part = url.split('?');
      url = part[0];
      data += part[1];
    }
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (data !== '') data += '&';
        data += `${key}=${val}`;
      }
    }
    return data;
  }

  function getDataSymbolData (data: object): string {
    return isDef(data) ? JSON.stringify(data) : '';
  }

  // get the sent data
  switch (sendDataWay(method)) {
    case 'params':
      data = getParamsSymbolData(config.params);
      break;
    case 'data':
      data = getDataSymbolData(config.data);
      break;
    case 'both':
      data = getParamsSymbolData(config.params) || getDataSymbolData(config.params);
  }

  return `method=${method}&url=${url}&data=${data}`;
}

export function notUndef<T = any, D = any> (targetVal: T, defaultVal: D): T | D {
  return typeof targetVal === 'undefined' ? defaultVal : targetVal;
}
