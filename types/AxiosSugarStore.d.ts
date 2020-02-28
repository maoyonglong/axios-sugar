export interface AxiosSugarStore {
    data: object;
    save: Function;
    get: Function;
    contains: Function;
}
declare const Store: AxiosSugarStore;
export default Store;
