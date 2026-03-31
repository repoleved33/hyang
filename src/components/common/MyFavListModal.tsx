import PerfumeCard from "@/src/components/common/PerfumeCard";
import { Colours } from "@/src/constants/Theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { styles } from "@/src/styles/myFavListModal.styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText } from "./AppText";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const cols = 2;
const cardGap = 20;
const modalWidth = SCREEN_WIDTH * 0.9;
const cardWidth = (modalWidth - cardGap * (cols + 1)) / cols;

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

  const gridData = useMemo(() => {
    const myFavourites = myPerfumes
      .filter((p) => p.isFavourite)
      .slice(0, 5) // max 5
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
      <Pressable style={styles.modalOverlay} onPress={onClose}>
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
              <Ionicons name="close-sharp" size={18} color={Colours.white} />
            </TouchableOpacity>
          </View>

          {/* list section - grid */}
          <FlatList
            data={gridData}
            keyExtractor={(item: any) => item.perf_id}
            numColumns={cols}
            contentContainerStyle={{ padding: cardGap }}
            columnWrapperStyle={[
              styles.columnWrapper,
              { gap: cardGap, marginBottom: cardGap },
            ]}
            scrollEnabled={false}
            renderItem={({ item }: { item: any }) => {
              if (item.isSearchBtn) {
                return (
                  <View style={[styles.cardContainer, { width: cardWidth }]}>
                    <TouchableOpacity
                      style={[styles.cardWrapper, styles.searchBtnStyle]}
                      onPress={() => onSearchOpen?.()}
                    >
                      <Ionicons
                        name="add-sharp"
                        size={24}
                        color={Colours.lavenderInactive}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
              return (
                <TouchableOpacity
                  style={[styles.cardContainer, { width: cardWidth }]}
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
