import { Colours, Radius } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";

export const styles = StyleSheet.create({
  modalOverlay: {
    ...modalStyles.fullScreenOverlay,
  },
  container: {
    ...modalStyles.modalContainer,
    width: "70%",
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colours.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 2,
  },
  inputLabel: {
    fontSize: 10,
    color: Colours.secondaryText,
    fontWeight: "700",
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: Radius.small,
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
    fontSize: 11,
  },
  saveBtnText: {
    color: Colours.whiteText,
    fontWeight: "bold",
    fontSize: 11,
  },
});
