import AxiosSugarStore from './store';
import {
  AxiosStatic,
  AxiosResponse,
  CancelTokenSource,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError
} from 'axios/index'

interface AxiosSugarRequestThenHook {
  (response: AxiosResponse, request: AxiosSugarRequest): void;
}

interface AxiosSugarRequestPreSendHook {
  (request: AxiosSugarRequest): boolean
}

interface AxiosSugarRequestCatchHook {
  (response: AxiosError, request: AxiosSugarRequest): void;
}

export interface AxiosSugarRequestConfig {
  rid?: string;
  resend?: boolean;
  resendDelay?: number;
  resendNum?: number;
  store?: boolean;
  abort?: boolean;
  source: CancelTokenSource;
  hooks: {
    _preSendCb: AxiosSugarRequestPreSendHook;
    _thenCb: AxiosSugarRequestThenHook;
    _catchCb: AxiosSugarRequestCatchHook;
  }
}

export class AxiosSugarRequest {
  private _axios: AxiosStatic | AxiosInstance;
  private _resendCount: number = 0;
  private _store?: AxiosSugarStore;
  private _thenCb: AxiosSugarRequestThenHook;
  private _catchCb: AxiosSugarRequestCatchHook;
  private _preSendCb: AxiosSugarRequestPreSendHook;
  public sending: boolean = false;
  public finish: boolean = false;
  public config: AxiosSugarRequestConfig;
  public state: 'abort' | 'store';
  public queueIdx: number;
  public waitQueueIdx: number;
  public interval: number;
  constructor(axios: AxiosStatic | AxiosInstance, config: AxiosSugarRequestConfig) {
    this._axios = axios
    if (config.store) {
      this._store = new AxiosSugarStore()
    }
    for (let [hook, fn] of Object.entries(config.hooks)) {
      this[hook] = fn
    }
  }
  public getStore (): AxiosSugarStore | null {
    return this._store || null
  }
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._execute('request', this._addCancelToken(config))
  }
  private _execute(method: string, ...args: any): Promise<AxiosResponse> {
    // while a request is sending, canceling this execution
    if (this.sending || !this._preSendCb(this)) return;
    return new Promise<AxiosResponse>((resolve, reject) => {
      this.sending = true;
      if (this.interval) {
        setTimeout(async () => {
          dispatch(resolve, reject)
        }, this.interval)
      } else {
        dispatch(resolve, reject)
      }
    });

    function dispatch (resolve: Function, reject: Function): void {
      send()
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    }

    function send (): Promise<AxiosResponse> {
      return new Promise((resolve, reject) => {
        this._axios[method].apply(this._axios, args)
        .then((response) => {
          resolve(response);
          if (this.config.store) {
            this._store.save(response)
          }
          this.sending = false;
          this.finish = true
          this._thenCb(response, this)
        })
        .catch((error) => {
          reject(error);
          let _config = this.config;                                
          if (_config.resend) {
            const {resendDelay, resendNum} = _config;
            if (resendNum <= this._resendCount) {
              setTimeout(() => {
                this[method].apply(this, args);
              }, resendDelay);
            }
            this._resendCount++;
            this.sending = false
          }
          this._catchCb(error, this); 
        });
      })
    }
  }
  private _addCancelToken (config: AxiosRequestConfig): AxiosRequestConfig {
    return {cancelToken: this.config.source.token, ...config}
  }
}

['get', 'delete', 'head', 'options'].forEach((method: string) => {
  AxiosSugarRequest.prototype[method] = function(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._execute(method, url, this._addCancelToken(config));
  };
});

['post', 'put', 'patch'].forEach(method => {
  AxiosSugarRequest.prototype[method] = function(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._execute(method, url, data, this._addCancelToken(config));
  };
});