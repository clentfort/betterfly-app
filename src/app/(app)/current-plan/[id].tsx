import {
  Button,
  Card,
  List,
  ListItem,
  ProgressBar,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Image, View } from "react-native";

import { PlanItem as PlanItemType } from "@/api/types";
import useObject from "@/api/use-object";
import useObjects from "@/api/use-objects";
import useUpdateObject from "@/api/use-update-object";
import PageLayout from "@/components/page-layout";
import useAsyncStorage from "@/hooks/use-async-storage";
import { PartiallyResolvedPointer } from "@/parse-client/pointer";
import { space } from "@/styles";

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

  const done = new Set(
    planItems.results
      .filter((item) => item.openSets.length === 0)
      .map((item) => item.objectId),
  );

  const handleAbortSession = async () => {
    try {
      await endPlan({
        objectId: plan.objectId,
        isRunning: false,
        ratings: [...plan.ratings, { feedback: "easy", date: planStartedAt }],
      });
    } catch (error) {
      console.error(error);
    }
    router.push("/");
  };

  const handleEndSession = () => {
    if (done.size < planItems.results.length) {
      Alert.alert(
        "Training beenden?",
        `Du hast erst ${done.size} von ${planItems.results.length} Übungen absolviert. Training wirklich beenden?`,
        [{ text: "Nein" }, { text: "Ja", onPress: handleAbortSession }],
      );
    } else {
      handleAbortSession();
    }
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
      <List
        data={planItems.results}
        style={{
          backgroundColor: "transparent",
          gap: 0,
          margin: 0,
          padding: 0,
        }}
        renderItem={({ item }) => {
          return <PlanItem item={item} />;
        }}
      />
      <Button
        status={done.size < planItems.results.length ? "danger" : "primary"}
        onPress={handleEndSession}
      >
        Training beenden
      </Button>
    </PageLayout>
  );
}

interface PlanItemProps {
  item: PartiallyResolvedPointer<PlanItemType, "exercise">;
}

function PlanItem({ item }: PlanItemProps) {
  const theme = useTheme();
  const isDone = item.openSets.length === 0;
  return (
    <ListItem
      key={item.objectId}
      style={{
        paddingHorizontal: space[0],
        paddingVertical: space[1],
      }}
    >
      <Card
        style={{
          width: "100%",
          backgroundColor: isDone ? theme["color-success-500"] : undefined,
        }}
        onPress={() => {
          router.push(`/current-plan/exercise/${item.objectId}`);
        }}
      >
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
            <Text style={{ flex: 1 }}>
              {item.sets.length - item.openSets.length} / {item.sets.length}{" "}
              Sets
            </Text>
          </View>
        </View>
      </Card>
    </ListItem>
  );
}
