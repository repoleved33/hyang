import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";

import { AppText } from "@/src/components/common/AppText";
import { Colours } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import DropdownBar from "../../src/components/receipt/DropdownBar";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ReceiptScreen() {
  const { scentLogs } = useScentLog();
  const receiptRef = useRef<View>(null); // receipt pointer
  const [period, setPeriod] = useState<7 | 30>(30); // period options

  // calculate counting
  const topTenPerfumes = useMemo(() => {
    const endDate = new Date(); // now
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    const filteredLogs = scentLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });

    const logCnts: { [key: string]: number } = {};
    filteredLogs.forEach((log) => {
      logCnts[log.perfId] = (logCnts[log.perfId] || 0) + 1;
    });

    return Object.entries(logCnts)
      .map(([perfId, count]) => {
        const details = MainPerfumeList.find((p) => p.perfId === perfId);
        return {
          perfId,
          count,
          name: details?.name || "Unknown",
          brand: details?.brand || "Unknown",
        }; // details showing on receipt
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); //only top 10 perf
  }, [scentLogs, period]);

  const totalScentCnt = topTenPerfumes.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  // share event
  const handleShare = async () => {
    try {
      if (!receiptRef.current) return;
      const uri = await captureRef(receiptRef, { format: "png", quality: 1.0 });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
      //저장완료 메세지 추가
      if (Platform.OS === "android") {
        ToastAndroid.show("공유 준비 완료!🎉", ToastAndroid.SHORT);
      }
      {
        // if needed
        /*
      Alert.alert("Share Receipt", "Choose an action", [
        {
          text: "Save to Gallery",
          onPress: async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === "granted") {
              await MediaLibrary.saveToLibraryAsync(uri);
              Alert.alert("Saved!", "Receipt saved to gallery.");
            }
          },
        },
        {
          text: "Send to Others",
          onPress: async () => {
            if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
      */
      }
    } catch (err) {
      Alert.alert("Error", "Failed to process image.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <DropdownBar
          onSave={(val) => setPeriod(val as 7 | 30)}
          onShare={handleShare}
        />
      </View>
      {/* Body */}
      <View ref={receiptRef} collapsable={false} style={styles.captureArea}>
        {/* Background Image && Capture Area */}
        <ImageBackground
          source={require("@/assets/images/receiptBG.jpg")}
          style={styles.saveContainer}
          resizeMode="cover"
        >
          {/* Contents */}
          <View style={styles.paperWrapper}>
            <View style={styles.receiptPaper}>
              <AppText style={styles.divider}>
                --------------------------------------
              </AppText>
              {/* header - title */}
              <View style={styles.headerTitle}>
                <AppText style={styles.title}>HYANGRECEIPT</AppText>
                <AppText style={styles.subTitle}>
                  LAST {period === 7 ? "WEEK" : "MONTH"}
                </AppText>
                {/* header - info */}
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

              {/* table - header */}
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

              {/* table - item top 10 list */}
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

              {/* footer */}

              <View style={styles.footerSection}>
                <AppText style={styles.divider}>
                  --------------------------------------
                </AppText>
                <View style={styles.rowHeader}>
                  <AppText style={styles.receiptText}>TOTAL ITEMS:</AppText>
                  <AppText style={styles.receiptText}>
                    {topTenPerfumes.length}
                  </AppText>
                </View>
                <View style={styles.rowHeader}>
                  <AppText style={styles.receiptText}>TOTAL SCENTS:</AppText>
                  <AppText style={styles.receiptText}>{totalScentCnt}</AppText>
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
                  THANK YOU FOR VISITING! ||||||||||||||||||||||||||||||
                </AppText>
                <AppText style={styles.receiptText}>HYANG 2026</AppText>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

// receipt item component
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
  container: {
    flex: 1,
    backgroundColor: Colours.background,
  },
  topBar: {
    zIndex: 9999,
    width: "100%",
    position: "absolute",
    top: 50,
  },
  captureArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: "hidden",
  },
  saveContainer: {
    // BG Image
    width: "100%",
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  paperWrapper: {
    backgroundColor: Colours.transparentBackground,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.7, // 화면 높이에 비례한 고정 높이
    // elevation: 15,
  },
  receiptPaper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // justifyContent: "space-between",
  },
  divider: {
    textAlign: "center",
    fontSize: 10,
    // opacity: 0.5,
    margin: 10,
  },
  headerTitle: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colours.text,
    letterSpacing: 3,
  },
  subTitle: {
    fontSize: 14,
    color: Colours.textDim,
  },
  headerInfo: {
    fontSize: 14,
    marginTop: 5,
    alignItems: "center",
  },
  receiptText: {
    fontSize: 10,
    color: Colours.text,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginVertical: 1,
  },
  itemRowContainer: {
    height: 30,
    // marginVertical: 1,
    justifyContent: "center",
  },
  textOverlay: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  footerSection: { marginTop: 5 },
  footerInfo: { marginVertical: 8, alignItems: "center" },
});
