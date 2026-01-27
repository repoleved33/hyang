import { Colours } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: Colours.transparentBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    // backgroundColor: Colours.background || "#FFFFFF",
    backgroundColor: Colours.background,
    width: "100%",
    maxHeight: "80%",
    padding: 24,

    elevation: 5,
    gap: 12,
  },
  modalItemDetailName: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    // textAlign: "center",
  },
  modalItemDetailBrand: {
    color: Colours.textDim,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  modalItemSearchName: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: "600",
  },

  modalItemSearchBrand: {
    color: Colours.textDim,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  modalText: { color: Colours.text },

  modalsearchItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: Colours.border,
  },
});
