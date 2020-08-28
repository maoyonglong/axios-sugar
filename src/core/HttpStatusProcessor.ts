import { error, isDev, warn, isOnline, isFn, capitalize } from './utils';
import { AxiosError } from 'axios/index';
import retryFn from './retry';
import { MiddleResponseConfig, MiddleResponseError } from './dispatchRequest';
import { AxiosSugar } from './AxiosSugar';

interface retry {
  (): Boolean
}

interface handlerFn {
  (
    status?: string,
    payload?: MiddleResponseError | MiddleResponseConfig,
    result?: any,
    retry?: retry
  ): any;
}

// 1XX -> 5XX
const statusKinds = [
  '1', '2', '3', '4', '5'
];

class HttpStatusProcessorPrototype {
  protected statusTable: Object;
  protected reservedCodes: string[];
  [key: string]: any;

  constructor () {
    this.statusTable = {
      // 200: this.onOk,
      // 201: this.onCreated,
      // 202: this.onAccepted,
      // 203: this.onNonAuthoritativeInformation,
      // 204: this.onNoContent,
      // 205: this.onResetContent,
      // 206: this.onPartialContent,
      // 207: this.onMultiStatus,
      400: this.onBadRequest,
      401: this.onUnauthorized,
      403: this.onForbidden,
      404: this.onNotFound,
      405: this.onMethodNotAllow,
      406: this.onNotAcceptable,
      407: this.onProxyAuthenticationRequired,
      408: this.onTimeout,
      409: this.onConflict,
      500: this.onInternalServerError,
      501: this.onNotImplemented,
      502: this.onBadGateway
    }

    this.reservedCodes = Object.keys(this.statusTable);
  }

  setStatusHandler (status: string, fn: handlerFn): Boolean {
    if (this.reservedCodes.indexOf(status) < 0) {
      this.statusTable[status] = fn;
      return true;
    } else if (isDev()) {
      error(`can't set the handler of http status code ${status}.`);
    }
    return false;
  }

  // disptach to status handlers
  dispatch (axiosSugar: AxiosSugar, status: string, payload: MiddleResponseError | MiddleResponseConfig) {
    const firstCode = status.toString().substr(0, 1);
    // expect a response
    // if payload is an error, the result will be undefined,
    // but don't worry, because it will be handled in interceptor.
    let result = (payload as MiddleResponseConfig).response;
    let isRetried = false;
    let retriedRequest = undefined;

    // if can retry
    const retry: retry = (
      (payload as MiddleResponseError).reason && 
      payload.sugar.retry.enable
    ) ? function () {
      if (!isRetried) {
        isRetried = true;
        retriedRequest = retryFn.call(axiosSugar, payload);

        return true;
      } else if (isDev()) {
        warn('retry has been already called');
      }

      return false;
    } : undefined;

    function handlerCall (fn: handlerFn, result: any) {
      return fn.call(axiosSugar, status, payload, result, retry);
    }
    
    if (isFn(this[`on${firstCode}XXBefore`])) {
      result = handlerCall(this[`on${firstCode}XXBefore`], result);
    } else if (isFn(this.onStatusBefore)) {
      result = handlerCall(this.onStatusBefore, result);
    }

    if (isFn(this.statusTable[status])) {
      result = handlerCall(this.statusTable[status], result);
    }

    if (isFn(this[`on${firstCode}XXAfter`])) {
      result = handlerCall(this[`on${firstCode}XXAfter`], result);
    } else if (isFn(this.onStatusAfter)) {
      result = handlerCall(this.onStatusAfter, result);
    }

    return retriedRequest || result;
  }
}

class HttpStatusProcessor extends HttpStatusProcessorPrototype {}

const errorhandlers = [
  'BadRequest',
  'Unauthorized',
  'Forbidden',
  'NotFound',
  'MethodNotAllow',
  'NotAcceptable',
  'ProxyAuthenticationRequired',
  // 'Timeout',
  'Conflict',
  'InternalServerError',
  'NotImplemented',
  'BadGateway'
];

function autoRetry (axiosSugar: AxiosSugar, err: MiddleResponseError, retry: retry) {
  if (retry && err.sugar.retry.auto) {
    // retry() returns false means that it has been already retried before.
    if (!retry()) {
      warn('retry has been already retried before')
    } 
  }
}

errorhandlers.forEach(h => {
  HttpStatusProcessor.prototype['on' + h] = function (
    status: string,
    err: MiddleResponseError,
    result: any,
    retry?: retry
  ): AxiosError {
    if (isDev()) {
      error(err.reason.message);
    }

    autoRetry((this as AxiosSugar), err, retry);

    return err.reason as AxiosError;
  };
});

HttpStatusProcessor.prototype.on = function (event: string, fn: handlerFn) {
  this['on' + capitalize(event)] = fn;
};

HttpStatusProcessor.prototype['onTimeout'] = async function (
  status: string,
  err: MiddleResponseError,
  result: any,
  retry?: retry
): Promise<AxiosError> {
  const onlineCheck = err.sugar.onlineCheck

  if (onlineCheck.enable) {
    if (isOnline()) {
      if (isDev()) {
        error(`online but timeout`);
      }
      const onlineTimeout = this.events['onlineTimeout'];
      if (isFn(onlineTimeout)) {
        this.events['onlineTimeout'].call(this, err, retry);
      }
      autoRetry((this as AxiosSugar), err, retry);
    } else {
      if (isDev()) {
        error(`offline`);
      }
      const offline = this.events['offline'];
      if (isFn(offline)) {
        this.events['offline'].call(this, err);
      }
      // retry when online
      if (onlineCheck.reconnect.enable) {
        window.addEventListener('online', () => {
          const online = this.events['online'];
          if (isFn(online)) {
            this.events['online'].call(this, err, retry);
            autoRetry((this as AxiosSugar), err, retry);
          }
        });
      }
    }
  } else {
    if (isDev()) {
      error(err.reason.message);
    }
    autoRetry((this as AxiosSugar), err, retry);
  }

  return err.reason as AxiosError;
}

export default HttpStatusProcessor;
