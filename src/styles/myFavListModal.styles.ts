import { Colours, Radius } from "@/src/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colours.overlay || "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: Colours.modalBg || Colours.tabBarBg,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colours.border,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: Colours.border,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: Colours.black,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  deleteText: {
    fontSize: 11,
    color: Colours.error,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  columnWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  cardContainer: {
    aspectRatio: 1,
  },
  cardWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colours.border,
    backgroundColor: Colours.white,
  },
  searchBtnStyle: {
    borderStyle: "dashed",
    borderColor: Colours.lavenderInactive,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
});
