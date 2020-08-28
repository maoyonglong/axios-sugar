import {
  deepMerge as deepMergeFn,
  merge as mergeFn
} from '../vendor/axios/utils.js';

export function capitalize (str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export function isDef (value: any): boolean {
  return typeof value !== 'undefined';
}

export function isStr (value: any): boolean {
  return typeof value === 'string';
}

export function isError (value) {
  return value instanceof Error;
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

export function isPlainObject (val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
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

export function isOnline (options: onlineOptions = {timeout: 5000}) {
  return navigator.onLine;
}
