import {
  Button,
  Card,
  Input,
  Layout,
  Modal,
  Text,
} from "@ui-kitten/components";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  PlanItemSet,
  PlanItemSetHistory,
  PlanItemWeightSet,
} from "@/api/types";
import useObject from "@/api/use-object";
import useUpdateObject from "@/api/use-update-object";
import CountUp from "@/components/count-up";
import ExercisePlanTable from "@/components/exercise-plan-table";
import { ExerciseSet } from "@/components/exercise-set";
import PageLayout from "@/components/page-layout";
import Timer from "@/components/timer";
import useAppState from "@/hooks/use-app-state";
import useAsyncStorage from "@/hooks/use-async-storage";
import { space } from "@/styles";

function upsertSetsInHistory(
  history: PlanItemSetHistory[],
  sets: PlanItemSet[],
  targetDate: string,
) {
  const nextHistory = [...history].filter(({ date }) => date !== "");
  const historyIndex = nextHistory.findIndex(({ date }) => date === targetDate);
  const entry = { date: targetDate, sets };
  if (historyIndex === -1) {
    nextHistory.push(entry);
  } else {
    nextHistory[historyIndex] = entry;
  }
  return nextHistory;
}

function isHistoryOfWeightSets(
  history: PlanItemSetHistory[],
): history is { date: string; sets: PlanItemWeightSet[] }[] {
  return history.length > 0 && history[0]?.sets[0]?.type === "WEIGHT";
}

function findStepSize(history: { sets: PlanItemWeightSet[] }[]) {
  const weights = [
    ...new Set(
      history
        .flatMap(({ sets }) => sets)
        .map(({ weight }) => weight)
        .sort((a, b) => a - b),
    ),
  ];

  const diffs = weights.map((weight, index) => {
    if (index === 0) {
      return 0;
    }
    // @ts-expect-error We have a special case for index === 0 above, afterwarts
    // we can be sure that index - 1 is not undefined
    return weight - weights[index - 1];
  });

  return Math.min(...diffs.filter(Boolean));
}

const DEFAULT_PAUSE_DURATION = 60 + 40;

