import { Card, useTheme } from "@ui-kitten/components";
import { useKeepAwake } from "expo-keep-awake";
import { useEffect, useState } from "react";
import { Vibration } from "react-native";

import { Duration } from "./duration";

// Vibrate 1s, pause 1s, vibrate 1s
const PATTERN = [0, 1000, 1000, 1000];

export default function CountUp({ duration }: { duration: number }) {
  useKeepAwake();
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    const timeout = setTimeout(() => {
      Vibration.vibrate(PATTERN);
    }, duration * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration]);

  const theme = useTheme();

  const color =
    seconds < duration
      ? theme["background-basic-color-2"]
      : theme["color-success-default"];

  return (
    <Card
      style={{
        backgroundColor: color,
        height: 300,
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <Duration duration={seconds} />
    </Card>
  );
}
