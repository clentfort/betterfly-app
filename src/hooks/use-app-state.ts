import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export default function useAppState() {
  const appStateRef = useRef(AppState.currentState);
  const [appState, setAppState] = useState(
    AppState.currentState === "active" ? "active" : "background",
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setAppState("active");
      } else if (
        appStateRef.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        setAppState("background");
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
}
