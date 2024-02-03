import { Icon, Input, Layout, Text } from "@ui-kitten/components";

import { isPlanItemSetOfType } from "@/api/is-plan-item-set-of-type";
import {
  PlanItemRepetitionsSet,
  PlanItemSet,
  PlanItemTimeSet,
  PlanItemWeightSet,
} from "@/api/types";
import { space } from "@/styles";

const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹".split("");
const subscripts = "₀₁₂₃₄₅₆₇₈₉".split("");

function numberToScript(number: number, scripts: string[]) {
  return number
    .toString(10)
    .split("")
    .map((digit) => {
      const index = 9 - ("9".charCodeAt(0) - digit.charCodeAt(0));
      return scripts[index];
    })
    .join("");
}

function numbersToFraction(numerator: number, denominator: number) {
  const numeratorAsString = numberToScript(numerator, superscripts);
  const denominatorAsString = numberToScript(denominator, subscripts);
  return `${numeratorAsString}\u2044${denominatorAsString}`;
}

interface ExerciseSetProps {
  index: number;
  total: number;
  set: PlanItemSet;
  stepSize: number;
  onSetChange: (set: PlanItemSet) => void;
}

export function ExerciseSet({ index, total, ...props }: ExerciseSetProps) {
  return (
    <Layout
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: space[5], fontWeight: "bold" }}>
        {numbersToFraction(index + 1, total)}
      </Text>
      <ConcreteExerciseSet {...props} />
    </Layout>
  );
}

function ConcreteExerciseSet(
  props: Pick<ExerciseSetProps, "set" | "stepSize" | "onSetChange">,
) {
  if (isPlanItemSetOfType("REPETITIONS", props.set)) {
    return <RepetitionsSet {...props} set={props.set} />;
  } else if (isPlanItemSetOfType("TIME", props.set)) {
    return <TimeSet {...props} set={props.set} />;
  } else if (isPlanItemSetOfType("WEIGHT", props.set)) {
    return <WeightSet {...props} set={props.set} />;
  }
  return null;
}

interface PlanItemRepetitionsSetProps {
  set: PlanItemRepetitionsSet;
  onSetChange: (set: PlanItemRepetitionsSet) => void;
}

function RepetitionsSet({ set, onSetChange }: PlanItemRepetitionsSetProps) {
  return (
    <Layout
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: space[3],
      }}
    >
      <Text style={{ opacity: 0, fontSize: space[5] }}>WDH</Text>
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
      <Text style={{ fontSize: space[5] }}>WDH</Text>
    </Layout>
  );
}

interface PlanItemTimeSetProps {
  set: PlanItemTimeSet;
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
      <Text style={{ opacity: 0, fontSize: space[5] }}>Sekunden</Text>
      <ValueControls
        defaultValue={set.time ?? 0}
        onIncrease={() => onSetChange({ ...set, time: set.time + 1 })}
        onDecrease={() => onSetChange({ ...set, time: set.time - 1 })}
        onSet={(time) => onSetChange({ ...set, time: Math.round(time) })}
      />
      <Text style={{ fontSize: space[5] }}>Sekunden</Text>
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
    <>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space[3],
        }}
      >
        <Text style={{ opacity: 0, fontSize: space[5] }}>KG</Text>
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
        <Text style={{ opacity: 0, fontSize: space[5] }}>KG</Text>
      </Layout>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space[3],
        }}
      >
        <Text style={{ opacity: 0, fontSize: space[5] }}>KG</Text>
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
        <Text style={{ fontSize: space[5] }}>KG</Text>
      </Layout>
    </>
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
        style={{ height: space[9], width: space[9] }}
        name="chevron-up-outline"
        onPress={onIncrease}
      />
      <Input
        style={{ minWidth: 96 }}
        keyboardType="decimal-pad"
        defaultValue={defaultValue.toString()}
        size="large"
        textStyle={{ fontSize: space[5], textAlign: "center" }}
        onEndEditing={(event) => onSet(parseFloat(event.nativeEvent.text))}
      />
      <Icon
        fill="white"
        style={{ height: space[9], width: space[9] }}
        name="chevron-down-outline"
        onPress={onDecrease}
      />
    </Layout>
  );
}
