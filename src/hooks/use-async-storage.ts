import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export default function useAsyncStorage<T>(key: string, initialState: T) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    AsyncStorage.getItem(key).then((value) => {
      if (value) {
        setState(JSON.parse(value));
      }
    });
  }, [key]);

  const setStateWrapped = useCallback(
    (value) => {
      setState(value);
      AsyncStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  return [state, setStateWrapped] as const;
}
