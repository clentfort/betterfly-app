import { List, ListItem, Text } from "@ui-kitten/components";
import { Redirect, router } from "expo-router";

import useObjects from "@/api/use-objects";
import PageLayout from "@/components/page-layout";
import { space } from "@/styles";

function today() {
  return { __type: "Date", iso: new Date().toISOString().substring(0, 10) };
}

export default function Index() {
  const { status: fetchRunningPlanStatus, data: runningPlans } = useObjects(
    "Plan",
    { where: { endedAt: { $gte: today() } }, order: ["-createdAt"], limit: 10 },
  );

  if (fetchRunningPlanStatus !== "success") {
    return (
      <PageLayout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: space[4],
          padding: space[4],
        }}
      >
        <Text>Loading</Text>
      </PageLayout>
    );
  }

  const runnnigPlan = runningPlans.results.find(({ isRunning }) => isRunning);

  if (runnnigPlan != null) {
    return <Redirect href={`/current-plan/${runnnigPlan.objectId}`} />;
  }

  return (
    <PageLayout>
      <Text category="h3">Deine Pl&auml;ne</Text>
      <List
        data={runningPlans.results}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => {
              if (item.isRunning) {
                router.push(`/current-plan/${item.objectId}`);
              } else {
                router.push(`/plan/${item.objectId}`);
              }
            }}
            title={item.name}
          />
        )}
      />
    </PageLayout>
  );
}
