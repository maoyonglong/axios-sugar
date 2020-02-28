import { csymbol } from './compare';
import { AxiosResponse } from 'axios';

export default {
  store: {},
  save (symbol: csymbol, res: AxiosResponse) {
    this.store[symbol] = res;
  },
  get (symbol: csymbol): any {
    return this.store[symbol];
  },
  contains (key): boolean {
    return typeof this.store[key] !== undefined;
  }
}
