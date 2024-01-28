import { useQuery } from "@tanstack/react-query";

import useParseClient from "./use-parse-client";

import {
  ParseClasses,
  PointerPath,
  PointerTypeToClassMap,
} from "@/parse-client";

export default function useObject<
  T extends ParseClasses,
  I extends PointerPath<PointerTypeToClassMap[T]> = never,
>(classname: T, objectId: string, include?: I[]) {
  const parseClient = useParseClient();

  return useQuery({
    queryKey: [classname, objectId, include],
    queryFn: ({ signal }) => {
      return parseClient.getObject(
        { classname, objectId, include },
        { signal },
      );
    },
  });
}
