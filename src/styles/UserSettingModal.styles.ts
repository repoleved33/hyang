import { Colours, Radius } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";

export const styles = StyleSheet.create({
  modalOverlay: {
    ...modalStyles.fullScreenOverlay,
  },
  container: {
    ...modalStyles.modalContainer,
    width: "85%",
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colours.border,
    padding: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 15 },
  inputLabel: {
    fontSize: 10,
    color: Colours.secondaryText,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: Radius.medium,
  },
  cancelBtn: {
    backgroundColor: Colours.transparentWhite,
  },
  saveBtn: {
    backgroundColor: Colours.lavender,
  },
  cancelBtnText: {
    color: Colours.lavender,
    fontWeight: "bold",
  },
  saveBtnText: {
    color: Colours.whiteText,
    fontWeight: "bold",
  },
});
