import { SugarStatic, AxiosSugar } from './core/AxiosSugar';
import HttpStatusProcessor from './core/HttpStatusProcessor';
import { AxiosSugarInnerStorage, AxiosSugarLocalStorage } from './core/AxiosSugarStorage';

export default SugarStatic;

const storage = {
  inner: AxiosSugarInnerStorage,
  local: AxiosSugarLocalStorage
};

export {
  HttpStatusProcessor,
  AxiosSugar,
  storage
}
