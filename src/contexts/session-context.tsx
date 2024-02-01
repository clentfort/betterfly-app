import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";

import useLogin from "@/api/use-login";
import useParseClient from "@/api/use-parse-client";
import { useStorageState } from "@/hooks/use-secure-storage";

interface LoginParams {
  studioId: string;
  username: string;
  password: string;
}

const SessionContext = createContext({
  async login(credentials: LoginParams): Promise<void> {},
  logout(): void {},
  isLoggedIn: false,
});

function getServerUrl(studioId: string) {
  return process.env.EXPO_PUBLIC_PARSE_SERVER_URL.replace(
    "${studioId}",
    studioId,
  );
}

export function SessionProvider({ children }) {
  const [sessionToken, setSessionToken] = useStorageState<string | null>(
    "session-token",
    null,
  );

  const isLoggedIn = sessionToken != null;
  const parseClient = useParseClient();
  const queryClient = useQueryClient();
  const { mutateAsync } = useLogin();

  const login = async ({ studioId, username, password }: LoginParams) => {
    parseClient.setBaseUrl(getServerUrl(studioId));
    const { sessionToken } = await mutateAsync({ username, password });
    setSessionToken(sessionToken);
  };

  const logout = () => {
    setSessionToken(null);
  };

  useEffect(() => {
    queryClient.getQueryCache().config.onError = (e) => {
      setSessionToken(null);
      console.error(e, e.stack);
    };
  }, [queryClient]);

  return (
    <SessionContext.Provider value={{ login, logout, isLoggedIn }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export default SessionContext;
