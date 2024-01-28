import { Layout, List, ListItem, Text } from "@ui-kitten/components";

import GermanNumber from "./german-number";

import { PlanItemSet, PlanItemTimeSet, PlanItemWeightSet } from "@/api/types";
import { space } from "@/styles";

function areAllSetsWeightSets(
  sets: (PlanItemWeightSet | PlanItemTimeSet)[],
): sets is PlanItemWeightSet[] {
  return sets.length > 0 && sets[0].type === "WEIGHT";
}

function areAllTimeSets(
  sets: (PlanItemWeightSet | PlanItemTimeSet)[],
): sets is PlanItemTimeSet[] {
  return sets.length > 0 && sets[0].type === "TIME";
}

interface ExercisePlanTableProps {
  sets: PlanItemSet[];
  onRowPress?: (index: number) => void;
}

export default function ExercisePlanTable({
  sets,
  onRowPress,
}: ExercisePlanTableProps) {
  if (areAllSetsWeightSets(sets)) {
    return <WeightExercisePlanTable sets={sets} onRowPress={onRowPress} />;
  } else if (areAllTimeSets(sets)) {
    return <TimeExercisePlanTable sets={sets} onRowPress={onRowPress} />;
  }
  return null;
}

interface WeightExercisePlanTableProps {
  sets: PlanItemWeightSet[];
  onRowPress?: (index: number) => void;
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

interface TimeExercisePlanTableProps {
  sets: PlanItemTimeSet[];
  onRowPress?: (index: number) => void;
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
