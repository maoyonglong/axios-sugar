import { MiddleRequestConfig, MiddleResponseConfig } from './dispatchRequest';
import MiddleData from './MiddleData';
import { AxiosResponse } from 'axios/index';

export interface StorageData {
  response: AxiosResponse;
  time: number;
  [key: string]: any;
}

export default {
  get (config: MiddleRequestConfig): StorageData | null {
    const save = config.sugar.save;
  
    if (save.enable) {
      const storage = save.storage;
      const tag = MiddleData.tags[config.index];

      if (tag !== null) {
        return storage.get(tag);
      }
    }

    return null;
  },
  set (config: MiddleResponseConfig): Boolean {
    const save = config.sugar.save;

    if (save.enable) {
      const storage = save.storage;
      const tag = MiddleData.tags[config.index];
      // isn't cancel request
      if (tag !== null) {
        storage.set(tag, {
          response: config.response,
          time: new Date().getTime()
        });
        return true;
      }
    }

    return false;
  }
}