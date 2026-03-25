import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import { AppText } from "@/src/components/common/AppText";
import { Colours } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ReceiptScreen() {
  const { scentLogs } = useScentLog();
  const receiptRef = useRef<View>(null);
  const [period, setPeriod] = useState<7 | 30>(30);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation for smooth sliding dropdown
  const slideAnim = useRef(new Animated.Value(-400)).current;

  const toggleMenu = (visible: boolean) => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -400,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    toggleMenu(modalVisible);
  }, [modalVisible]);

  const topTenPerfumes = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    const filteredLogs = scentLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });

    const logDataMap: { [key: string]: { count: number; details: any } } = {};
    filteredLogs.forEach((log) => {
      if (!logDataMap[log.perfId]) {
        logDataMap[log.perfId] = { count: 0, details: log.details };
      }
      logDataMap[log.perfId].count += 1;
    });

    return Object.entries(logDataMap)
      .map(([perfId, data]) => ({
        perfId,
        count: data.count,
        name: data.details?.name || "Unknown Scent",
        brand: data.details?.brand || "Unknown Brand",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [scentLogs, period]);

  const totalScentCnt = topTenPerfumes.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  const handleShare = async () => {
    setModalVisible(false);

    setTimeout(async () => {
      try {
        if (!receiptRef.current) return;
        const uri = await captureRef(receiptRef, {
          format: "jpg",
          quality: 0.7,
        });

        if (uri) {
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(uri);
            //
            // setTimeout(() => {
            //   Alert.alert("Done", "Shared! 🎉");
            // }, 10);
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to share.");
      }
    }, 400);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Menu Trigger */}
      <TouchableOpacity
        style={styles.headerBar}
        onPress={() => setModalVisible(true)}
        activeOpacity={1}
      >
        <AppText style={styles.headerText}>
          OPTION {modalVisible ? "▲" : "▼"}
        </AppText>
      </TouchableOpacity>

      <View style={styles.captureArea}>
        <View
          ref={receiptRef}
          collapsable={false}
          style={styles.receiptContainer}
        >
          <ImageBackground
            source={require("@/assets/images/receiptBG.jpg")}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.paperWrapper}>
              <View style={styles.receiptPaper}>
                <AppText style={styles.divider}>
                  --------------------------------------
                </AppText>
                <View style={styles.headerTitle}>
                  <AppText style={styles.title}>HYANGRECEIPT</AppText>
                  <AppText style={styles.subTitle}>
                    LAST {period === 7 ? "WEEK" : "MONTH"}
                  </AppText>
                  <View style={styles.headerInfo}>
                    <AppText style={styles.receiptText}>
                      ORDER #0001 FOR USER |{" "}
                      {new Date().toDateString().toUpperCase()}
                    </AppText>
                  </View>
                </View>
                <AppText style={styles.divider}>
                  --------------------------------------
                </AppText>

                <View style={styles.rowHeader}>
                  <AppText style={[styles.receiptText, { width: 25 }]}>
                    NO
                  </AppText>
                  <AppText style={[styles.receiptText, { flex: 1 }]}>
                    ITEM
                  </AppText>
                  <AppText
                    style={[
                      styles.receiptText,
                      { width: 30, textAlign: "right" },
                    ]}
                  >
                    FREQ
                  </AppText>
                </View>
                <AppText style={styles.divider}>
                  --------------------------------------
                </AppText>

                <View>
                  {topTenPerfumes.map((item, index) => (
                    <ItemRow
                      key={item.perfId}
                      num={String(index + 1).padStart(2, "0")}
                      name={item.name}
                      brand={item.brand}
                      cnt={String(item.count)}
                    />
                  ))}
                </View>

                <View style={styles.footerSection}>
                  <AppText style={styles.divider}>
                    --------------------------------------
                  </AppText>
                  {/* Fixed: div tag removed, View used */}
                  <View style={styles.rowHeader}>
                    <AppText style={styles.receiptText}>TOTAL ITEMS:</AppText>
                    <AppText style={styles.receiptText}>
                      {topTenPerfumes.length}
                    </AppText>
                  </View>
                  <View style={styles.rowHeader}>
                    <AppText style={styles.receiptText}>TOTAL SCENTS:</AppText>
                    <AppText style={styles.receiptText}>
                      {totalScentCnt}
                    </AppText>
                  </View>
                  <View style={styles.footerInfo}>
                    <AppText style={styles.receiptText}>
                      CARD #: **** **** **** 2026
                    </AppText>
                    <AppText style={styles.receiptText}>
                      AUTH CODE: {Math.floor(1000 + Math.random() * 9000)}
                    </AppText>
                  </View>
                  <AppText style={styles.receiptText}>
                    THANK YOU FOR VISITING! ||||||||||||||||||||
                  </AppText>
                  <AppText style={styles.receiptText}>HYANG 2026</AppText>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <AppText style={styles.dropdownTitle}>customise receipt</AppText>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.filterBtn, period === 30 && styles.activeBtn]}
                onPress={() => {
                  setPeriod(30);
                  setModalVisible(false);
                }}
              >
                <AppText style={styles.buttonText}>last month</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterBtn, period === 7 && styles.activeBtn]}
                onPress={() => {
                  setPeriod(7);
                  setModalVisible(false);
                }}
              >
                <AppText style={styles.buttonText}>last week</AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.shareActionRow}>
              <TouchableOpacity
                style={styles.paperPlaneBtn}
                onPress={handleShare}
              >
                <Ionicons name="paper-plane-outline" size={20} color="white" />
                <AppText style={styles.shareBtnText}>SHARE</AppText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeAction}
              onPress={() => setModalVisible(false)}
            >
              <AppText style={styles.closeText}>close ▲</AppText>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

