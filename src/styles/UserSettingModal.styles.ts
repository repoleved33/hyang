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
  authSection: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: Radius.small,
    alignItems: "center",
    marginBottom: 15,
  },
  label: { fontSize: 10, color: Colours.secondaryText, letterSpacing: 1 },
  authValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colours.lavender,
    marginTop: 4,
  },

  inputGroup: { marginBottom: 15 },
  inputLabel: {
    fontSize: 10,
    color: Colours.secondaryText,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colours.border,
    paddingVertical: 8,
    fontSize: 15,
    color: Colours.primaryText,
    fontFamily: "Pretendard-Bold",
  },

  buttonRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: Radius.small,
  },
  cancelBtn: { backgroundColor: Colours.border },
  saveBtn: { backgroundColor: Colours.primaryText },
  cancelBtnText: { color: Colours.secondaryText, fontWeight: "bold" },
  saveBtnText: { color: Colours.background, fontWeight: "bold" },
});
