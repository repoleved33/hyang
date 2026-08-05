import { Colours, Radius } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";
import { modalStyles } from "./modalStyles";

export const styles = StyleSheet.create({
  modalOverlay: {
    ...modalStyles.fullScreenOverlay,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  modalSheet: {
    backgroundColor: Colours.background,
    borderTopLeftRadius: Radius.medium,
    borderTopRightRadius: Radius.medium,
    maxHeight: "85%",
    paddingTop: 12,
    width: "100%",
    position: "relative",
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  headerWrapper: {
    paddingTop: 10,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: 130,
    height: 130,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    ...modalStyles.modalBorder,
  },
  perfumeImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    alignItems: "center",
    marginTop: 16,
    gap: 4,
  },
  brandText: {
    ...modalStyles.modalItemDetailBrand,
    textAlign: "center",
  },
  nameText: {
    ...modalStyles.modalItemDetailName,
    fontSize: 20,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  favouriteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radius.large,
    gap: 8,
    minWidth: 150,
    justifyContent: "center",
  },
  favouriteBtnActive: {
    backgroundColor: Colours.lavender,
    borderColor: "#111",
  },
  btnText: {
    fontSize: 14,
    color: modalStyles.modalText.color,
    fontWeight: "600",
  },
  btnTextActive: {
    color: Colours.white,
  },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deleteBtnText: {
    fontSize: 13,
    color: Colours.secondaryText,
    fontWeight: "600",
  },

  // Accords Section
  accordsTitleSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: modalStyles.modalText.color,
  },
  accordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  accordLabelColumn: {
    width: 95,
    marginRight: 10,
  },
  accordLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colours.secondaryText,
    textTransform: "capitalize",
  },
  accordBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  accordBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  emptyAccords: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colours.secondaryText,
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 100,
    padding: 6,
  },
});
