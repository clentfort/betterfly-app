import { Text } from "@ui-kitten/components";
export default function GermanNumber({ number }: { number: number }) {
  return (
    <Text>
      {number
        .toString()
        .replaceAll(",", "#")
        .replace(".", ",")
        .replaceAll("#", ".")}
    </Text>
  );
}
