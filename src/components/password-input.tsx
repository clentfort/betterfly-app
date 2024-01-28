import { Icon, Input } from "@ui-kitten/components";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { ImageProps } from "react-native-svg";

interface SecureEntryToggleProps extends Partial<ImageProps> {
  isSecureEntryOn: boolean;
  onToggleSecureEntry: () => void;
}
function SecureEntryToggle({
  isSecureEntryOn,
  onToggleSecureEntry,
  ...props
}: SecureEntryToggleProps): React.ReactElement {
  return (
    <TouchableWithoutFeedback onPress={onToggleSecureEntry}>
      <Icon {...props} name={isSecureEntryOn ? "eye-off" : "eye"} />
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
          {...props}
          isSecureEntryOn={secureTextEntry}
          onToggleSecureEntry={toggleSecureEntry}
        />
      )}
      secureTextEntry={secureTextEntry}
      textContentType="password"
    />
  );
}
