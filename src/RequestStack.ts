import { AxiosRequestConfig } from 'axios';

export default class AxiosSugarRequestStack {
  private confs: AxiosRequestConfig[] = [];
  push (conf: AxiosRequestConfig) {
    this.confs.push(conf);
  }
  contains (conf: AxiosRequestConfig): boolean {
    return this.confs.indexOf(conf) >= 0;
  }
  remove (conf: AxiosRequestConfig) {
    const confs = this.confs;
    return confs.splice(confs.indexOf(conf), 1);
  }
  forEach (cb) {
    this.confs.forEach((conf, confIdx, thisArg) => {
      cb.call(conf, conf, confIdx, thisArg);
    });
  }
}