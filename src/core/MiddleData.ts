import { MiddleRequestConfig } from './dispatchRequest';

/**
 * store data generated in chain
 */
interface MiddleData {
  tags: Array<string>,
  cancels: Array<Function>,
  configs: Array<MiddleRequestConfig>
}

const middleData: MiddleData = {
  tags: [],
  cancels: [],
  configs: [] // middleRequestConfig Array
};

// destory some special data in MiddleData
export function dataDestory (index) {
  middleData.configs[index] = null;

  if (middleData.tags[index] !== null) {
    middleData.tags[index] = null;
    middleData.cancels[index] = null;
  }
}

export default middleData;