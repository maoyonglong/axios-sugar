import { SugarStatic, AxiosSugar } from './core/AxiosSugar';
import HttpStatusProcessor from './core/HttpStatusProcessor';
import { AxiosSugarInnerStorage, AxiosSugarLocalStorage } from './core/AxiosSugarStorage';
export default SugarStatic;
declare const storage: {
    inner: typeof AxiosSugarInnerStorage;
    local: typeof AxiosSugarLocalStorage;
};
export { HttpStatusProcessor, AxiosSugar, storage };
