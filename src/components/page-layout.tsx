import { Layout } from "@ui-kitten/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { space } from "@/styles";

export default function PageLayout({
  children,
  style,
  ...props
}: React.ComponentProps<typeof Layout>) {
  const insets = useSafeAreaInsets();

  return (
    <Layout
      style={[
        {
          flex: 1,
          paddingBottom: insets.bottom + space[2],
          paddingLeft: insets.left + space[4],
          paddingRight: insets.right + space[4],
          paddingTop: insets.top + space[2],
          gap: space[2],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Layout>
  );
}
