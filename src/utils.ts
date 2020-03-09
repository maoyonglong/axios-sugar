export function capitalize (str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export function isDef (value: any) {
  return typeof value !== 'undefined'
}
