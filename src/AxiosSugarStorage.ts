export interface AxiosSugarStorage {
  set (symbol: string, res: any): void;
  get (symbol: string): any;
  contains (symbol: string): boolean;
}

export class AxiosSugarInnerStorage implements AxiosSugarStorage {
  data= {};
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

export class AxiosSugarLocalStorage implements AxiosSugarStorage {
  set (symbol: string, res: any) {
    try {
      localStorage.setItem(symbol, JSON.stringify(res))
    } catch (err) {
      console.error(`[axios-sugar]: ${err.message}`)
    }
  }
  get (symbol: string) {
    let data = localStorage.getItem(symbol)

    return data === null ? null : JSON.parse(data)
  }
  contains (symbol: string) {
    return this.get(symbol) !== null
  }
}
