import { Dimensions, StyleSheet } from "react-native";
// import { Platform } from 'react-native';
const screenWidth = Dimensions.get("window").width;
const cols = 2;
const cardMargin = 14;
const cardWidth = (screenWidth - cardMargin * (cols + 1)) / cols;

export const Colours = {
  primary: "#000000",
  secondary: "#fef9ffff",

  background: "#fffdf8ff",
  cardBackground: "#FFFFFF",
  favCardBackground: "#BDABAE",
  modalBackground: "rgba(0,0,0,0.5)",
  transparentBackground: "rgba(255, 255, 255, 0.5)",
  border: "#BDABAE",
  text: "#333333",
  textDim: "#86888B",

  // status
  error: "#FF5252",
  success: "#4CAF50",
};

export const Btn = StyleSheet.create({
  plusBtn: {
    alignSelf: "flex-end",
    marginBottom: 16,
    padding: 8,
  },
  closeBtn: { marginTop: 16, alignSelf: "center", padding: 8 },
  detailBtn: {
    borderWidth: 1,
    borderColor: Colours.secondary,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});

export const Input = StyleSheet.create({
  searchInput: {
    backgroundColor: Colours.background,
    borderWidth: 0.5,
    borderColor: Colours.border,
    padding: 8,
    marginBottom: 10,
    fontFamily: "MyFont",
  },
});

export const Layout = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colours.background },
  container: { flex: 1, padding: cardMargin },
});

export const Card = {
  marginBottom: cardMargin,
  width: cardWidth,
  cols: cols,
};

export const Months = [
  "JAN",
  "FEB.",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: 'system-ui',
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: 'ui-serif',
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: 'ui-rounded',
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: 'ui-monospace',
//   },
//   default: {
//     sans: 'normal',
//     serif: 'serif',
//     rounded: 'normal',
//     mono: 'monospace',
//   },
//   web: {
//     sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     serif: "Georgia, 'Times New Roman', serif",
//     rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
//     mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
//   },
// });
