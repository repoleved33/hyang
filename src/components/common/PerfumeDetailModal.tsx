import { Colours } from "@/src/constants/Theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { styles } from "@/src/styles/PerfumeDetailModal.styles";
import { ACCORD_META } from "@/src/types/perfume";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

  if (!visible || !perfume) return null;

  const isFavourite = currentStatus?.isFavourite ?? false;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide" // <-> fade
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              <View style={styles.handleBar} />
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* 1. Header & Image */}
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
                        <Ionicons
                          name="beaker-outline"
                          size={40}
                          color="#ddd"
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.infoContainer}>
                    <AppText style={styles.brandText}>{perfume.brand}</AppText>
                    <AppText style={styles.nameText}>{perfume.name}</AppText>
                  </View>
                </View>

                {/* 2. Status Buttons */}
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
                      style={[
                        styles.btnText,
                        isFavourite && styles.btnTextActive,
                      ]}
                    >
                      My Favourite
                    </AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      confirmRemove(perfume.perfId, perfume.name, onClose)
                    }
                  >
                    <Ionicons name="trash-outline" size={18} color="#999" />
                    <AppText style={styles.deleteBtnText}>Remove</AppText>
                  </TouchableOpacity>
                </View>

                {/* 3. Main Accords */}
                <View style={styles.accordsSection}>
                  <AppText style={styles.sectionTitle}>Main Accords</AppText>

                  {perfume.main_accords && perfume.main_accords.length > 0 ? (
                    perfume.main_accords
                      ?.sort((a: any, b: any) => b.score - a.score)
                      .map(({ accord, score }: any) => {
                        // from perfumes - ACCORD-META
                        const lowerAccord = accord.toLowerCase();
                        const meta =
                          ACCORD_META[lowerAccord as keyof typeof ACCORD_META];
                        const barColor = meta?.color || "#BBDEFB"; //not defined;
                        return (
                          <View key={accord} style={styles.accordRow}>
                            <View style={styles.accordLabelColumn}>
                              <AppText style={styles.accordLabel}>
                                {accord}
                              </AppText>
                              {/* <AppText style={styles.accordValue}>
                              {score.toFixed(1)} / 5.0
                            </AppText> */}
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
                      })
                  ) : (
                    <View style={styles.emptyAccords}>
                      <AppText style={styles.emptyText}>
                        No accords data available
                      </AppText>
                    </View>
                  )}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
