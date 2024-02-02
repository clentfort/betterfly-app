import { useQuery } from "@tanstack/react-query";

import useParseClient from "./use-parse-client";

import {
  ParseClasses,
  PointerPath,
  PointerTypeToClassMap,
  Query,
} from "@/parse-client";

export default function useObjects<
  T extends ParseClasses,
  I extends PointerPath<PointerTypeToClassMap[T]>,
>(classname: T, params: Query<PointerTypeToClassMap[T], I> = {}) {
  const parseClient = useParseClient();

  return useQuery({
    queryKey: [`${classname}s`, params],
    queryFn: ({ signal }) => {
      return parseClient.getObjects({ classname, query: params }, { signal });
    },
  });
}
