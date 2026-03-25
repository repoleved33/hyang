import { Colours } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { ACCORD_META } from "@/src/types/perfume";
import { Ionicons } from "@expo/vector-icons"; // 💡 아이콘 추가
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
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
                      color={isFavourite ? "#fff" : Colours.text}
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

const styles = StyleSheet.create({
  // 🟢 Layout
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // 더 짙은 배경으로 프리미엄 느낌
    justifyContent: "flex-end", // 아래에서 위로 올라오게
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "85%", // 화면의 85% 차지
    overflow: "hidden",
    paddingTop: 10,
  },
  handleBar: {
    width: 50,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 60,
  },

  // 🟢 Header & Image
  headerSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  imageContainer: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 70, // 원형
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  perfumeImage: { width: "100%", height: "100%" },
  noImage: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    alignItems: "center",
    marginTop: 20,
    gap: 5,
  },
  brandText: {
    fontSize: 13,
    color: Colours.textDim,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colours.text,
    textAlign: "center",
  },

  // 🟢 Status Buttons
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 35,
  },
  favouriteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 10,
    minWidth: 160,
    justifyContent: "center",
  },
  favouriteBtnActive: {
    backgroundColor: "#111", // ❤️ 체크 시 검은색 배경
    borderColor: "#111",
  },
  btnText: { fontSize: 14, color: Colours.text, fontWeight: "600" },
  btnTextActive: { color: "#fff" }, // ❤️ 체크 시 하얀 글씨

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  deleteBtnText: { fontSize: 13, color: "#999", fontWeight: "600" },

  // 🟢 Main Accords (그래프 ⭐)
  accordsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colours.text,
    marginBottom: 20,
  },
  accordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // 행 사이 마진
  },
  accordLabelColumn: {
    width: 90, // 컬럼 너비 고정
    marginRight: 10,
  },
  accordLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colours.text,
    textTransform: "capitalize",
    marginBottom: 2,
  },
  accordValue: {
    fontSize: 11,
    color: Colours.textDim,
  },
  accordBarBackground: {
    flex: 1, // 남은 공간 차지
    height: 10, // 바 높이 늘림
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden", // 내부 바 잘리게
  },
  accordBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  emptyAccords: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
  },
  emptyText: { fontSize: 14, color: Colours.textDim },

  // 🟢 Close Button (최상단)
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 100,
    padding: 5,
  },
});
