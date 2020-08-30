import { AxiosSugarStorage, AxiosSugarInnerStorage } from './core/AxiosSugarStorage';

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

const defaults: AxiosSugarConfig = {
  repeat: {
    interval: 2000
  },
  onlineCheck: {
    enable: false,
    reconnect: {
      enable: true
    }
  },
  save: {
    enable: false,
    storage:  new AxiosSugarInnerStorage()
  },
  retry: {
    enable: false,
    auto: true,
    count: 3,
    delay: 2000
  },
  cancelDisabled: false
};

export default defaults;