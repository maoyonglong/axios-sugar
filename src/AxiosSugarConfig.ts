import { isDef } from './utils';

export interface AxiosSugarConfigOptions {
  isResend?: boolean;
  resendDelay?: number;
  resendTimes?: number;
  isSave?: boolean;
  prop?: string;
}

export default class AxiosSugarConfig {
  isResend = false;
  resendDelay = 1000;
  resendTimes = 3;
  isSave = false;
  prop = 'custom';
  constructor (options?: AxiosSugarConfigOptions) {
    options = options || {};
    for (const key of Object.keys(options)) {
      if (isDef(key)) {
        this[key] = options[key];
      } else {
        console.error(`[axios sugar]: the option ${key} is not valid.`);
      }
    }
  }
}
