import { factory } from './core/AxiosSugar';
import {
  AxiosSugarStorage,
  AxiosSugarInnerStorage,
  AxiosSugarLocalStorage,
  AxiosSugarInnerReleaseStorage
} from './AxiosSugarStorage';
import AxiosSugarConfig from './AxiosSugarConfig';
import AxiosSugarLifeCycle from './AxiosSugarLifeCycle';

// export a factory instead
export default factory;

export {
  AxiosSugarStorage,
  AxiosSugarLifeCycle,
  AxiosSugarInnerStorage,
  AxiosSugarLocalStorage,
  AxiosSugarInnerReleaseStorage,
  AxiosSugarConfig,
};
