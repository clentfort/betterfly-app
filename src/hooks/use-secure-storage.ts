import * as SecureStore from "expo-secure-store";
import * as React from "react";

export async function setStorageItemAsync(key: string, value: any | null) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState<T>(key: string, initialState: T) {
  const [state, setState] = React.useState<T>(() => {
    try {
      return JSON.parse(SecureStore.getItem(key)!);
    } catch {
      return initialState;
    }
  });

  const wrappedSetState = React.useCallback(
    (value: T) => {
      setState(value);
      setStorageItemAsync(key, JSON.stringify(value));
    },
    [key],
  );

  return [state, wrappedSetState] as const;
}
