import { AxiosSugarStorage } from './core/AxiosSugarStorage';
interface repeat {
    interval?: number;
}
interface retry {
    auto?: boolean;
    enable?: boolean;
    count?: number;
    delay?: number;
}
interface save {
    enable?: boolean;
    storage?: AxiosSugarStorage;
}
interface reconnect {
    enable?: boolean;
}
interface onlineCheck {
    enable?: boolean;
    reconnect?: reconnect;
}
export interface AxiosSugarConfig {
    onlineCheck?: onlineCheck;
    repeat?: repeat;
    retry?: retry;
    save?: save;
    cancelDisabled?: Boolean;
}
declare const defaults: AxiosSugarConfig;
export default defaults;
