import { Dimensions, StyleSheet } from "react-native";
// import { Platform } from 'react-native';
const screenWidth = Dimensions.get("window").width;
const cols = 2;
const cardMargin = 14;
const cardWidth = (screenWidth - cardMargin * (cols + 1)) / cols;

export const Colours = {
  // Base Backgrounds
  background: "#FEF9FF",
  modalBackground: "#F7F2F9",
  white: "#FFFFFF",
  black: "#111111",

  // Text Colours
  primaryText: "#111111",
  secondaryText: "#5C5470",
  dimText: "#AAA",
  whiteText: "#FFFFFF",

  // Components
  border: "#5C5470",
  cardBackground: "#FFFFFF",
  floatingBtn: "#111111",

  // States & Status
  active: "#333333",
  error: "#FF3B30",
  favourite: "#FF4D4D",
  favouriteBackground: "rgba(255, 77, 77, 0.03)",
  favouriteBorder: "rgba(255, 77, 77, 0.3)",

  // Transparency (Overlay 등)
  overlay: "rgba(0,0,0,0.6)",
  transparentWhite: "rgba(255,255,255,0.4)",
} as const;

export const Radius = {
  small: 10, // icon, card
  medium: 20, // receipt
  large: 30, // floating btn, detail modal
  round: 999, // circle
} as const;

export const Btn = StyleSheet.create({
  plusBtn: {
    alignSelf: "flex-end",
    marginBottom: 16,
    padding: 8,
  },
  closeBtn: { marginTop: 16, alignSelf: "center", padding: 8 },
  detailBtn: {
    borderWidth: 1,
    borderColor: Colours.secondaryText,
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
