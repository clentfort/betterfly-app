import { Icon, Input } from "@ui-kitten/components";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { ImageProps } from "react-native-svg";

interface SecureEntryToggleProps {
  isSecureEntryOn: boolean;
  onToggleSecureEntry: () => void;
}
function SecureEntryToggle({
  isSecureEntryOn,
  onToggleSecureEntry,
}: SecureEntryToggleProps): React.ReactElement {
  return (
    <TouchableWithoutFeedback onPress={onToggleSecureEntry}>
      <Icon name={isSecureEntryOn ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );
}

interface PasswordInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "secureTextEntry" | "accessoryRight"
  > {}
export default function PasswordInput(
  props: PasswordInputProps,
): React.ReactElement {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <Input
      {...props}
      accessoryRight={(props) => (
        <SecureEntryToggle
          isSecureEntryOn={secureTextEntry}
          onToggleSecureEntry={toggleSecureEntry}
        />
      )}
      secureTextEntry={secureTextEntry}
      textContentType="password"
    />
  );
}
