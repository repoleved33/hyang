import { Platform, StyleSheet, Text, TextProps } from "react-native";

export function AppText({ style, ...props }: TextProps) {
  return (
    <Text
      allowFontScaling={false}
      {...props}
      style={[styles.defaultText, style]}
    />
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "MyFont",
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: "center",
      },
      ios: {},
    }),
  },
});
