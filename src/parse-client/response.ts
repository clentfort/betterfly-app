import { PartiallyResolvedPointer, PointerPath } from "./pointer";

export type ParseError = {
  code: number;
  error: string;
};

export type ObjectResponse<
  T,
  I extends PointerPath<T> = never,
> = PartiallyResolvedPointer<T, I>;

export type QueryResponse<T, I extends PointerPath<T> = never> = {
  results: PartiallyResolvedPointer<T, I>[];
};

export class ServerError extends Error {
  code: number;
  constructor({ error, code }: ParseError) {
    super(error);
    this.code = code;
  }
}
