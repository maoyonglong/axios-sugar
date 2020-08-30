import { AxiosRequestConfig } from 'axios/index';
import { MiddleRequestConfig } from './dispatchRequest';
import { AxiosSugarConfig } from '../defaults';
import axios from 'axios';
import MiddleData from './MiddleData';
import { isDef, isFn, getDurationMS, deepMerge, throwError } from './utils';
import { AxiosSugar, SugarStatic } from './AxiosSugar';
import { dataDestory } from './MiddleData';

// where the sending data in ? (params or data)
function sendDataWay (method: string): 'data' | 'params' {
  const isInData = ['post', 'put', 'patch'].indexOf(method) >= 0;
  return isInData ? 'data' : 'params';
}

function querystring (url) {
  const result = {};
  const index = url.indexOf('?');
  if (index >= 0) {
    const arr = url.trim().substring(url.indexOf()).split('&');
    arr.forEach(item => {
      const arr = item.trim().split('=');
      if (arr.length === 1) {
        result[arr[0]] = '';
      } else {
        result[arr[0]] = result[arr[1]];
      }
    });
  }

  return result;
}

function getDataString (data) {
  return data ? JSON.stringify(data) : '';
}

export function genSymbol (config: AxiosRequestConfig): string {
  const { url } = config;
  const { method } = config;
  // the data send before
  let data;

  // get the sent data
  switch (sendDataWay(method)) {
    case 'params': {
      data = config.params || {};
      if (method === 'get') {
        data = deepMerge(querystring(url), data);
      }

      data = getDataString(data);

      break;
    }
    case 'data': data = getDataString(config.data);
  }

  return `method=${method}&url=${url}&data=${data}`;
}

export function isInInterval (sendingTime: number, completeTime: number, interval: number): boolean {
  return getDurationMS(completeTime, sendingTime) < interval;
}

export function repeatTag (
  axiosConfig: AxiosRequestConfig,
  config?: AxiosSugarConfig
): string {
  return genSymbol(axiosConfig);
}

export default function (
  config: MiddleRequestConfig
): number {
  const tag = SugarStatic.repeatTag(config.axios, config.sugar);
  let i = MiddleData.tags.indexOf(tag);

  // destory exceeded records
  if (
    i >= 0 &&
    // maybe the previous request hasn't been sent
    MiddleData.configs[i].sendingTime &&
    !isInInterval(
      MiddleData.configs[i].sendingTime,
      new Date().getTime(),
      config.sugar.repeat.interval
    )
  ) {
    dataDestory(i);
    // tag has been destoryed
    i = -1;
  }

  // call repeated
  const callRepeated = () => {
    const repeated = (this as AxiosSugar).events['repeated'];
    if (isFn(repeated)) {
      repeated.call(this, config);
    }
  };

  // if repeat
  if (i >= 0) {
    // if the previous request has been completed
    if (MiddleData.configs[i] && MiddleData.configs[i].completeTime) {
      callRepeated();
      // throw an error to cancel current request
      throwError('The current request is repeated.');
    } else {
      // cancel the repeated request sent before
      MiddleData.cancels[i]('The previous request is repeated.');
      MiddleData.tags[i] = null;
      MiddleData.cancels[i] = null;
      callRepeated();
    }
  }

  const source = axios.CancelToken.source();
  config.axios.cancelToken = source.token;
  MiddleData.cancels.push(source.cancel);

  return MiddleData.tags.push(tag) - 1;
}