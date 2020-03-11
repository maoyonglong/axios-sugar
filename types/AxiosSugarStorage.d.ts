export interface AxiosSugarStorage {
    set(symbol: string, res: any): void;
    get(symbol: string): any;
    contains(symbol: string): boolean;
}
export declare class AxiosSugarInnerStorage implements AxiosSugarStorage {
    data: {
        [key: string]: any;
    };
    set(symbol: string, res: any): void;
    get(symbol: string): any;
    contains(symbol: string): boolean;
}
export declare class AxiosSugarInnerReleaseStorage extends AxiosSugarInnerStorage {
    duration: number;
    limit: number;
    constructor(duration: number, limit: number);
    set(symbol: string, res: any): void;
    get(symbol: string): any;
}
export declare class AxiosSugarLocalStorage implements AxiosSugarStorage {
    set(symbol: string, res: any): void;
    get(symbol: string): any;
    contains(symbol: string): boolean;
}
