import { csymbol } from './compare';
import { AxiosResponse } from 'axios';
declare const _default: {
    store: {};
    save(symbol: csymbol, res: AxiosResponse<any>): void;
    get(symbol: csymbol): any;
    contains(key: any): boolean;
};
export default _default;
