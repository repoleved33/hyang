import { Colours } from "@/constants/theme";
import { Perfume } from "@/data/dummyMainPerfumes";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
type Props = {
  perfume: Perfume;
  width?: number;
};

export default function PerfumeCard({ perfume, width }: Props) {
  const imageSource =
    typeof perfume.image === "string" ? { uri: perfume.image } : perfume.image;

  return (
    <View style={[styles.card, width ? { width } : {}]}>
      <Image source={imageSource} style={styles.image}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // borderWidth: 1,
    // borderColor: Colours.border,
    padding: 12,
    backgroundColor: Colours.cardBackground,
  },
  image: {
    width: "100%",
    height: 160,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Colours.primary,
    marginTop: 6,
  },
  brand: {
    fontSize: 12,
    color: Colours.textDim,
  },
});
