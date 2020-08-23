import {
  deepMerge as deepMergeFn,
  merge as mergeFn
} from 'axios/lib/utils';
import isOnlineFn from 'is-online';

export function capitalize (str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export function isDef (value: any): boolean {
  return typeof value !== 'undefined';
}

export function isStr (value: any): boolean {
  return typeof value === 'string';
}

export function getDurationMS (a: number, b: number): number {
  return a - b;
}

export function notUndef<T = any, D = any> (targetVal: T, defaultVal: D): T | D {
  return typeof targetVal === 'undefined' ? defaultVal : targetVal;
}

function customMessage (msg: string) {
  return `[axios-sugar]: ${msg}.`;
}

export function log (msg: string) {
  console.log(customMessage(msg));
}

export function warn (msg: string) {
  console.warn(customMessage(msg));
}

export function error (msg: string) {
  console.error(customMessage(msg));
}

export function throwError (msg: string) {
  throw new Error(customMessage(msg));
}

export function isDev () {
  return process.env.NODE_ENV === 'development';
}

export function isFn (val) {
  return typeof val === 'function';
}

export function isNum (val) {
  return typeof val === 'number';
}

export function deepMerge (...args) {
  return deepMergeFn.apply(null, args);
}

export function merge (...args) {
  return mergeFn.apply(null, args);
}

interface onlineOptions {
  timeout?: number
}

export function isOnline (options: onlineOptions = {}) {
  return isOnlineFn({
    timeout: options.timeout
  });
}
