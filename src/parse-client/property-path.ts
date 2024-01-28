/** Represents a utility type for manipulating property paths. */

/** List of printable types. */
export type Printable = string | number | bigint | boolean | null | undefined;

/** List of all printable keys in T */
export type PrintableKeys<T> = Extract<keyof T, Printable>;

/**
 * Pushes a property name to the end of a property path.
 *
 * @example
 *   Queue<"user", "name">; // Result: 'user.name'
 */
export type Join<A extends Printable, B extends Printable> = `${A}.${B}`;

/**
 * Extracts the next property name from a property path. If the property path
 * starts with the specified root property name, it returns the remaining path.
 * Otherwise, it returns `never`.
 *
 * @example
 *   Shift<"user.name", "user">; // Result: 'name'
 */
export type TrimLeft<
  I extends Printable,
  R extends Printable,
> = I extends `${R}.${infer B}` ? B : never;
