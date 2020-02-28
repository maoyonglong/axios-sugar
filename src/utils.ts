export function merge<T = any, S = any>(target: T, ...source: Array<S>): T {
  const t = JSON.parse(JSON.stringify(target));
  source.forEach(s => {
    for (let key of Object.keys(s)) {
      t[key] = s[key];
    }
  });
  return t;
}

export function capitalize (str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}