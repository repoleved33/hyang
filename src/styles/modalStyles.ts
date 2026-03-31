import { Colours } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: Colours.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: Colours.modalBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: Colours.modalBackground,
    width: "100%",
    maxHeight: "80%",
    padding: 24,
    elevation: 5,
    gap: 12,
  },
  modalItemDetailName: {
    color: Colours.primaryText,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    // textAlign: "center",
  },
  modalItemDetailBrand: {
    color: Colours.secondaryText,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  modalItemSearchName: {
    color: Colours.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },

  modalItemSearchBrand: {
    color: Colours.secondaryText,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  modalText: {
    color: Colours.primaryText,
  },
  modalsearchItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: Colours.border,
  },
  modalBorder: {
    borderWidth: 1,
    borderColor: Colours.border,
  },
  modalBottomBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colours.border,
  },
});
