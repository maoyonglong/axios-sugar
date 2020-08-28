import { isDef, isError } from './utils';

class ReasonError extends Error {
  reason: Error;
  [key: string]: any;

  constructor (error) {
    super(error.message);
    this.name = new.target.name;
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, new.target);
    }
    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      (this as any).__proto__ = new.target.prototype;
    }
    this.reason = error;
  }
}

function dataType (data) {
  if (isDef(data)) {
    if (data instanceof Promise) {
      return 'promise';
    }
    if (isError(data as unknown)) {
      if (isDef(data.reason)) {
        return 'reasonError';
      }
      // general error
      return 'error';
    }
  } else {
    return 'undefined';
  }
}

function transformSyncData (data) {
  switch (dataType(data)) {
    case 'undefined': return;
    case 'error': return new ReasonError(data);
    default: return data;
  }
}

export default (data) => {
  const result = transformSyncData(data);

  if (result instanceof Promise) {
    return result.then(
      (data) => transformSyncData(data),
      (data) => transformSyncData(data)
    );
  } else {
    return result;
  }
}
