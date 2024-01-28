import { useMutation, useQueryClient } from "@tanstack/react-query";

import useParseClient from "./use-parse-client";

type LoginParams = {
  password: string;
  username: string;
};

export default function useLogin() {
  const parseClient = useParseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ password, username }: LoginParams) =>
      parseClient.login(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
