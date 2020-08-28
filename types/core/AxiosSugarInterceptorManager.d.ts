export declare class AxiosSugarInterceptorManager {
    private handlers;
    constructor();
    use(fulfilled: Function, rejected: Function): number;
    eject(i: number): void;
    each(fn: Function): void;
}
