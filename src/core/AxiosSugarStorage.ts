import { getDurationMS, isDef, error, merge, isFn, throwError, isDev } from './utils';
import { StorageData } from './storage';
import sizeof from '../vendor/sizeof';

export interface AxiosSugarStorage {
  data: {[key: string]: StorageData};
  set: (tag: string, data: StorageData) => boolean;
  get: (tag: string) => StorageData | null;
  [key: string]: any;
}

interface InnerStorageConfig {
  release?: boolean;
  duration?: number;
  limit?: number;
}

const innerStorageDefaults: InnerStorageConfig = {
  release: false,
  duration: 5 * 60 * 1000,
  limit: 15 * 1024 * 1024
};

export class AxiosSugarInnerStorage implements AxiosSugarStorage {
  config: InnerStorageConfig;
  data: {[key: string]: StorageData};

  constructor (config?: InnerStorageConfig) {
    this.data = {};
    this.config = config ? merge(innerStorageDefaults, config) : innerStorageDefaults;
  }

  release (tag: string, data?: StorageData) {
    if (this.config.release && isDef(this.data[tag])) {
      // handle duration: 0(suggestion) or undefined means infinity
      if (this.config.duration) {
        const time = this.data[tag].time;
        if (getDurationMS(new Date().getTime(), time) >= this.config.duration) {
          this.data[tag] = undefined;
        }
      } 
      // handle limit
      else if (
        isDef(data) &&
        sizeof(this.data) + sizeof(data) > this.config.limit
      ) {
        // callback
        if (isFn(this.full)) {
          this.full(tag, data);
        }
      }
    }
  }

  full (tag: string, data: StorageData) {
    throwError('The capacity of the storage is full');
  }

  set (tag: string, data: StorageData): boolean {
    try {
      this.release(tag, data);
      this.data[tag] = data;
      return true;
    } catch (err) {
      if (isDev()) {
        error(err.message);
      } 
      return false;
    }
  }

  get (tag: string): StorageData | null {
    this.release(tag);
    return this.data[tag] || null;
  }
}

export class AxiosSugarLocalStorage implements AxiosSugarStorage {
  data: {[key: string]: StorageData};
  constructor () {
    this.data = {};
  }
  set (tag: string, data: StorageData): boolean {
    try {
      localStorage.setItem(tag, JSON.stringify(data));
      return true;
    } catch (err) {
      if (isDev()) {
        error(err.message);
      }
      return false;
    }
  }
  get (tag: string): StorageData | null {
    const data = localStorage.getItem(tag);

    return data === null ? null : JSON.parse(data);
  }
}
