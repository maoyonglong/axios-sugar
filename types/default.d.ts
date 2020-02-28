export interface AxiosSugarConfig {
    resend: boolean;
    resendDelay: number;
    resendNum: number;
    compareRule: number;
    rid?: string | number;
    store: boolean;
}
declare const defaultConfig: AxiosSugarConfig;
export default defaultConfig;
