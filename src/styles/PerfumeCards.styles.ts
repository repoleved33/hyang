import { Colours } from "@/src/constants/Theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  info: {
    width: "100%",
  },
  card: {
    padding: 0,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  image: {
    width: "85%",
    height: "85%",
  },
  textFallback: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  brandText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colours.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: "center",
  },
  nameText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colours.primaryText,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
