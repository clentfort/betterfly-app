import { Text } from "@ui-kitten/components";
import { TextStyle } from "react-native";

export function Duration({
  duration,
  color,
}: {
  duration: number;
  color?: string;
}) {
  const style: TextStyle = { textAlign: "center" };
  if (color) {
    style.color = color;
  }
  if (duration < 60) {
    return (
      <Text category="h1" style={style}>
        {duration} Sekunde{duration === 1 ? "" : "n"}
      </Text>
    );
  }
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const secondsAsString = seconds < 10 ? `0${seconds}` : seconds;
  return (
    <Text category="h1" style={style}>
      {minutes}:{secondsAsString} Minute{minutes === 1 ? "" : "n"}
    </Text>
  );
}