function ItemRow({ num, name, brand, cnt }: any) {
  return (
    <View style={styles.itemRowContainer}>
      <View style={styles.textOverlay}>
        <AppText style={[styles.receiptText, { width: 25 }]}>{num}</AppText>
        <View style={{ flex: 1 }}>
          <AppText
            style={[styles.receiptText, { fontSize: 10 }]}
            numberOfLines={1}
          >
            {name.toUpperCase()}
          </AppText>
          <AppText style={[styles.subTitle, { fontSize: 8 }]}>{brand}</AppText>
        </View>
        <AppText
          style={[styles.receiptText, { width: 30, textAlign: "right" }]}
        >
          {cnt}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  headerBar: {
    height: 45,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    zIndex: 100,
  },
  headerText: { color: "white", fontSize: 14, fontWeight: "700" },
  captureArea: { flex: 1, backgroundColor: "#F7F2F9" },
  receiptContainer: { flex: 1 },
  backgroundImage: { flex: 1, alignItems: "center", justifyContent: "center" },
  paperWrapper: {
    backgroundColor: Colours.transparentBackground,
    width: SCREEN_WIDTH * 0.82,
    paddingVertical: 10,
    borderRadius: 0,
  },
  receiptPaper: { paddingHorizontal: 20, paddingVertical: 10 },
  divider: { textAlign: "center", fontSize: 10, marginVertical: 8 },
  headerTitle: { alignItems: "center", paddingVertical: 10 },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colours.text,
    letterSpacing: 2,
  },
  subTitle: { fontSize: 14, color: Colours.textDim },
  headerInfo: { fontSize: 11, marginTop: 5, alignItems: "center" },
  receiptText: { fontSize: 10, color: Colours.text },
  rowHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemRowContainer: { height: 32, justifyContent: "center" },
  textOverlay: { flexDirection: "row", alignItems: "center" },
  footerSection: { marginTop: 10 },
  footerInfo: { marginVertical: 8, alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-start",
  },
  modalContent: {
    backgroundColor: "black",
    paddingTop: 110,
    paddingBottom: 30,
    alignItems: "center",
    borderRadius: 0,
  },
  dropdownTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  buttonRow: { flexDirection: "row", gap: 15, marginBottom: 25 },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "white",
    minWidth: 110,
    alignItems: "center",
    borderRadius: 0,
  },
  activeBtn: { backgroundColor: "#333" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 12 },
  shareActionRow: { marginBottom: 20 },
  paperPlaneBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 0,
    gap: 10,
    borderWidth: 0.5,
    borderColor: "#444",
  },
  shareBtnText: { color: "white", fontWeight: "900", fontSize: 14 },
  closeAction: { marginTop: 10 },
  closeText: { color: "white", fontSize: 12, opacity: 0.6 },
});
