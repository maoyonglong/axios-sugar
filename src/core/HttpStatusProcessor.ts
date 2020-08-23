import { error, isDev, warn, isOnline } from './utils';
import { AxiosError } from 'axios/index';
import retryFn from './retry';
import { MiddleResponseConfig, MiddleResponseError } from './dispatchRequest';
import { AxiosSugar } from './AxiosSugar';

interface retry {
  (): Boolean
}

class HttpStatusProcessorPrototype {
  private statusTable: Object;
  private reservedCodes: string[];
  [key: string]: any;

  constructor () {
    this.statusTable = {
      200: this.onOk,
      201: this.onCreated,
      202: this.onAccepted,
      203: this.onNonAuthoritativeInformation,
      204: this.onNoContent,
      205: this.onResetContent,
      206: this.onPartialContent,
      207: this.onMultiStatus,
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

  setStatusHandler (status: string, fn: Function): Boolean {
    if (this.reservedCodes.indexOf(status) < 0) {
      this.statusTable[status] = fn;
      return true;
    } else if (isDev()) {
      error(`can't set the handler of http status code ${status}.`);
    }
    return false;
  }

  // disptach to status handlers
  dispatch (status: string, payload: MiddleResponseError | MiddleResponseConfig) {
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
        retriedRequest = retryFn.call(this, payload);

        return true;
      } else if (isDev()) {
        warn('retry has been already called');
      }

      return false;
    } : undefined;

    // onXXXBefore function
    if (this[`on${firstCode}XXBefore`]) {
      result = this[`on${firstCode}XXBefore`].call(this, status, payload, result, retry);
    }
    if (this.statusTable[status]) {
      result = this.statusTable[status].call(this, status, payload, result, retry);
    }
    if (this[`on${firstCode}XXAfter`]) {
      result = this.statusTable[status].call(this, status, payload, result, retry);
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

function autoRetry (axiosSugar: AxiosSugar, err: MiddleResponseError,retry: retry) {
  if (retry && err.sugar.retry.auto) {
    // retry() returns true means that has been already retried
    if (retry()) {
      const retried = axiosSugar.events['retried'];
      if (retried) {
        retried.call(axiosSugar, err);
      }
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

    return err.reason;
  };
});

HttpStatusProcessor.prototype['onTimeout'] = function (
  status: string,
  err: MiddleResponseError,
  result: any,
  retry?: retry
): AxiosError {
  if (isOnline()) {
    this.events['onlineTimeout'].call(this, err);
    autoRetry((this as AxiosSugar), err, retry);
  } else {
    this.events['offline'].call(this, err);
    // retry when online
    if (err.sugar.reconnect.enable) {
      err.offlineTimer = setInterval(() => {
        autoRetry((this as AxiosSugar), err, retry);
      }, err.sugar.reconnect.delay);
    }
  }

  return err.reason;
}

export default HttpStatusProcessor;
