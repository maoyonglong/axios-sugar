import { MiddleRequestConfig } from './dispatchRequest';
interface MiddleData {
    tags: Array<string>;
    cancels: Array<Function>;
    configs: Array<MiddleRequestConfig>;
}
declare const middleData: MiddleData;
export declare function dataDestory(index: any): void;
export default middleData;
