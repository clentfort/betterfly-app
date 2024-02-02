import { Layout, List, ListItem, Text } from "@ui-kitten/components";

import GermanNumber from "./german-number";

import {
  PlanItemRepetitionsSet,
  PlanItemSet,
  PlanItemTimeSet,
  PlanItemWeightSet,
} from "@/api/types";
import { space } from "@/styles";

function areAllSetsRepetitionsSet(
  sets: PlanItemSet[],
): sets is PlanItemRepetitionsSet[] {
  return sets.length > 0 && sets[0]!.type === "REPETITIONS";
}

function areAllSetsTimeSets(sets: PlanItemSet[]): sets is PlanItemTimeSet[] {
  return sets.length > 0 && sets[0]!.type === "TIME";
}

function areAllSetsWeightSets(
  sets: PlanItemSet[],
): sets is PlanItemWeightSet[] {
  return sets.length > 0 && sets[0]!.type === "WEIGHT";
}

interface ExercisePlanTableProps {
  sets: PlanItemSet[];
  onRowPress?: (index: number) => void;
}

export default function ExercisePlanTable({
  sets,
  onRowPress,
}: ExercisePlanTableProps) {
  if (areAllSetsRepetitionsSet(sets)) {
    return <RepetitionsExercisePlanTable sets={sets} onRowPress={onRowPress} />;
  } else if (areAllSetsTimeSets(sets)) {
    return <TimeExercisePlanTable sets={sets} onRowPress={onRowPress} />;
  } else if (areAllSetsWeightSets(sets)) {
    return <WeightExercisePlanTable sets={sets} onRowPress={onRowPress} />;
  }
  return null;
}

interface RepetitionsExercisePlanTableProps {
  sets: PlanItemRepetitionsSet[];
  onRowPress?: ((index: number) => void) | undefined;
}
function RepetitionsExercisePlanTable({
  sets,
  onRowPress,
}: RepetitionsExercisePlanTableProps) {
  return (
    <Layout>
      <Layout style={{ flexDirection: "row" }} />
      <List
        data={sets}
        style={{ backgroundColor: "transparent" }}
        renderItem={({ item, index }) => (
          <ListItem key={index} onPress={() => onRowPress?.(index)}>
            <Text style={{ width: "5%", textAlign: "right" }}>{index + 1}</Text>
            <Text style={{ width: "95%", textAlign: "right" }}>
              {item.repetitions} Wiederholungen
            </Text>
          </ListItem>
        )}
      />
    </Layout>
  );
}

interface TimeExercisePlanTableProps {
  sets: PlanItemTimeSet[];
  onRowPress?: ((index: number) => void) | undefined;
}
function TimeExercisePlanTable({
  sets,
  onRowPress,
}: TimeExercisePlanTableProps) {
  return (
    <Layout>
      <Layout style={{ flexDirection: "row" }} />
      <List
        data={sets}
        style={{ backgroundColor: "transparent" }}
        renderItem={({ item, index }) => (
          <ListItem key={index} onPress={() => onRowPress?.(index)}>
            <Text style={{ width: "5%", textAlign: "right" }}>{index + 1}</Text>
            <Text style={{ width: "95%", textAlign: "right" }}>
              {item.time} Sekunden
            </Text>
          </ListItem>
        )}
      />
    </Layout>
  );
}
interface WeightExercisePlanTableProps {
  sets: PlanItemWeightSet[];
  onRowPress?: ((index: number) => void) | undefined;
}
function WeightExercisePlanTable({
  sets,
  onRowPress,
}: WeightExercisePlanTableProps) {
  return (
    <Layout>
      <Layout style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold", textAlign: "right", width: "5%" }} />
        <Text
          style={{ fontWeight: "bold", textAlign: "right", width: "47.5%" }}
        >
          Wiederholungen
        </Text>
        <Text
          style={{ fontWeight: "bold", textAlign: "right", width: "47.5%" }}
        >
          Gewicht
        </Text>
      </Layout>

      <List
        data={sets}
        style={{ backgroundColor: "transparent" }}
        renderItem={({ item, index }) => (
          <ListItem
            key={index}
            onPress={() => onRowPress?.(index)}
            style={{ paddingVertical: space[1] }}
          >
            <Text style={{ width: "5%", textAlign: "right" }}>
              {index + 1}.
            </Text>
            <Text style={{ width: "47.5%", textAlign: "right" }}>
              {item.repetitions}
            </Text>
            <Text style={{ width: "47.5%", textAlign: "right" }}>
              <GermanNumber number={item.weight} /> KG
            </Text>
          </ListItem>
        )}
      />
    </Layout>
  );
}
