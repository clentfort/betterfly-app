import {
  ExerciseType,
  PlanItemRepetitionsSet,
  PlanItemSet,
  PlanItemTimeSet,
  PlanItemWeightSet,
} from "./types";

export function isPlanItemSetOfType(
  type: "REPETITIONS",
  item: PlanItemSet,
): item is PlanItemRepetitionsSet;
export function isPlanItemSetOfType(
  type: "TIME",
  item: PlanItemSet,
): item is PlanItemTimeSet;
export function isPlanItemSetOfType(
  type: "WEIGHT",
  item: PlanItemSet,
): item is PlanItemWeightSet;
export function isPlanItemSetOfType<T extends ExerciseType>(
  type: T,
  item: PlanItemSet,
): item is PlanItemSet & { type: T } {
  return item.type === type;
}
