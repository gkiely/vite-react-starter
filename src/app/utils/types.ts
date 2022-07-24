export type Intersect<T> = (T extends unknown ? (x: T) => 0 : never) extends (x: infer R) => 0
  ? R
  : never;

// https://stackoverflow.com/a/69802660/1845423
// Until exact types are supported: https://github.com/microsoft/TypeScript/issues/12936
export type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
