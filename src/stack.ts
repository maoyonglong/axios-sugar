import { AxiosRequestConfig, AxiosInstance, AxiosStatic } from './vendor/axios';

export class Stack<el> {
  protected stack: el[] = [];
  push (el: el): number {
    return this.stack.push(el);
  }
  pop (): el {
    return this.stack.pop();
  }
  contains (el: el): boolean {
    return this.stack.indexOf(el) >= 0;
  }
  remove (el: el): el {
    return this.stack.splice(this.indexOf(el), 1)[0];
  }
  indexOf (el: el): number {
    return this.stack.indexOf(el);
  }
}

export class AxiosSugarRequestStack extends Stack<AxiosRequestConfig> {
  forEach (cb): void {
    this.stack.forEach((conf, confIdx, thisArg) => {
      cb.call(conf, conf, confIdx, thisArg);
    });
  }
}

type AxiosEl = AxiosStatic | AxiosInstance;

export class AxiosStack extends Stack<AxiosEl> {}