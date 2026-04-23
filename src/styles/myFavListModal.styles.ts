import { Colours, Radius } from "@/src/constants/Theme";
import { Dimensions, StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  modalOverlay: {
    ...modalStyles.fullScreenOverlay,
  },
  modalContent: {
    ...modalStyles.modalBorder,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: Colours.modalBackground,
    paddingBottom: 10,
  },
  header: {
    ...modalStyles.modalBottomBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: modalStyles.modalText.color,
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
    ...modalStyles.modalBorder,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: Radius.medium,
    backgroundColor: Colours.white,
  },
  searchBtnStyle: {
    ...modalStyles.modalBorder,
    borderStyle: "dashed",
    borderColor: Colours.lavenderInactive,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
});
