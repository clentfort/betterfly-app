import { Icon, Input, Layout, Text } from "@ui-kitten/components";

import { PlanItemSet, PlanItemTimeSet, PlanItemWeightSet } from "@/api/types";
import { space } from "@/styles";

interface ExerciseSetProps<T> {
  set: T;
  stepSize?: number;
  onSetChange: (set: T) => void;
}

export function ExerciseSet<T extends PlanItemSet>(props: ExerciseSetProps<T>) {
  if (props.set.type === "TIME") {
    // @ts-ignore
    return <TimeSet {...props} />;
  } else {
    // @ts-ignore
    return <WeightSet {...props} />;
  }
}

interface PlanItemTimeSetProps {
  set: PlanItemTimeSet;
  stepSize: number;
  onSetChange: (set: PlanItemTimeSet) => void;
}

function TimeSet({ set, onSetChange }: PlanItemTimeSetProps) {
  return (
    <Layout
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: space[3],
      }}
    >
      <Text style={{ opacity: 0, fontSize: 24 }}>Sekunden</Text>
      <ValueControls
        defaultValue={set.time ?? 0}
        onIncrease={() => onSetChange({ ...set, time: set.time + 1 })}
        onDecrease={() => onSetChange({ ...set, time: set.time - 1 })}
        onSet={(time) => onSetChange({ ...set, time: Math.round(time) })}
      />
      <Text style={{ fontSize: 24 }}>Sekunden</Text>
    </Layout>
  );
}

interface PlanItemWeightSetProps {
  set: PlanItemWeightSet;
  stepSize: number;
  onSetChange: (set: PlanItemWeightSet) => void;
}
function WeightSet({ set, stepSize, onSetChange }: PlanItemWeightSetProps) {
  return (
    <Layout
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space[3],
        }}
      >
        <Text style={{ opacity: 0, fontSize: 24 }}>KG</Text>
        <ValueControls
          defaultValue={set.repetitions ?? 0}
          onIncrease={() =>
            onSetChange({ ...set, repetitions: set.repetitions + 1 })
          }
          onDecrease={() =>
            onSetChange({ ...set, repetitions: set.repetitions - 1 })
          }
          onSet={(repetitions) =>
            onSetChange({ ...set, repetitions: Math.round(repetitions) })
          }
        />
        <Text style={{ opacity: 0, fontSize: 24 }}>KG</Text>
      </Layout>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space[3],
        }}
      >
        <Text style={{ opacity: 0, fontSize: 24 }}>KG</Text>
        <ValueControls
          defaultValue={set.weight ?? 0}
          onIncrease={() =>
            onSetChange({ ...set, weight: set.weight + (stepSize ?? 1) })
          }
          onDecrease={() =>
            onSetChange({ ...set, weight: set.weight - (stepSize ?? 1) })
          }
          onSet={(weight) => onSetChange({ ...set, weight })}
        />
        <Text style={{ fontSize: 24 }}>KG</Text>
      </Layout>
    </Layout>
  );
}

type ValueControlsProps = React.PropsWithChildren<{
  defaultValue: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onSet: (value: number) => void;
}>;

function ValueControls({
  defaultValue,
  onDecrease,
  onIncrease,
  onSet,
}: ValueControlsProps) {
  return (
    <Layout
      style={{
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Icon
        fill="white"
        style={{ height: space[10], width: space[10] }}
        name="chevron-up-outline"
        onPress={onIncrease}
      />
      <Input
        style={{ width: 100 }}
        keyboardType="decimal-pad"
        defaultValue={defaultValue.toString()}
        size="large"
        textStyle={{ fontSize: 24, textAlign: "center" }}
        onEndEditing={(event) => onSet(parseFloat(event.nativeEvent.text))}
      />
      <Icon
        fill="white"
        style={{ height: space[10], width: space[10] }}
        name="chevron-down-outline"
        onPress={onDecrease}
      />
    </Layout>
  );
}
