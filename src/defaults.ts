import { AxiosSugarStorage, AxiosSugarInnerStorage } from './core/AxiosSugarStorage';

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
  delay?: number;
}

interface onlineCheck {
  enable?: Boolean;
  timeout?: number;
  reconnect?: reconnect;
}

export interface AxiosSugarConfig {
  onlineCheck?: onlineCheck;
  repeat?: repeat;
  retry?: retry;
  save?: save;
}

const defaults: AxiosSugarConfig = {
  repeat: {
    interval: 2000
  },
  onlineCheck: {
    enable: false,
    timeout: 5000,
    reconnect: {
      enable: true,
      delay: 5000
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
  }
};

export default defaults;