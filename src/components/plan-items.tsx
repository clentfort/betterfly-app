import { Card, List, ListItem, Text, useTheme } from "@ui-kitten/components";
import React from "react";
import { Image, View } from "react-native";

import { PlanItem as PlanItemType } from "@/api/types";
import { PartiallyResolvedPointer } from "@/parse-client/pointer";
import { space } from "@/styles";

interface PlanItemsProps {
  items: PartiallyResolvedPointer<PlanItemType, "exercise">[];
  onItemPress?: (item: PlanItemType) => void;
}

export default function PlanItems({ items, onItemPress }: PlanItemsProps) {
  return (
    <List
      data={items}
      style={{
        backgroundColor: "transparent",
        gap: 0,
        margin: 0,
        padding: 0,
      }}
      renderItem={({ item }) => {
        return (
          <ListItem
            key={item.objectId}
            style={{
              paddingHorizontal: space[0],
              paddingVertical: space[1],
            }}
          >
            {item.type === "EXERCISE" ? (
              <PlanItem item={item} onPress={onItemPress} />
            ) : (
              <Text category="label">{item.name}</Text>
            )}
          </ListItem>
        );
      }}
    />
  );
}

interface PlanItemProps {
  item: PartiallyResolvedPointer<PlanItemType, "exercise">;
  onPress?: (item: PlanItemType) => void;
}

function PlanItem({ item, onPress }: PlanItemProps) {
  const theme = useTheme();
  const isDone = item.openSets.length === 0;
  return (
    <Card
      style={{
        width: "100%",
        backgroundColor: isDone ? theme["color-success-500"] : undefined,
      }}
      onPress={() => {
        onPress?.(item);
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
            source={{ uri: item.exercise?.defaultImageUrl }}
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
              {item.exercise?.name}
            </Text>
          </View>
          <Text style={{ flex: 1 }}>
            {item.sets.length - item.openSets.length} / {item.sets.length} Sets
          </Text>
        </View>
      </View>
    </Card>
  );
}
