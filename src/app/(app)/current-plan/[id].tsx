import { Button, ProgressBar, Text } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import { PlanItem } from "@/api/types";
import useObject from "@/api/use-object";
import useObjects from "@/api/use-objects";
import useUpdateObject from "@/api/use-update-object";
import PageLayout from "@/components/page-layout";
import PlanItems from "@/components/plan-items";
import useAsyncStorage from "@/hooks/use-async-storage";

export default function PlanScreen() {
  const planId = useLocalSearchParams<{ id: string }>().id!;
  const [planStartedAt] = useAsyncStorage<string>(`${planId}-started-at`, "");

  const { status: fetchPlanStatus, data: plan } = useObject("Plan", planId);

  const { status: fetchPlanItemsStatus, data: planItems } = useObjects(
    "PlanItem",
    {
      where: {
        plan: { __type: "Pointer", className: "Plan", objectId: planId },
      },
      order: ["position"],
      include: ["exercise"],
    },
  );

  const { mutateAsync: endPlan } = useUpdateObject("Plan");

  if (fetchPlanStatus !== "success" || fetchPlanItemsStatus !== "success") {
    return <Text>Loading</Text>;
  }

  const exercises = planItems.results.filter(({ type }) => type === "EXERCISE");
  const done = new Set(
    exercises
      .filter((item) => item.openSets.length === 0)
      .map((item) => item.objectId),
  );

  const finishSession = async () => {
    try {
      await endPlan({
        objectId: plan.objectId,
        isRunning: false,
        ratings: [
          ...(plan.ratings ?? []),
          { feedback: "easy", date: `${planStartedAt}T23:59:59.000` },
        ],
      });
    } catch (error) {
      console.error(error);
    }
    router.push("/");
  };

  const handleEndSession = () => {
    if (done.size < exercises.length) {
      Alert.alert(
        "Training beenden?",
        `Du hast erst ${done.size} von ${planItems.results.length} Übungen absolviert. Training wirklich beenden?`,
        [{ text: "Nein" }, { text: "Ja", onPress: finishSession }],
      );
    } else {
      finishSession();
    }
  };

  const handleItemPress = (item: PlanItem) => {
    router.push(`/current-plan/exercise/${item.objectId}`);
  };

  return (
    <PageLayout
      style={{
        flex: 1,
      }}
    >
      <Text category="h3">{plan.name}</Text>
      <ProgressBar
        progress={done.size / planItems.results.length}
        status="success"
      />
      <PlanItems items={planItems.results} onItemPress={handleItemPress} />
      <Button
        status={done.size < planItems.results.length ? "danger" : "primary"}
        onPress={handleEndSession}
      >
        Training beenden
      </Button>
    </PageLayout>
  );
}
