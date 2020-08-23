import { AxiosRequestConfig } from 'axios/index';
import { MiddleRequestConfig } from './dispatchRequest';
import { AxiosSugarConfig } from '../defaults';
import axios from 'axios';
import MiddleData from './MiddleData';
import { isDef, isFn, getDurationMS } from './utils';
import { AxiosSugar } from './AxiosSugar';

// where the sending data in ? (params or data)
function sendDataWay (method: string): 'data' | 'params' | 'both' {
  const isInData = ['post', 'put', 'patch'].indexOf(method) >= 0,
    isInParams = method === 'get';
  return isInData ? 'data' : (isInParams ? 'params' : 'both');
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

export function isInInterval (sendingTime: number, interval: number): Boolean {
  return getDurationMS(new Date().getTime(), sendingTime) < interval;
}

export function repeatTag (
  axiosConfig: AxiosRequestConfig,
  config?: AxiosSugarConfig
): string {
  return genSymbol(axiosConfig);
}

// 判断是否重复请求
export default function (
  config: MiddleRequestConfig
): number {
  const tag = repeatTag(config.axios, config.sugar);
  const i = MiddleData.tags.indexOf(tag);

  // 取消之前的请求
  if (i >= 0) {
    MiddleData.cancels[i]();
    MiddleData.tags[i] = null;
    MiddleData.cancels[i] = null;
    const repeated = (this as AxiosSugar).events['repeated'];
    if (isFn(repeated)) {
      repeated.call(this, config);
    }
  }

  const source = axios.CancelToken.source();
  config.axios.cancelToken = source.token;
  MiddleData.cancels.push(source.cancel);

  return MiddleData.tags.push(tag) - 1;
}