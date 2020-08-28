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
  enable?: Boolean
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
  }
};

export default defaults;