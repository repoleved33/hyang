import { styles } from "@/src/styles/PerfumeCards.styles";
import { Perfume } from "@/src/types/perfume";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
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
    return rawUrl;
  }, [rawUrl]);

  return (
    <View style={[styles.card, width ? { width } : {}]}>
      <View style={styles.imageWrapper}>
        {rawUrl ? (
          <Image
            source={safeSource}
            style={styles.image}
            contentFit="contain"
            transition={200}
            cachePolicy="disk"
          />
        ) : (
          <View style={styles.textFallback}>
            <AppText style={styles.brandText} numberOfLines={1}>
              {perfume.brand || "UNKNOWN"}
            </AppText>
            <AppText style={styles.nameText} numberOfLines={2}>
              {perfume.name || "SCENT"}
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.info} />
    </View>
  );
}
