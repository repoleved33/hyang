import { Colours } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export const accordStyles = StyleSheet.create({
  accordsContainer: {
    marginTop: 24,
  },
  accordItem: {
    marginBottom: 14,
  },
  accordLabel: {
    color: Colours.text,
    fontSize: 13,
    fontWeight: "500",
  },
  accordValue: {
    color: Colours.textDim,
    fontSize: 11,
  },
  accordBarBackground: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  accordBarFill: {
    height: "100%",
    backgroundColor: "#86888B",
    borderRadius: 3,
  },
});
