import { Perfume } from "@/src/types/perfume";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  perfume: Perfume;
  width?: number;
  isFavourite: boolean;
};

export default function PerfumeCard({ perfume, width, isFavourite }: Props) {
  const rawUrl = perfume.image_url || (perfume as any).imageUrl;

  // Memoize source to prevent unnecessary re-renders and fix encoding issues
  const safeSource = React.useMemo(() => {
    if (typeof rawUrl === "string") {
      return encodeURI(decodeURI(rawUrl));
    }
    return rawUrl;
  }, [rawUrl]);

  return (
    <View
      style={[
        styles.card,
        width ? { width } : {},
        isFavourite && styles.favouriteCard,
      ]}
    >
      {/* Image Container: Square and Sharp */}
      <View style={styles.imageWrapper}>
        <Image
          source={safeSource}
          style={styles.image}
          contentFit="contain"
          transition={200}
          cachePolicy="disk"
          onError={(e) => {
            console.warn(`❌ [Decode Fail] ID: ${perfume.perfId}`, e);
          }}
        />
      </View>

      {/* Info Section: Extremely minimal text for 3-column layout */}
      <View style={styles.info}>
        {/* <AppText style={styles.brand} numberOfLines={1}>
          {perfume.brand || "UNKNOWN"}
        </AppText>
        <AppText style={styles.name} numberOfLines={1}>
          {perfume.name || "SCENT"}
        </AppText> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 8, // Reduced padding for smaller cards
    backgroundColor: "transparent", // Seamless look
    alignItems: "center",
    borderRadius: 0, // Sharp edges
  },
  favouriteCard: {
    // Keep it clean even if it's a favourite
    backgroundColor: "transparent",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1, // Keep it perfectly square
    backgroundColor: "#FFF", // White background for the bottle to pop
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: "#EEE", // Very subtle border
  },
  image: {
    width: "85%", // Slightly smaller than container for breathing room
    height: "85%",
  },
  info: {
    width: "100%",
    alignItems: "center",
  },
  brand: {
    fontSize: 8, // Tiny text for 3-column grid
    fontWeight: "800",
    color: "#AAA",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 9,
    fontWeight: "600",
    color: "#333",
    marginTop: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
