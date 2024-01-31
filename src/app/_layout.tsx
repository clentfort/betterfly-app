import * as eva from "@eva-design/eva";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router, Slot } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ParseClientProvider } from "@/api/parse-client-context";
import { DataProvider } from "@/contexts/session-context";
import Client from "@/parse-client";

export const parseClient = new Client(
  process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID,
  process.env.EXPO_PUBLIC_PARSE_CLIENT_KEY,
);
export const queryClient = new QueryClient();
// TODO: Find a better way to do this
try {
  const sessionToken = JSON.parse(SecureStorage.getItem("session-token"));
  const studioId = JSON.parse(SecureStorage.getItem("login-studio-id"));
  parseClient.setBaseUrl(
    process.env.EXPO_PUBLIC_PARSE_SERVER_URL.replace("${studioId}", studioId),
  );
  parseClient.setSessionToken(sessionToken);
} catch {}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    priority: Notifications.AndroidNotificationPriority.MAX,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        setTimeout(() => router.push(url), 1);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  }
}

export default () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  useNotificationObserver();

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <SafeAreaProvider>
        <ApplicationProvider {...eva} theme={eva.dark}>
          <QueryClientProvider client={queryClient}>
            <ParseClientProvider client={parseClient}>
              <DataProvider>
                <Slot />
              </DataProvider>
            </ParseClientProvider>
          </QueryClientProvider>
        </ApplicationProvider>
      </SafeAreaProvider>
    </>
  );
};
