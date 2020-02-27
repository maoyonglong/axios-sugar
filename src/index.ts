import { AxiosSugarRequest, AxiosSugarRequestConfig } from './request';
const { v4: uuidv4} = require('uuid')

import {
  AxiosStatic,
  AxiosInstance,
  AxiosResponse,
  AxiosError
} from 'axios'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid/dist/index.js';

interface AxiosSugarConfig extends AxiosSugarRequestConfig {
  interval: number;
}

class AxiosSugar {
  private _queue: Array<AxiosSugarRequest> = [];
  private _waitQueue: Array<AxiosSugarRequest> = [];
  private _interval: number = 200;
  createRequest(_axios: AxiosStatic | AxiosInstance, config?: AxiosSugarConfig): AxiosSugarRequest {
    this._interval = config.interval
    delete config.interval
    config = Object.assign({
      rid: uuidv4(),
      resend: true,
      resendDelay: 200,
      resendNum: 3,
      store: false
    }, config)
    const request = new AxiosSugarRequest(_axios, {
      source: axios.CancelToken.source(),
      ...config,
      hooks: {
        _preSendCb: this._preSend,
        _thenCb: this._then,
        _catchCb: this._catch
      }
    })
    return request
  }
  _preSend(request: AxiosSugarRequest): boolean {
    let isSend = true
    for (let r of Object.values(this._queue)) {
      // same request
      if (r.config.rid === request.config.rid) {
        if (r.sending) {
          request.state = 'abort'
          // abort this request
          isSend = false
        } 
        // if store
        if (r.config.store) {
          request.state = 'store'
          // abort this request
          isSend = false
        }
        break
      }
    }
    if (isSend) {
      // if some request are waiting, need to delay
      if (this._waitQueue.length !== 0) {
        request.interval = this._interval
      }
      request.queueIdx = this._queue.push(request) - 1
      request.waitQueueIdx = this._waitQueue.push(request) - 1
    }
    return isSend
  }
  _then(response: AxiosResponse, request: AxiosSugarRequest) {
    if (!request.config.store) {
      // pop queue
      this._queue.splice(request.queueIdx, 1)
    }
    this._waitQueue.splice(request.waitQueueIdx, 1)
  }
  _catch(error: AxiosError, request: AxiosSugarRequest) {
    this._queue.splice(request.queueIdx, 1)
    this._waitQueue.splice(request.waitQueueIdx, 1)
  }
}

export default AxiosSugar
