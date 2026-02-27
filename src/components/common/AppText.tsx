import { Text, TextProps } from "react-native";

export function AppText({ style, ...props }: TextProps) {
  return <Text {...props} style={[{ fontFamily: "MyFont" }, style]} />;
}
