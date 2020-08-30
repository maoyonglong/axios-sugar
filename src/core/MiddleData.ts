import { MiddleRequestConfig } from './dispatchRequest';

/**
 * store data generated in chain
 * single class
 */
class MiddleData {
  static instance: MiddleData = new MiddleData();
  tags: Array<string>;
  cancels: Array<Function>;
  configs: Array<MiddleRequestConfig>;

  private constructor () {
    this.tags = [];
    this.cancels = [];
    this.configs = [];
  }

  static getInstance () {
    return MiddleData.instance;
  }
}

const middleData = MiddleData.getInstance();

// destory some special data in MiddleData
export function dataDestory (index) {
  middleData.configs[index] = null;

  if (middleData.tags[index] !== null) {
    middleData.tags[index] = null;
    middleData.cancels[index] = null;
  }
}

export default middleData;