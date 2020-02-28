export interface AxiosSugarConfig {
  resend: boolean;
  resendDelay: number;
  resendNum: number;
  // resendCount: number;
  sendDelay: number;
  compareRule: number;
  rid?: string | number;
  store: boolean;
}

const defaultConfig: AxiosSugarConfig = {
  resend: false,
  resendDelay: 200,
  resendNum: 3,
  // resendCount: 0,
  sendDelay: 0,
  compareRule: 1,
  store: false
};

export default defaultConfig;