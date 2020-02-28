import { csymbol } from './compare';
import { AxiosResponse } from 'axios';

export interface AxiosSugarStore {
  data: object,
  save: Function,
  get: Function,
  contains: Function
}

const Store: AxiosSugarStore = {
  data: {},
  save (symbol: csymbol, res: AxiosResponse) {
    this.data[symbol] = res;
  },
  get (symbol: csymbol): any {
    return this.data[symbol];
  },
  contains (key): boolean {
    return typeof this.data[key] !== 'undefined';
  }
}

export default Store
