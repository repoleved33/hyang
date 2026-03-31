import { Colours } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";

export const styles = StyleSheet.create({
  modalOverlay: {
    ...modalStyles.fullScreenOverlay,
  },
  modalContainer: {
    ...modalStyles.modalContainer,
    ...modalStyles.modalBorder,
  },
  itemContainer: {
    ...modalStyles.modalsearchItem,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    ...modalStyles.modalItemSearchName,
  },
  itemBrand: {
    ...modalStyles.modalItemSearchBrand,
  },
  closeText: {
    ...modalStyles.modalText,
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
  searchInputCustom: {
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  listStyle: {
    maxHeight: 350,
    marginTop: 10,
  },
});
