import { Colours, Input } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";

export const styles = StyleSheet.create({
  modalOverlay: {
    ...modalStyles.fullScreenOverlay,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  container: {
    width: "60%",
    height: 280,
    backgroundColor: "#E6E6E6",
    borderRadius: 14,
    flexDirection: "row",
    overflow: "hidden",
  },

  charcoalVerticalStripe: {
    width: 25,
    height: "100%",
    backgroundColor: Colours.black,
    marginLeft: 25,
  },

  content: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  cardBrand: {
    fontSize: 8,
    fontWeight: "900",
    color: "#AAA", // 더 흐리게 해서 은은하게 각인된 느낌
    textAlign: "right",
    letterSpacing: 1,
  },
  inputSection: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 4,
  },
  inputGroup: {
    marginBottom: 0,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colours.dimText,
    textAlign: "right",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  sharedInputBox: {
    ...Input.searchInput,
    backgroundColor: Colours.white,
    height: 28,
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 2,
    overflow: "hidden",
    borderWidth: 0,
  },
  sharedTextInput: {
    ...Input.searchInput,
    flex: 1,
    height: "100%", // cursor
    borderWidth: 0,
    marginBottom: 0,
    backgroundColor: "transparent",
    textAlign: "right",
    paddingRight: 10,
    paddingLeft: 10,
  },
  saveBtn: {
    backgroundColor: Colours.lavender,
    width: 60,
    paddingVertical: 7,
    borderRadius: 5,
    alignSelf: "flex-end",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  saveBtnText: {
    color: Colours.whiteText,
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
