export type Intersect<T> = (T extends unknown ? (x: T) => 0 : never) extends (x: infer R) => 0
  ? R
  : never;
