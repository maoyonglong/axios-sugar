
interface ManagerHandler {
  fulfilled: Function;
  rejected: Function;
}

export class AxiosSugarInterceptorManager {
  private handlers: Array<ManagerHandler>;
  constructor () {
    this.handlers = [];
  }

  use (fulfilled: Function, rejected: Function) {
    this.handlers.push({
      fulfilled,
      rejected
    });

    return this.handlers.length - 1;
  }

  eject (i: number) {
    if (this.handlers[i]) {
      this.handlers[i] = null;
    }
  }

  each (fn: Function) {
    this.handlers.forEach((handler: ManagerHandler) => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }
}