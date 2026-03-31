import { Colours } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colours.overlay,
    justifyContent: "flex-end", // bottom to top
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "85%",
    overflow: "hidden",
    paddingTop: 10,
  },
  handleBar: {
    width: 50,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 60,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  imageContainer: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 70, // 원형
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  perfumeImage: { width: "100%", height: "100%" },
  noImage: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    alignItems: "center",
    marginTop: 20,
    gap: 5,
  },
  brandText: {
    fontSize: 13,
    color: Colours.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colours.primaryText,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 35,
  },
  favouriteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 10,
    minWidth: 160,
    justifyContent: "center",
  },
  favouriteBtnActive: {
    backgroundColor: Colours.lavender,
    borderColor: "#111",
  },
  btnText: { fontSize: 14, color: Colours.primaryText, fontWeight: "600" },
  btnTextActive: { color: Colours.white },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  deleteBtnText: {
    fontSize: 13,
    color: Colours.secondaryText,
    fontWeight: "600",
  },

  // Graph
  accordsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colours.primaryText,
    marginBottom: 20,
  },
  accordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  accordLabelColumn: {
    width: 90,
    marginRight: 10,
  },
  accordLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colours.secondaryText,
    textTransform: "capitalize",
    marginBottom: 2,
  },
  accordValue: {
    fontSize: 11,
    color: Colours.secondaryText,
  },
  accordBarBackground: {
    flex: 1, // rest
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden", // 내부 바 잘리게
  },
  accordBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  emptyAccords: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
  },
  emptyText: { fontSize: 14, color: Colours.secondaryText },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 100,
    padding: 5,
  },
});
