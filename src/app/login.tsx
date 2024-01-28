import { Button, Input, Text } from "@ui-kitten/components";
import { router } from "expo-router";
import React from "react";

import PageLayout from "@/components/page-layout";
import PasswordInput from "@/components/password-input";
import { useSession } from "@/contexts/session-context";
import { useStorageState } from "@/hooks/use-secure-storage";
import { space } from "@/styles";

export default function HomeScreen(): React.ReactElement {
  const [studioId, setStudioId] = useStorageState("login-studio-id", "");
  const [username, setUsername] = useStorageState("login-username", "");
  const [password, setPassword] = useStorageState("login-password", "");

  const { login } = useSession();
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
      <Text category="h1">Betterfly Member App</Text>
      <Input label="Studio ID" value={studioId} onChangeText={setStudioId} />
      <Input
        label="E-Mail"
        value={username}
        onChangeText={setUsername}
        textContentType="username"
      />
      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        style={{ width: "100%" }}
        onPress={async () => {
          if (password === "" || studioId === "" || username === "") {
            return;
          }

          await login({ studioId, username, password });
          router.replace("/");
        }}
      >
        Login
      </Button>
    </PageLayout>
  );
}
