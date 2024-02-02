import { useMutation, useQueryClient } from "@tanstack/react-query";

import useParseClient from "./use-parse-client";

import {
  ParseClasses,
  PointerTypeToClassMap,
  QueryResponse,
} from "@/parse-client";

type MutationParams<T extends ParseClasses> = Partial<
  PointerTypeToClassMap[T]
> &
  Pick<PointerTypeToClassMap[T], "objectId">;

export default function useUpdateObject<T extends ParseClasses>(classname: T) {
  const parseClient = useParseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MutationParams<T>) =>
      parseClient.updateObject(classname, body.objectId, body),
    onMutate: async ({ objectId, ...body }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [classname, objectId] }),
        queryClient.cancelQueries({
          queryKey: [`${classname}s`],
          exact: false,
        }),
      ]);
      queryClient.setQueriesData<PointerTypeToClassMap[T]>(
        { queryKey: [classname, objectId], exact: false },
        (old) => {
          if (old == null) {
            return;
          }
          return { ...old, ...body };
        },
      );
      queryClient.setQueriesData<QueryResponse<PointerTypeToClassMap[T]>>(
        { queryKey: [`${classname}s`], exact: false },
        (response) => {
          if (!response) {
            return;
          }
          const { results } = response;
          return {
            results: results.map((result) => {
              if (result.objectId !== objectId) {
                return result;
              }
              return { ...result, ...body };
            }),
          };
        },
      );
    },
    onSuccess: (_data, { objectId }) => {
      queryClient.invalidateQueries({
        queryKey: [classname, objectId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [`${classname}s`],
        exact: false,
      });
    },
  });
}
