import { AxiosSugarStorage } from './core/AxiosSugarStorage';
interface repeat {
    interval?: number;
}
interface retry {
    auto?: Boolean;
    enable?: Boolean;
    count?: number;
    delay?: number;
}
interface save {
    enable?: Boolean;
    storage?: AxiosSugarStorage;
}
interface reconnect {
    enable?: Boolean;
}
interface onlineCheck {
    enable?: Boolean;
    reconnect?: reconnect;
}
export interface AxiosSugarConfig {
    onlineCheck?: onlineCheck;
    repeat?: repeat;
    retry?: retry;
    save?: save;
}
declare const defaults: AxiosSugarConfig;
export default defaults;
