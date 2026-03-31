import { Colours } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";

export const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: Colours.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    ...modalStyles.modalsearchItem,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  myBadge: {
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colours.lavender,
    borderRadius: 12,
    marginLeft: 10,
  },
  myBadgeText: {
    fontSize: 10,
    color: Colours.lavender,
    fontWeight: "bold",
  },
});
