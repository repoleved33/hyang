import { Colours } from "@/src/constants/theme";
import { Perfume } from "@/src/types/perfume";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
type Props = {
  perfume: Perfume;
  width?: number;
  isFavourite: boolean;
};

export default function PerfumeCard({ perfume, width, isFavourite }: Props) {
  // imageUrl 사용
  const imageSource =
    typeof perfume.imageUrl === "string"
      ? { uri: perfume.imageUrl }
      : perfume.imageUrl;

  return (
    <View
      style={[
        styles.card,
        width ? { width } : {},
        // 👇 isFavourite이 true일 때 styles.favouriteCard 스타일을 추가로 덮어씌움
        isFavourite && styles.favouriteCard,
      ]}
    >
      <Image source={imageSource} style={styles.image} />
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
  favouriteCard: {
    backgroundColor: Colours.favCardBackground,
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
