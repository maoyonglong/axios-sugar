import { deepMerge } from "./utils";
import { AxiosSugarConfig } from "../defaults";

export default function mergeConfig (target: AxiosSugarConfig, source: AxiosSugarConfig) {
  const result = deepMerge(target, source);

  // handle storage
  if (source.save && source.save.storage) {
    result.save.storage = source.save.storage;
  } else {
    result.save.storage = target.save.storage;
  }

  return result;
}