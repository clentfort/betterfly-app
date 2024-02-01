import { Button, Input, Text } from "@ui-kitten/components";
import { router } from "expo-router";

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
      <Input
        keyboardType="numeric"
        label="Studio ID"
        defaultValue={studioId}
        onChangeText={setStudioId}
      />
      <Input
        autoComplete="email"
        label="E-Mail"
        keyboardType="email-address"
        textContentType="emailAddress"
        defaultValue={username}
        onChangeText={setUsername}
      />
      <PasswordInput
        autoComplete="password"
        label="Password"
        defaultValue={password}
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
