import { createContext } from "react";

import ParseClient from "@/parse-client";

// @ts-expect-error
export const ParseClientContext = createContext<ParseClient>(undefined);

export function ParseClientProvider({
  client,
  children,
}: React.PropsWithChildren<{ client: ParseClient }>) {
  return (
    <ParseClientContext.Provider value={client}>
      {children}
    </ParseClientContext.Provider>
  );
}
