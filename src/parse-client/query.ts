import type { PointerPath } from "./pointer";
import { PrintableKeys } from "./property-path";

export type Order<T> = (keyof T | `-${PrintableKeys<T>}`)[];

export type Where<T> = { [K in keyof T]?: Record<string, any> | T[K] };

export type Query<T, I extends PointerPath<T> = never> = {
  include?: I[];
  order?: Order<T>;
  where?: Where<T>;
  limit?: number;
};
