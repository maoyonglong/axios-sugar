export interface AxiosSugarConfigOptions {
    isResend?: boolean;
    resendDelay?: number;
    resendTimes?: number;
    isSave?: boolean;
    prop?: string;
}
export default class AxiosSugarConfig {
    isResend: boolean;
    resendDelay: number;
    resendTimes: number;
    isSave: boolean;
    prop: string;
    constructor(options?: AxiosSugarConfigOptions);
}
