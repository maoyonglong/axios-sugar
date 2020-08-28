import { MiddleResponseError } from './dispatchRequest';
export default function (err: MiddleResponseError): Error | Promise<unknown>;
