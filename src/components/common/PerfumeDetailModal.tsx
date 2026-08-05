import { Colours } from "@/src/constants/Theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { styles } from "@/src/styles/PerfumeDetailModal.styles";
import { ACCORD_META } from "@/src/types/perfume";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText } from "./AppText";

import { usePerfumeActions } from "@/src/hooks/usePerfumehooks";

interface DetailModalProps {
  visible: boolean;
  perfume: any;
  onClose: () => void;
}

export default function PerfumeDetailModal({
  visible,
  perfume,
  onClose,
}: DetailModalProps) {
  const { myPerfumes, toggleFavourite } = useMyPerfume();
  const { confirmRemove } = usePerfumeActions();

  const currentStatus = myPerfumes.find((p) => p.perfId === perfume?.perfId);

  const sortedAccords = useMemo(
    () => [...(perfume?.main_accords ?? [])].sort((a, b) => b.score - a.score),
    [perfume?.main_accords],
  );

  if (!visible || !perfume) return null;

  const isFavourite = currentStatus?.isFavourite ?? false;

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Header & Image */}
      <View style={styles.headerSection}>
        <View style={styles.imageContainer}>
          {perfume.image_url ? (
            <Image
              source={{ uri: perfume.image_url }}
              style={styles.perfumeImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="beaker-outline" size={40} color="#ddd" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <AppText style={styles.brandText}>{perfume.brand}</AppText>
          <AppText style={styles.nameText}>{perfume.name}</AppText>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[
            styles.favouriteBtn,
            isFavourite && styles.favouriteBtnActive,
          ]}
          onPress={() => toggleFavourite(perfume.perfId)}
        >
          <Ionicons
            name={isFavourite ? "heart" : "heart-outline"}
            size={20}
            color={isFavourite ? "#fff" : Colours.primaryText}
          />
          <AppText
            style={[styles.btnText, isFavourite && styles.btnTextActive]}
          >
            My Favourite
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => confirmRemove(perfume.perfId, perfume.name, onClose)}
        >
          <Ionicons name="trash-outline" size={18} color="#999" />
          <AppText style={styles.deleteBtnText}>Remove</AppText>
        </TouchableOpacity>
      </View>

      {/* Main Accords Title */}
      <View style={styles.accordsTitleSection}>
        <AppText style={styles.sectionTitle}>Main Accords</AppText>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyAccords}>
      <AppText style={styles.emptyText}>No accords data available</AppText>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalSheet}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handleBar} />

          <FlatList
            data={sortedAccords}
            keyExtractor={(item) => item.accord}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => {
              const { accord, score } = item;

              // 공백을 언더스코어(_)로 변환 ("warm spicy" -> "warm_spicy")
              const accordKey = accord
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "_");

              const meta = ACCORD_META[accordKey as keyof typeof ACCORD_META];
              const barColor = meta?.color || "#BBDEFB";
              const labelText = meta?.label || accord;

              return (
                <View style={styles.accordRow}>
                  <View style={styles.accordLabelColumn}>
                    <AppText style={styles.accordLabel}>{labelText}</AppText>
                  </View>

                  <View style={styles.accordBarBackground}>
                    <View
                      style={[
                        styles.accordBarFill,
                        {
                          width: `${(score / 5) * 100}%`,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            }}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#111" />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
