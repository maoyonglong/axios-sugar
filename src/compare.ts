import { AxiosRequestConfig } from 'axios';

/**
 * compare symbol
 */
export type csymbol = string | number;

/**
 * 1: compare by params and method (default)
 * 2. compare by rid(request id)
 */
export type rule =  1 | 2;

export const getCompareSymbol = (rule: rule = 1, injectProp: string, config: AxiosRequestConfig): csymbol => {
  if (rule === 1) {
    const method = config.method;
    // ignore some prop
    const conf = JSON.parse(JSON.stringify(config));
    delete conf.headers;
    delete conf.timeout;
    delete conf[injectProp];

    return JSON.stringify(conf);
  } else {
    return config[injectProp].rid;
  }
}

export default (rule: rule = 1, injectProp: string, target: any, source: Array<any>): boolean => {
  const tSymbol = getCompareSymbol(rule, injectProp, target);
  for (let s of Object.values(source)) {
    const sSymbol = getCompareSymbol(rule, injectProp, s);
    if (tSymbol === sSymbol) {
      return true;
    }
  }
  return false;
};
