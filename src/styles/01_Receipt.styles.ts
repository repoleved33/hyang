import { Colours, Radius } from "@/src/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.black,
  },
  headerBar: {
    height: 45,
    backgroundColor: Colours.black,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    zIndex: 100,
  },
  headerText: {
    color: Colours.whiteText,
    fontSize: 14,
    fontWeight: "700",
  },
  captureArea: {
    flex: 1,
    backgroundColor: Colours.modalBackground,
  },
  receiptContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  paperWrapper: {
    backgroundColor: Colours.transparentWhite,
    width: SCREEN_WIDTH * 0.82,
    paddingVertical: 10,
    borderRadius: 0,
  },
  receiptPaper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dashedWrapper: {
    width: "100%",
    overflow: "hidden",
    marginVertical: 5,
  },
  dashedText: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colours.black,
    opacity: 0.8,
  },
  headerTitle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colours.primaryText,
    letterSpacing: 2,
  },
  subTitle: {
    fontSize: 14,
    color: Colours.secondaryText,
  },
  headerInfo: {
    fontSize: 11,
    marginTop: 5,
    alignItems: "center",
  },
  receiptText: {
    fontSize: 10,
    color: Colours.primaryText,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRowContainer: {
    paddingVertical: 4,
    justifyContent: "center",
  },
  textOverlay: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  footerSection: {
    marginTop: 0,
  },
  footerInfo: {
    marginVertical: 8,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colours.overlay,
    justifyContent: "flex-start",
  },
  modalContent: {
    backgroundColor: Colours.black,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: Radius.medium,
    borderBottomRightRadius: Radius.medium,
    gap: 25,
  },
  dropdownTitle: {
    color: Colours.whiteText,
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.9,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colours.white,
    minWidth: 110,
    alignItems: "center",
    borderRadius: Radius.small,
  },
  activeBtn: {
    backgroundColor: Colours.active,
  },
  buttonText: {
    color: Colours.whiteText,
    fontWeight: "bold",
    fontSize: 12,
  },
  shareActionRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  // if with text
  // paperPlaneBtn: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: Colours.active,
  //   paddingVertical: 12,
  //   paddingHorizontal: 35,
  //   borderRadius: Radius.small,
  //   gap: 10,
  //   borderWidth: 0.5,
  //   borderColor: Colours.secondaryText,
  // },
  //   shareBtnText: {
  //   color: Colours.whiteText,
  //   fontWeight: "900",
  //   fontSize: 14,
  // },

  paperPlaneBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: Radius.round,
    backgroundColor: Colours.active,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colours.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeAction: {
    marginTop: 10,
  },
  closeText: {
    color: Colours.whiteText,
    fontSize: 12,
    opacity: 0.6,
  },
});
