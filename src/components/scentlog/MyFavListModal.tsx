import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PerfumeCard from "@/src/components/shelf/PerfumeCard";
import { AppText } from "../common/AppText";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 💡 Fixed 3-column layout
const cols = 3;
const cardMargin = 10;
const modalWidth = SCREEN_WIDTH * 0.9;
// 💡 Precision calculation for perfectly equal columns
const cardWidth = (modalWidth - cardMargin * (cols + 1)) / cols;

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

  // Filter only favourites and append a search button at the end
  const gridData = useMemo(() => {
    const myFavourites = myPerfumes
      .filter((p) => p.isFavourite)
      .map((my) => ({
        ...(my.details || {}),
        perf_id: my.perfId,
        isFavourite: true,
        isSearchBtn: false,
      }));
    return [...myFavourites, { perf_id: "search-btn", isSearchBtn: true }];
  }, [myPerfumes]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          {/* Header Bar */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                onDelete?.();
                onClose();
              }}
            >
              <AppText style={styles.deleteText}>CLEAR</AppText>
            </TouchableOpacity>

            <AppText style={styles.headerTitle}>FAVOURITES</AppText>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-sharp" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* list section - grid */}
          <FlatList
            data={gridData}
            keyExtractor={(item: any) => item.perf_id}
            numColumns={cols}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: { item: any }) => {
              if (item.isSearchBtn) {
                return (
                  <View style={styles.cardContainer}>
                    <TouchableOpacity
                      style={[styles.cardWrapper, styles.searchBtn]}
                      onPress={() => {
                        onSearchOpen?.();
                      }}
                    >
                      <View style={styles.circleIcon}>
                        <Ionicons name="add-sharp" size={18} color="#AAA" />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
              // Render Perfume Item
              return (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => onSelect(item.perf_id)}
                >
                  <View style={styles.cardWrapper}>
                    <PerfumeCard
                      perfume={item}
                      width={cardWidth}
                      isFavourite={true}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Dim background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: modalWidth,
    maxHeight: SCREEN_HEIGHT * 0.65, // Limit height to keep it a pop-up
    backgroundColor: "#F7F2F9",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  deleteText: {
    fontSize: 9,
    color: "#FF3B30",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  listContent: {
    padding: cardMargin,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardContainer: {
    width: cardWidth,
    aspectRatio: 1,
  },
  cardWrapper: {
    backgroundColor: "transparent",
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
  searchBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  circleIcon: {
    width: 32, // for 3 cols
    height: 32,
    borderRadius: 16, // perfect circle
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});
