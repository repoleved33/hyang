import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import React, { useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PerfumeCard from "@/src/components/shelf/PerfumeCard";
import { AppText } from "../common/AppText";
const screenWidth = Dimensions.get("window").width;
const cols = 2;
const cardMargin = 14;
const cardWidth = (screenWidth - cardMargin * (cols + 1)) / cols;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (perfId: string) => void;
  onDelete?: () => void;
  onSearchOpen?: () => void;
}

export default function MyFavListModal({
  visible,
  onClose,
  onSelect,
  onDelete,
  onSearchOpen,
}: Props) {
  const { myPerfumes } = useMyPerfume();

  // MyFavourite listup
  const gridData = useMemo(() => {
    const myFavourites = myPerfumes
      .filter((p) => p.isFavourite)
      .map((my) => {
        const detail = MainPerfumeList.find((p) => p.perfId === my.perfId);
        return detail
          ? { ...detail, isFavourite: true, isSearchBtn: false }
          : null;
      })
      .filter((p) => p !== null);
    return [...myFavourites, { perfId: "search-btn", isSearchBtn: true }];
  }, [myPerfumes]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              onDelete?.();
              onClose();
            }}
          >
            <AppText style={styles.deleteText}>Remove</AppText>
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>My Favourite</AppText>
          <TouchableOpacity onPress={onClose}>
            <AppText style={styles.closeText}>Close</AppText>
          </TouchableOpacity>
        </View>

        {/* My Favourite List */}
        <FlatList
          data={gridData}
          keyExtractor={(item) => item.perfId}
          numColumns={cols}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={
            <AppText style={styles.sectionTitle}>My Favourites ❤️</AppText>
          }
          renderItem={({ item }) => {
            // search btn (last card)
            if (item.isSearchBtn) {
              return (
                <TouchableOpacity
                  style={[styles.cardContainer, styles.searchBtn]}
                  onPress={() => {
                    onSearchOpen?.();
                  }}
                >
                  <View style={styles.searchIconCircle}>
                    <AppText style={styles.plusIcon}>🔍</AppText>
                  </View>
                  <AppText style={styles.searchText}>Search All</AppText>
                  <AppText style={styles.searchSubText}>
                    Find more scents
                  </AppText>
                </TouchableOpacity>
              );
            }
            // perfumes
            return (
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => onSelect(item.perfId)}
              >
                <View style={styles.cardWrapper}>
                  <PerfumeCard
                    perfume={item as any}
                    width={cardWidth - 20}
                    isFavourite={true}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  deleteText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "700",
  },
  closeText: {
    fontSize: 13,
    color: "#aaa",
  },
  listContent: {
    padding: cardMargin,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#ccc",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  cardContainer: {
    width: cardWidth,
    alignItems: "center",
  },
  cardWrapper: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    fontSize: 10,
    color: "#999",
    marginTop: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  perfumeName: {
    fontSize: 12,
    marginTop: 2,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  searchBtn: {
    height: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#eee",
    borderStyle: "dashed",
  },
  searchIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  plusIcon: {
    fontSize: 20,
  },
  searchText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#333",
  },
  searchSubText: {
    fontSize: 10,
    color: "#bbb",
    marginTop: 4,
  },
});
