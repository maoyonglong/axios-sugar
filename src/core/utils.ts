import { AxiosRequestConfig } from 'axios';

export function genSymbol (config: AxiosRequestConfig) {
  let { method, url } = config
  // the data send before
  let data

  // get the sent data
  switch (method) {
    case 'get':
      data = ''
      if (/\?/.test(url)) {
        const part = url.split('?')
        url = part[0]
        data += part[1]
      }
      if (config.params) {
        for (let [key, val] of Object.entries(config.params)) {
          if (data !== '') data += '&'
          data += `${key}=${val}`
        }
      }
      break
    case 'post':
      data = JSON.stringify(config.data)
      break
  }

  return `method=${method}&url=${url}&data=${data}`
}

export function notUndef<T = any, D = any> (targetVal: T, defaultVal: D): T | D {
  return typeof targetVal === 'undefined' ? defaultVal : targetVal
}