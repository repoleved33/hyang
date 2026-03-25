import { Colours } from "@/src/constants/theme";
import { Perfume } from "@/src/types/perfume";
import { Image } from "expo-image"; // loading issue
import React from "react";
import { StyleSheet, View } from "react-native";
type Props = {
  perfume: Perfume;
  width?: number;
  isFavourite: boolean;
};

export default function PerfumeCard({ perfume, width, isFavourite }: Props) {
  const rawUrl = perfume.image_url || (perfume as any).imageUrl;
  const safeSource = React.useMemo(() => {
    if (typeof rawUrl === "string") {
      return encodeURI(decodeURI(rawUrl));
    }
    return rawUrl; // if local img
  }, [rawUrl]);

  return (
    <View
      style={[
        styles.card,
        width ? { width } : {},
        // isFavourite === true
        isFavourite && styles.favouriteCard,
      ]}
    >
      <Image
        source={safeSource}
        style={styles.image}
        contentFit="contain"
        transition={200}
        cachePolicy="disk" // [TEST]]
        onError={(e) => {
          console.warn(`❌ [Decode Fail] ID: ${perfume.perfId}`, e);
          console.log(`🔗 Error URL: ${rawUrl}`);
        }}
      />
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
