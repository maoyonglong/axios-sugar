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
