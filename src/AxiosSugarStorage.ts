import { getDurationMS, isDef } from './utils';
import sizeof from './vendor/object-sizeof'

export interface AxiosSugarStorage {
  set (symbol: string, res: any): void;
  get (symbol: string): any;
  contains (symbol: string): boolean;
}

let a = new Array()

export class AxiosSugarInnerStorage implements AxiosSugarStorage {
  data: {[key: string]: any} = {};
  set (symbol: string, res: any) {
    this.data[symbol] = res;
  }
  get (symbol: string): any {
    return this.data[symbol] || null;
  }
  contains (symbol: string): boolean {
    return typeof this.data[symbol] !== 'undefined';
  }
}

export class AxiosSugarInnerReleaseStorage extends AxiosSugarInnerStorage {
  // save time
  duration: number = 5 * 60 * 1000; // 5 minutes
  // volume limit
  limit: number = 15 * 1024 * 1024; // 15MB
  constructor (duration: number, limit: number) {
    super();
    if (isDef(duration)) this.duration = duration;
    if (isDef(limit)) this.limit = limit;
  }
  set (symbol: string, res: any) {
    let data = this.data;
    for (const [key, item] of Object.entries(data)) {
      if (getDurationMS(new Date().getTime(), item.time) >= this.duration) {
        delete data[key];
      }
    }
    if (sizeof(res) + sizeof(data) > this.limit) {
      data = this.data = {};
    }
    data[symbol] = {
      data: res,
      time: new Date().getTime()
    };
  }
  get (symbol: string): any {
    const target = this.data[symbol];
    return target ? target.data : null;
  }
}

export class AxiosSugarLocalStorage implements AxiosSugarStorage {
  set (symbol: string, res: any) {
    try {
      localStorage.setItem(symbol, JSON.stringify(res))
    } catch (err) {
      console.error(`[axios-sugar]: ${err.message}`)
    }
  }
  get (symbol: string) {
    const data = localStorage.getItem(symbol)

    return data === null ? null : JSON.parse(data)
  }
  contains (symbol: string) {
    return this.get(symbol) !== null
  }
}
