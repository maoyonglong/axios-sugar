export interface AxiosSugarStorage {
    set(symbol: string, res: any): void;
    get(symbol: string): any;
    contains(symbol: string): boolean;
}
export declare class AxiosSugarInnerStorage implements AxiosSugarStorage {
    data: {};
    set(symbol: string, res: any): void;
    get(symbol: string): any;
    contains(symbol: string): boolean;
}
export declare class AxiosSugarLocalStorage implements AxiosSugarStorage {
    set(symbol: string, res: any): void;
    get(symbol: string): any;
    contains(symbol: string): boolean;
}
