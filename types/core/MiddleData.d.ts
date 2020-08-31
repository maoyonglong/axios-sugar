import { MiddleRequestConfig } from './dispatchRequest';
declare class MiddleData {
    static instance: MiddleData;
    tags: Array<string>;
    cancels: Array<Function>;
    configs: Array<MiddleRequestConfig>;
    private constructor();
    static getInstance(): MiddleData;
}
declare const middleData: MiddleData;
export declare function dataDestory(index: any): void;
export default middleData;
