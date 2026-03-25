import MyFavListModal from "@/src/components/scentlog/MyFavListModal";
import { Months } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";
import { ScentLog } from "@/src/types/scentLog";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText } from "@/src/components/common/AppText";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScentLogItem {
  id: string;
  day: number;
  month: string;
  dateString: string;
}

export default function ScentLogScreen() {
  const insets = useSafeAreaInsets();
  const { scentLogs, upsertScentLog, deleteScentLog, clearAllLogs } =
    useScentLog();
  const { myPerfumes } = useMyPerfume();

  const [listHeight, setListHeight] = useState(0);
  const dateItemHeight = listHeight / 7;

  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
  const [favModalVisible, setFavModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  // 1. favourite list (for exception)
  const favIds = useMemo(
    () => myPerfumes.filter((p) => p.isFavourite).map((p) => p.perfId),
    [myPerfumes],
  );

  // 2. dates list (30 days)
  const logs: ScentLogItem[] = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        id: `date-${i}`,
        day: date.getDate(),
        month: Months[date.getMonth()],
        dateString: date.toISOString().split("T")[0],
      };
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState<ScentLogItem>(logs[29]);

  // 3. match selected date<->data details
  const selectedDayEntries = useMemo(() => {
    const dayLogs = scentLogs.filter(
      (log) => log.date === selectedDate.dateString,
    );
    const slots = [null, null, null] as (any | null)[];

    dayLogs.forEach((log) => {
      if (log.details) {
        slots[log.orderIdx - 1] = {
          ...log.details,
          imageUrl: log.details.image_url || log.details.imageUrl,
          logIdx: log.idx,
        };
      }
    });
    return slots;
  }, [selectedDate.dateString, scentLogs]);

  const onLayout = (event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height);
  };

  const handleOpenModal = (idx: number) => {
    setActiveSlotIdx(idx);
    setFavModalVisible(true);
  };

  // 4. if select perfume
  const handleSelectPerfume = (perfume: any) => {
    if (activeSlotIdx === null) return;

    const newLogData: ScentLog = {
      userId: "u001",
      date: selectedDate.dateString,
      perfId: perfume.perfId || "",
      orderIdx: activeSlotIdx + 1,
    };

    // pass object
    upsertScentLog(newLogData, perfume);

    setFavModalVisible(false);
    setSearchModalVisible(false);
  };

  const handleDeleteCurrSlot = () => {
    if (activeSlotIdx === null) return;
    const logToDelete = scentLogs.find(
      (log) =>
        log.date === selectedDate.dateString &&
        log.orderIdx === activeSlotIdx + 1,
    );
    if (logToDelete) {
      deleteScentLog(logToDelete.idx);
      setFavModalVisible(false);
    }
  };

  const renderDateItem = ({ item }: { item: ScentLogItem }) => {
    const isSelected = selectedDate.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item)}
        style={[styles.dateItem, { height: dateItemHeight }]}
      >
        {/* 💡 선택 시 왼쪽 검은색 바 표시 */}
        {isSelected && <View style={styles.selectedBar} />}

        <AppText style={[styles.monthLabel, isSelected && { color: "#111" }]}>
          {item.month.slice(0, 3)}
        </AppText>
        <AppText
          style={[styles.dateText, isSelected && styles.selectedDateText]}
        >
          {item.day}
        </AppText>
      </TouchableOpacity>
    );
  };

  const handleClearAll = () => {
    Alert.alert("[TEST] Data All Clear", "cannot be undone", [
      { text: "cancel", style: "cancel" },
      {
        text: "delete",
        style: "destructive",
        onPress: async () => {
          try {
            await clearAllLogs();
            console.log("🧹 Scent Logs - all cleared");
          } catch (e) {
            console.error("❌ Scent Logs - Clear Failed:", e);
          }
        },
      },
    ]);
  };

  const handleCheckLogs = () => {
    Alert.alert("Debug", `Data #: ${scentLogs.length} (check logs)`);
    console.log("========================================");
    console.log(
      "🚀 [DEBUG] scentLogs List:",
      JSON.stringify(scentLogs, null, 2),
    );
    console.log("========================================");
  };

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      onLayout={onLayout}
    >
      {/* LEFT : Date Selector */}
      <View style={styles.leftColumn}>
        {listHeight > 0 && (
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={renderDateItem}
            showsVerticalScrollIndicator={false}
            snapToInterval={dateItemHeight}
            decelerationRate="fast"
            initialScrollIndex={23} // show 7 days
            getItemLayout={(_, index) => ({
              length: dateItemHeight,
              offset: dateItemHeight * index,
              index,
            })}
          />
        )}
      </View>

      {/* RIGHT: Details View */}
      <View style={styles.rightColumn}>
        <AppText style={styles.headerTitle}>
          {selectedDate.month} {selectedDate.day}
        </AppText>

        {selectedDayEntries.map((perfume, index) => (
          <View key={index} style={styles.scentRow}>
            <View style={styles.labelWrapper}>
              <AppText style={styles.slotLabel}># 0{index + 1}</AppText>
              <View style={styles.verticalLine} />
            </View>

            <TouchableOpacity
              style={[
                styles.imageSlot,
                perfume ? styles.filledSlotBorder : styles.emptySlotBorder,
              ]}
              onPress={() => handleOpenModal(index)}
            >
              {perfume ? (
                <View style={styles.filledSlot}>
                  <Image
                    source={{ uri: perfume.imageUrl || perfume.image_url }}
                    style={styles.perfumeImg}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.addPlaceholder}>
                  <AppText style={styles.plusText}>+</AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 🧪 TEST */}
      <View style={styles.testFrame}>
        <View style={styles.testLabelContainer}>
          <AppText style={styles.testLabelText}>TEST MODE</AppText>
        </View>
        <View style={styles.testButtonGroupInner}>
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: "#4A90E2" }]}
            onPress={handleCheckLogs}
          >
            <AppText style={styles.testButtonText}>Logs</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: "#E94E77" }]}
            onPress={handleClearAll}
          >
            <AppText style={styles.testButtonText}>Delete all</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <MyFavListModal
        visible={favModalVisible}
        onClose={() => setFavModalVisible(false)}
        onSelect={(id) => {
          // only from myperfumes
          const found = myPerfumes.find((p) => p.perfId === id);
          if (found) handleSelectPerfume(found.details);
        }}
        onDelete={handleDeleteCurrSlot}
        onSearchOpen={() => {
          setFavModalVisible(false);
          setTimeout(() => setSearchModalVisible(true), 300);
        }}
      />

      <SearchPerfumeModal
        visible={searchModalVisible}
        excludeIds={favIds}
        onSelect={(perfume) => handleSelectPerfume(perfume)}
        onClose={() => setSearchModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F7F2F9",
  },
  leftColumn: {
    width: 70,
    backgroundColor: "#111111",
    borderRightWidth: 0,
  },
  dateItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  selectedBar: {
    position: "absolute",
    left: 0,
    width: 4,
    height: "25%",
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  // 💡 월 라벨: 선택 시 더 밝은 보라색으로 잘 보이게 수정
  monthLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#8E82A8", // 💡 블랙 위에서도 잘 보이는 연보라톤
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
    opacity: 0.6,
  },
  dateText: {
    fontSize: 16,
    color: "#444444", // 비선택 날짜는 어둡게
    fontWeight: "600",
  },
  // 💡 선택된 날짜: 확실하게 화이트로
  selectedDateText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 22,
  },
  rightColumn: {
    flex: 1,
    padding: 25,
    paddingTop: 80,
    backgroundColor: "#F7F2F9",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 45,
    letterSpacing: -1.5,
    color: "#111111",
    textTransform: "uppercase",
  },
  scentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  labelWrapper: {
    alignItems: "center",
    marginRight: 20,
    width: 35,
  },
  slotLabel: {
    fontSize: 11,
    color: "#5C5470",
    fontWeight: "900",
    opacity: 0.4,
    marginBottom: 8,
  },
  verticalLine: {
    width: 1,
    height: 50,
    backgroundColor: "#111111",
    opacity: 0.15,
  },
  imageSlot: {
    flex: 1,
    height: 130,
    borderRadius: 12,
    overflow: "hidden",
  },
  emptySlotBorder: {
    borderWidth: 1,
    borderColor: "#111111",
    opacity: 0.1,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  filledSlotBorder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(17, 17, 17, 0.05)",
    shadowColor: "#5C5470",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  addPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 20,
    color: "#111111",
    opacity: 0.2,
    fontWeight: "200",
  },
  filledSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  perfumeImg: {
    width: "85%",
    height: "75%",
  },
  testFrame: {
    position: "absolute",
    bottom: 30,
    right: 15,
    borderWidth: 1,
    borderColor: "#111111",
    borderStyle: "dashed",
    borderRadius: 4,
    padding: 10,
    paddingTop: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 9999,
  },
  testLabelContainer: {
    position: "absolute",
    top: -10,
    left: 8,
    backgroundColor: "#111111",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  testLabelText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  testButtonGroupInner: { flexDirection: "row", gap: 6 },
  testButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60,
    alignItems: "center",
  },
  testButtonText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
});
