import { Button, Card, List, ListItem, Text } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

import useObject from "@/api/use-object";
import useObjects from "@/api/use-objects";
import useUpdateObject from "@/api/use-update-object";
import PageLayout from "@/components/page-layout";
import useAsyncStorage from "@/hooks/use-async-storage";
import { space } from "@/styles";

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
        startPlan({ objectId: plan.objectId, isRunning: true }),
        ...planItems.results.map((item) =>
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
      <List
        data={planItems.results}
        style={{
          backgroundColor: "transparent",
        }}
        renderItem={({ item }) => (
          <ListItem key={item.objectId}>
            <Card style={{ width: "100%" }}>
              <View style={{ flexDirection: "row", gap: space[4] }}>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: space[1],
                    borderRadius: space[2],
                  }}
                >
                  <Image
                    style={{ width: 90, height: 60 }}
                    source={{ uri: item.exercise.defaultImageUrl }}
                  />
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    gap: space[2],
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        flex: 1,
                        fontSize: 16,
                        lineHeight: 18,
                      }}
                    >
                      {item.exercise.name}
                    </Text>
                  </View>
                  <Text style={{ flex: 1 }}>0 / {item.sets.length} Sets</Text>
                </View>
              </View>
            </Card>
          </ListItem>
        )}
      />
      <Button onPress={handlePlanStart}>Training starten</Button>
    </PageLayout>
  );
}
