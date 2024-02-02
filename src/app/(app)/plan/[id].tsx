import { Button, Text } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

import useObject from "@/api/use-object";
import useObjects from "@/api/use-objects";
import useUpdateObject from "@/api/use-update-object";
import PageLayout from "@/components/page-layout";
import PlanItems from "@/components/plan-items";
import useAsyncStorage from "@/hooks/use-async-storage";

export default function PlanScreen() {
  const planId = useLocalSearchParams<{ id: string }>().id!;
  const [, setPlanStartedAt] = useAsyncStorage<string | null>(
    `${planId}-started-at`,
    null,
  );

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

  const { mutateAsync: startPlan } = useUpdateObject("Plan");
  const { mutateAsync: resetPlanItem } = useUpdateObject("PlanItem");

  async function handlePlanStart() {
    try {
      await Promise.all([
        startPlan({ objectId: planId, isRunning: true }),
        ...(planItems?.results ?? []).map((item) =>
          resetPlanItem({
            objectId: item.objectId,
            currentSetIndex: 0,
            finishedSets: [],
            openSets: [...item.sets],
          }),
        ),
      ]);
      setPlanStartedAt(new Date().toISOString().substring(0, 10));
      router.replace(`/current-plan/${planId}`);
    } catch (error) {
      console.error(error);
    }
  }

  if (fetchPlanStatus !== "success" || fetchPlanItemsStatus !== "success") {
    return <Text>Loading</Text>;
  }

  return (
    <PageLayout>
      <Text category="h3">{plan.name}</Text>
      <PlanItems items={planItems.results} />
      <Button onPress={handlePlanStart}>Training starten</Button>
    </PageLayout>
  );
}
