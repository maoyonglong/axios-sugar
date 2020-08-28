export declare function capitalize(str: string): string;
export declare function isDef(value: any): boolean;
export declare function isStr(value: any): boolean;
export declare function isError(value: any): boolean;
export declare function getDurationMS(a: number, b: number): number;
export declare function notUndef<T = any, D = any>(targetVal: T, defaultVal: D): T | D;
export declare function log(msg: string): void;
export declare function warn(msg: string): void;
export declare function error(msg: string): void;
export declare function throwError(msg: string): void;
export declare function isDev(): boolean;
export declare function isFn(val: any): boolean;
export declare function isNum(val: any): boolean;
export declare function isPlainObject(val: any): boolean;
export declare function deepMerge(...args: any[]): any;
export declare function merge(...args: any[]): any;
interface onlineOptions {
    timeout?: number;
}
export declare function isOnline(options?: onlineOptions): any;
export {};
