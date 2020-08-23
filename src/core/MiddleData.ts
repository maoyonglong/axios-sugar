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

export default middleData;