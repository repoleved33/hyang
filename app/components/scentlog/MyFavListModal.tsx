import { Colours } from "@/constants/theme";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMyPerfume } from "../../../context/myPerfumeContext";
import { Perfume } from "../../../data/dummyMainPerfumes";

export default function ScentLogScreen() {
  const { myPerfumes } = useMyPerfume();

  // 오늘 선택한 레이어드 향수 (최대 3개)
  const [todayPerfumes, setTodayPerfumes] = useState<Perfume[]>([]);

  const togglePerfume = (perfume: Perfume) => {
    setTodayPerfumes((prev) => {
      if (prev.find((p) => p.id === perfume.id)) {
        return prev.filter((p) => p.id !== perfume.id);
      } else {
        if (prev.length >= 3) return prev; // 최대 3개
        return [...prev, perfume];
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>

      <FlatList
        data={myPerfumes}
        keyExtractor={(item) => item.id}
        numColumns={3} // 3개씩 그리드
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => {
          const selected = todayPerfumes.find((p) => p.id === item.id);
          return (
            <TouchableOpacity onPress={() => togglePerfume(item)}>
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.image,
                  selected && { borderWidth: 2, borderColor: "#ffffff" },
                ]}
              />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottom}>
        <Text style={styles.bottomText}>
          Selected ({todayPerfumes.length}/3):
        </Text>
        <View style={styles.selectedRow}>
          {todayPerfumes.map((p) => (
            <Image
              key={p.id}
              source={{ uri: p.image }}
              style={styles.selectedImage}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",

    marginBottom: 16,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  name: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    width: 100,
  },
  bottom: { marginTop: 16 },
  bottomText: {
    // marginBottom: 8,
  },
  selectedRow: { flexDirection: "row", gap: 8 },
  selectedImage: { width: 50, height: 50, borderRadius: 6 },
});
