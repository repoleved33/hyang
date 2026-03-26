import { Colours, Radius } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: Colours.background,
    flexDirection: "column",
    gap: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: Colours.primaryText,
    letterSpacing: -0.8,
    textTransform: "uppercase",
  },
  headerActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerActionText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colours.secondaryText,
    letterSpacing: -0.5,
  },
  headerInlineAddBtn: {
    width: 32,
    height: 32,
    backgroundColor: Colours.floatingBtn,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radius.round,
    elevation: 2,
  },
});
