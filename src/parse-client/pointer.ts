import { ParseObject } from "./object";
import { Join, Printable, TrimLeft } from "./property-path";

export interface PointerTypeToClassMap {}

type RecursionDepth = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
type InitialRecursionDepth = RecursionDepth[10];

export type ParsePointer<
  T extends Printable,
  U extends ParseObject | unknown,
> = ParsePointerObject<T> | U;

export type ParsePointerObject<T extends Printable> = {
  __type: "Pointer";
  className: T;
  objectId: string;
};

/** Resolves a Parse pointer to its class type. */
export type ResolvedPointerClass<T> = T extends keyof PointerTypeToClassMap
  ? PointerTypeToClassMap[T]
  : unknown;

/** Resolves a Parse pointer to its class type. */
export type ResolvedPointer<T> =
  T extends ParsePointerObject<infer U> ? ResolvedPointerClass<U> : T;

/** Recursively gets a list of all the keys in an object that are Parse pointers. */
export type PointerPath<T, Depth extends number = InitialRecursionDepth> = {
  done: keyof T;
  recurse: {
    [K in keyof T]: Extract<
      T[K],
      ParsePointerObject<Printable>
    > extends ParsePointerObject<Printable>
      ? K extends Printable
        ?
            | K
            | Join<
                K,
                Exclude<
                  PointerPath<ResolvedPointer<T[K]>, RecursionDepth[Depth]>,
                  symbol
                >
              >
        : K
      : never;
  }[keyof T];
}[Depth extends -1 ? "done" : "recurse"];

/**
 * Returns a type with all the Parse pointers specified in I resolved to their
 * corresponding class types.
 */
export type PartiallyResolvedPointer<
  T,
  Includes extends PointerPath<T> = never,
  Depth extends number = InitialRecursionDepth,
> = {
  done: T;
  recurse: {
    [Key in keyof T]: Key extends Includes
      ? PartiallyResolvedPointer<
          Exclude<T[Key], ParsePointerObject<any>>,
          // @ts-ignore
          TrimLeft<Includes, Key>,
          RecursionDepth[Depth]
        >
      : ParsePointerObject<any> extends T[Key]
        ? Extract<T[Key], ParsePointerObject<any>>
        : T[Key];
  };
}[Depth extends -1 ? "done" : "recurse"];
