import { getDurationMS, isDef, error, merge, isFn, throwError, isDev } from './utils';
import sizeof from 'object-sizeof';
import { StorageData } from './storage';

export interface AxiosSugarStorage {
  set (tag: string, res: StorageData): Boolean;
  get (tag: string): StorageData | null;
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
  data: {[key: string]: StorageData} = {};

  constructor (config?: InnerStorageConfig) {
    this.config = config ? merge(innerStorageDefaults, config) : innerStorageDefaults;
  }

  private release (tag: string, res?: StorageData) {
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
        isDef(res) &&
        sizeof(this.data) + sizeof(res) > this.config.limit
      ) {
        // callback
        if (isFn(this.full)) {
          this.full(tag, res);
        }
      }
    }
  }

  full (tag: string, res: StorageData) {
    throwError('The capacity of the storage is full');
  }

  set (tag: string, res: StorageData): Boolean {
    try {
      this.release(tag, res);
      this.data[tag] = res;
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
  set (tag: string, res: StorageData): Boolean {
    try {
      localStorage.setItem(tag, JSON.stringify(res));
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
