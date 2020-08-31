import { MiddleResponseConfig, MiddleResponseError } from './dispatchRequest';
import { AxiosSugar } from './AxiosSugar';
interface retry {
    (): boolean;
}
interface handlerFn {
    (status?: string, payload?: MiddleResponseError | MiddleResponseConfig, result?: any, retry?: retry): any;
}
declare class HttpStatusProcessorPrototype {
    protected statusTable: Record<string, any>;
    protected reservedCodes: string[];
    [key: string]: any;
    constructor();
    setStatusHandler(status: string, fn: handlerFn): boolean;
    dispatch(axiosSugar: AxiosSugar, status: string, payload: MiddleResponseError | MiddleResponseConfig): any;
}
declare class HttpStatusProcessor extends HttpStatusProcessorPrototype {
}
export default HttpStatusProcessor;
