import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import React, { useMemo } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PerfumeCard from "../shelf/PerfumeCard";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (perfId: string) => void;
}

export default function MyFavListModal({ visible, onClose, onSelect }: Props) {
  const { myPerfumes } = useMyPerfume();

  // 1. 즐겨찾기 목록 조인 (상세 정보 합치기)
  const favoritePerfumes = useMemo(() => {
    return myPerfumes
      .filter((p) => p.isFavourite)
      .map((my) => {
        const detail = MainPerfumeList.find((p) => p.perfId === my.perfId);
        return detail ? { ...detail, isFavourite: true } : null;
      })
      .filter((p) => p !== null);
  }, [myPerfumes]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favourite</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Horizontal Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Favorites ❤️</Text>
          {favoritePerfumes.length > 0 ? (
            <FlatList
              horizontal
              data={favoritePerfumes}
              keyExtractor={(item) => `fav-${item.perfId}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.favItem}
                  onPress={() => onSelect(item.perfId)}
                >
                  <PerfumeCard perfume={item} width={100} isFavourite={true} />
                  <Text style={styles.favName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>즐겨찾기한 향수가 없습니다.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  closeText: {
    fontSize: 16,
    color: "#999",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  horizontalList: {
    paddingRight: 20,
  },
  favItem: {
    marginRight: 15,
    alignItems: "center",
  },
  favName: {
    fontSize: 11,
    marginTop: 5,
    width: 100,
    textAlign: "center",
    color: "#666",
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridItem: {
    width: "30%",
    alignItems: "center",
  },
  gridName: {
    fontSize: 11,
    marginTop: 5,
    color: "#666",
    textAlign: "center",
  },
  emptyText: {
    color: "#bbb",
    fontStyle: "italic",
    paddingVertical: 10,
  },
});
