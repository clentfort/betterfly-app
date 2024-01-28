import { useContext } from "react";

import { ParseClientContext } from "./parse-client-context";

export default function useParseClient() {
  return useContext(ParseClientContext);
}
