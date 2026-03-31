import { AppText } from "@/src/components/common/AppText";
import { useScentLog } from "@/src/context/ScentLogContext";
import { styles } from "@/src/styles/01_Receipt.styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ImageBackground,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

export default function ReceiptScreen() {
  const navigation = useNavigation();
  const [isTabBarVisible, setIsTabBarVisible] = useState(false);

  const { scentLogs } = useScentLog();
  const receiptRef = useRef<View>(null);
  const [period, setPeriod] = useState<7 | 30>(30);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleTabBar = () => {
    const parent = navigation.getParent();
    if (!parent) return;

    // 💡 현재 상태 반전시켜서 애니메이션 실행
    const toValue = isTabBarVisible ? -100 : 0;

    // 💡 부모(TabsLayout)의 tabBarStyle에 직접 애니메이션 명령
    parent.setOptions({
      tabBarStyle: {
        height: 65,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: toValue, // 💡 여기서 바로 꽂아넣음
        backgroundColor: "#1E1E26", // Colours.tabBarBg
      },
    });

    setIsTabBarVisible(!isTabBarVisible);
  };

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
          format: "png",
          quality: 0.8,
        });

        console.log("📸 Capture Success:", uri);
        Alert.alert("📸 Capture Success!");

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable && uri) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "Share your Hyang Receipt",
            UTI: "public.png", // for iOS stability
          });
        } else {
          Alert.alert("Error", "Sharing is not available on this device.");
        }
      } catch (error) {
        console.error("❌ Share Error:", error);
        Alert.alert("Error", "Failed to process receipt image.");
      }
    }, 500);
  };

  const DashedLine = () => (
    <View style={styles.dashedWrapper}>
      <AppText style={styles.dashedText} numberOfLines={1} ellipsizeMode="clip">
        ----------------------------------------------------------------------
      </AppText>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={toggleTabBar}>
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
              source={require("@/assets/images/receiptBG.png")}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={styles.paperWrapper}>
                <View style={styles.receiptPaper}>
                  <View style={styles.headerTitle}>
                    <AppText style={styles.title}>HYANGRECEIPT</AppText>
                    <AppText style={styles.subTitle}>
                      LAST {period === 7 ? "WEEK" : "MONTH"}
                    </AppText>
                    <View style={styles.headerInfo}>
                      <AppText style={styles.receiptText}>
                        INVOICE NO: #0001
                      </AppText>
                      <AppText style={styles.receiptText}>
                        DATE: {new Date().toDateString().toUpperCase()}
                      </AppText>
                      <AppText style={styles.receiptText}>CASHER: </AppText>
                    </View>
                  </View>
                  <DashedLine />

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
                  <DashedLine />
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
                    <DashedLine />
                    <View style={styles.rowHeader}>
                      <AppText style={styles.receiptText}>
                        TOTAL SCENTS:
                      </AppText>
                      <AppText style={styles.receiptText}>
                        {topTenPerfumes.length}
                      </AppText>
                    </View>
                    <View style={styles.rowHeader}>
                      <AppText style={styles.receiptText}>
                        TOTAL SPRAYS:
                      </AppText>
                      <AppText style={styles.receiptText}>
                        {totalScentCnt}
                      </AppText>
                    </View>
                    <DashedLine />

                    <View style={styles.footerInfo}>
                      <AppText style={styles.receiptText}>
                        CARD #: **** **** **** {new Date().getFullYear()}
                      </AppText>
                      <AppText style={styles.receiptText}>
                        AUTH CODE: {Math.floor(1000 + Math.random() * 9000)}
                      </AppText>
                      <AppText style={styles.receiptText}>CARDHOLDER:</AppText>
                    </View>
                    <AppText style={styles.receiptTextThanks}>
                      THANKS FOR YOUR SPRAY
                    </AppText>
                    <AppText style={styles.receiptTextCenter}>
                      [BARCODE IMAGE]
                    </AppText>
                    <AppText style={styles.receiptTextCenter}>
                      HYANG 2026
                    </AppText>
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
              <AppText style={styles.dropdownTitle}>SHARE YOUR HYANG</AppText>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.filterBtn, period === 30 && styles.activeBtn]}
                  onPress={() => {
                    setPeriod(30);
                    setModalVisible(false);
                  }}
                >
                  <AppText style={styles.buttonText}>LAST MONTH</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterBtn, period === 7 && styles.activeBtn]}
                  onPress={() => {
                    setPeriod(7);
                    setModalVisible(false);
                  }}
                >
                  <AppText style={styles.buttonText}>LAST WEEK</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.shareActionRow}>
                <TouchableOpacity
                  style={styles.paperPlaneBtn}
                  onPress={handleShare}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name="paper-plane-outline"
                      size={20}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.closeAction}
                onPress={() => setModalVisible(false)}
              >
                <AppText style={styles.closeText}>CLOSE ▲</AppText>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

function ItemRow({ num, name, brand, cnt }: any) {
  return (
    <View style={styles.itemRowContainer}>
      <View style={styles.textOverlay}>
        <AppText style={styles.receiptTextNo}>{num}</AppText>
        <View style={{ flex: 1 }}>
          <AppText
            style={[styles.receiptText, { fontSize: 10 }]}
            numberOfLines={2}
          >
            {name.toUpperCase()} - {brand.toUpperCase()}
          </AppText>
          {/* <AppText style={[styles.subTitle, { fontSize: 8 }]}>
            {brand.toUpperCase()}
          </AppText> */}
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