export default function ExercisePlanScreen() {
  const planItemId = useLocalSearchParams<{ id: string }>().id!;
  const [pauseDuration, setPauseDuration] = useState(0);
  const [pauseStartedAt, setPauseStartedAt] = useState(0);
  const [nextPauseDuration, setNextPauseDuration] = useAsyncStorage(
    "pause-duration",
    DEFAULT_PAUSE_DURATION,
  );
  const [currentTrainingHeight, setCurrentTrainingHeight] = useState<
    number | undefined
  >(undefined);
  const [finishedItemToEdit, setFinishedItemToEdit] = useState<number | null>(
    null,
  );
  const { status: fetchItemStatus, data: planItem } = useObject(
    "PlanItem",
    planItemId,
    ["exercise"],
  );
  const [planStartedAt] = useAsyncStorage<string>(
    `${planItem?.plan.objectId}-started-at`,
    "",
  );
  const { mutateAsync: updatePlanItem } = useUpdateObject("PlanItem");
  const [timerStartedAt, setTimerStartedAt] = useState(-1);

  const setPause = useCallback((pause: number) => {
    setPauseDuration(pause);
    if (pause === 0) {
      setPauseStartedAt(0);
    } else {
      setPauseStartedAt(Date.now());
    }
  }, []);

  useEffect(() => {
    if (pauseDuration === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setPause(0);
    }, pauseDuration * 1000);

    const identifier = Notifications.scheduleNotificationAsync({
      content: {
        title: "Pause vorbei",
        body: "Weiter machen!",
        data: {
          url: `/current-plan/exercise/${planItemId}`,
        },
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: { seconds: pauseDuration },
    });

    return () => {
      clearTimeout(timeout);
      identifier.then(Notifications.cancelScheduledNotificationAsync);
    };
  }, [pauseDuration]);

  //////////////////////////////
  const appState = useAppState();
  const prevAppStateRef = useRef(appState);
  useEffect(() => {
    const prevAppState = prevAppStateRef.current;
    prevAppStateRef.current = appState;
    if (prevAppState === appState || appState !== "active") {
      return;
    }
    // App has become active

    if (pauseDuration === 0) {
      return;
    }
    const now = Date.now();
    const secondsSincePauseStarted = Math.round((now - pauseStartedAt) / 1000);

    setPause(Math.max(0, pauseDuration - secondsSincePauseStarted));
  }, [appState, pauseDuration, pauseStartedAt, setPause]);
  //////////////////////////////

  if (fetchItemStatus !== "success" || planItem.sets?.length === 0) {
    return <Text>Loading</Text>;
  }

  const handleCancelPause = () => {
    setPause(0);
  };

  const handleFinishSet = async () => {
    if (planItem.openSets.length > 0) {
      const currentSetIndex = planItem.currentSetIndex ?? 0 + 1;
      const [finishedSet, ...openSets] = planItem.openSets;
      const finishedSets = [...planItem.finishedSets, finishedSet!];
      const history = upsertSetsInHistory(
        planItem.history ?? [],
        finishedSets,
        planStartedAt,
      );

      await updatePlanItem({
        objectId: planItemId,
        currentSetIndex,
        finishedSets,
        history,
        openSets,
      });
    }
    if (planItem.openSets.length > 1) {
      setPause(nextPauseDuration);
    }
    if (planItem.openSets.length <= 1) {
      router.push(`/current-plan/${planItem.plan.objectId}`);
    }
  };

  const handleEditCurrentSet = (set: PlanItemSet) => {
    const [, ...remainingOpenSets] = planItem.openSets;
    const openSets = [set, ...remainingOpenSets];

    const sets = [...planItem.sets];
    sets[planItem.currentSetIndex ?? 0] = set;

    updatePlanItem({ objectId: planItemId, openSets, sets });
  };

  const handleEditFinishedSet = (set: PlanItemSet) => {
    const finishedSets = [...planItem.finishedSets];
    finishedSets[finishedItemToEdit!] = set;

    const history = upsertSetsInHistory(
      planItem.history ?? [],
      finishedSets,
      planStartedAt,
    );

    updatePlanItem({ objectId: planItemId, finishedSets, history });
  };

  const handleEndCountUp = () => {
    const now = Date.now();
    const duration = Math.round((now - timerStartedAt!) / 1000);
    setTimerStartedAt(-1);
    handleEditCurrentSet({ type: "TIME", time: duration });
  };

  const lastSession = (planItem.history ?? []).findLast(
    ({ date, sets }) =>
      date < new Date().toISOString().substring(0, 10) && sets.length > 0,
  );

  let stepSize = 1;
  if (
    planItem.history &&
    planItem.history.length > 0 &&
    isHistoryOfWeightSets(planItem.history)
  ) {
    stepSize = findStepSize(planItem.history!);
  }

  if (planStartedAt === null) {
    return <PageLayout style={{ height: "100%", width: "100%" }} />;
  }

  return (
    <PageLayout
      style={{
        flex: 1,
        gap: space[2],
      }}
    >
      <Modal
        visible={finishedItemToEdit != null}
        style={{ width: "90%" }}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setFinishedItemToEdit(null)}
      >
        <Card>
          <ExerciseSet
            set={planItem.finishedSets[finishedItemToEdit!]!}
            onSetChange={handleEditFinishedSet}
            stepSize={stepSize}
          />
          <Button onPress={() => setFinishedItemToEdit(null)}>Fertig</Button>
        </Card>
      </Modal>
      <Modal
        visible={pauseDuration > 0}
        style={{ width: "90%" }}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Card>
          <Timer duration={pauseDuration} />

          <Button status="danger" onPress={handleCancelPause}>
            Pause abbrechen
          </Button>
        </Card>
      </Modal>
      <Modal
        visible={
          timerStartedAt > 0 &&
          planItem.openSets.length > 0 &&
          planItem.openSets[0]?.type === "TIME"
        }
        style={{ width: "90%" }}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => handleEndCountUp()}
      >
        {planItem.openSets.length > 0 &&
          planItem.openSets[0]?.type === "TIME" && (
            <Card>
              <CountUp duration={planItem.openSets[0].time} />
              <Button status="danger" onPress={() => handleEndCountUp()}>
                Beeenden
              </Button>
            </Card>
          )}
      </Modal>
      <Text category="h3">{planItem.exercise.name}</Text>

      {lastSession && (
        <Layout>
          <Text category="label">Letztes Training ({lastSession.date})</Text>
          <Card
            style={{ width: "100%" }}
            onLayout={(event) =>
              setCurrentTrainingHeight(event.nativeEvent.layout.height)
            }
          >
            {lastSession && <ExercisePlanTable sets={lastSession.sets} />}
          </Card>
        </Layout>
      )}

      <Layout style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text category="label">Aktueller Satz</Text>
        <Layout style={{ flexGrow: 1, justifyContent: "center" }}>
          {planItem.openSets.length > 0 && (
            <ExerciseSet
              stepSize={stepSize}
              set={planItem.openSets[0]!}
              onSetChange={handleEditCurrentSet}
            />
          )}
          {planItem.openSets.length > 0 &&
            planItem.openSets[0]?.type === "TIME" && (
              <Button onPress={() => setTimerStartedAt(Date.now())}>
                Timer starten
              </Button>
            )}
        </Layout>
      </Layout>

      <Layout>
        <Text category="label">Dieses Training</Text>
        <Card style={{ width: "100%", minHeight: currentTrainingHeight }}>
          <ExercisePlanTable
            sets={planItem.finishedSets}
            onRowPress={(itemToEdit) => {
              setFinishedItemToEdit(itemToEdit);
            }}
          />
        </Card>
      </Layout>

      <Layout style={{ gap: space[2] }}>
        {planItem.openSets.length > 0 && (
          <Input
            label="Pause (Sekunden)"
            defaultValue={nextPauseDuration.toString()}
            keyboardType="numeric"
            onEndEditing={({ nativeEvent: { text } }) =>
              setNextPauseDuration(parseFloat(text))
            }
          />
        )}
        <Button onPress={handleFinishSet}>
          <ButtonText length={planItem.openSets.length} />
        </Button>
      </Layout>
    </PageLayout>
  );
}

function ButtonText({ length: remainingSetCount }: { length: number }) {
  if (remainingSetCount === 0) {
    return <Text>Zur&uuml;ck</Text>;
  }
  if (remainingSetCount === 1) {
    return <Text>&Uuml;bung abschlie&szlig;en</Text>;
  }
  return <Text>Satz abschlie&szlig;en</Text>;
}
