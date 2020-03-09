import { isDef } from './utils';

export interface AxiosSugarConfigOptions {
  isResend?: boolean;
  resendDelay?: number;
  resendTimes?: number;
  isSave?: boolean;
  prop?: string;
}

export default class AxiosSugarConfig {
  isResend: boolean = false;
  resendDelay: number = 1000;
  resendTimes: number = 3;
  isSave: boolean = false;
  prop: string = 'custom';
  constructor (options?: AxiosSugarConfigOptions) {
    options = options || {}
    for (let key of Object.keys(options)) {
      if (isDef(key)) {
        this[key] = options[key]
      } else {
        console.error(`[axios sugar]: the option ${key} is not valid.`)
      }
    }
  }
};
