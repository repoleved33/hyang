import MyFavListModal from "@/src/components/scentlog/MyFavListModal";
import { Colours, Months } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";
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

import { ScentLog } from "@/src/types/scentLog";

import { AppText } from "@/src/components/common/AppText";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";

interface ScentLogItem {
  id: string;
  day: number;
  month: string;
  dateString: string;
}

export default function ScentLogScreen() {
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
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          { height: dateItemHeight },
        ]}
      >
        <AppText style={styles.monthLabel}>{item.month}</AppText>
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
    <View style={styles.container} onLayout={onLayout}>
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
            initialScrollIndex={29}
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
            <AppText style={styles.slotLabel}>
              {["first", "second", "third"][index]}
            </AppText>
            <TouchableOpacity
              style={styles.imageSlot}
              onPress={() => handleOpenModal(index)}
            >
              {perfume ? (
                <View style={styles.filledSlot}>
                  <Image
                    source={
                      perfume.imageUrl
                        ? { uri: perfume.imageUrl }
                        : perfume.image_url
                          ? { uri: perfume.image_url }
                          : require("@/assets/images/default-perfume.png")
                    }
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
    backgroundColor: Colours.background,
  },
  leftColumn: {
    width: 75,
    backgroundColor: Colours.background,
    borderRightWidth: 1,
    borderRightColor: Colours.border,
  },
  dateItem: { justifyContent: "center", alignItems: "center" },
  selectedDateItem: { backgroundColor: Colours.background },
  monthLabel: {
    fontSize: 11,
    fontWeight: "600",
    fontStyle: "italic",
    color: Colours.secondary,
    marginBottom: 2,
  },
  dateText: { fontSize: 18, color: "#AAAAAA" },
  selectedDateText: { color: Colours.primary, fontWeight: "900" },
  rightColumn: { flex: 1, padding: 25, paddingTop: 80 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 40,
    textTransform: "uppercase",
  },
  scentRow: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  slotLabel: {
    width: 65,
    fontSize: 13,
    color: Colours.text,
    fontWeight: "400",
    textTransform: "lowercase",
  },
  imageSlot: { flex: 1, height: 120, marginLeft: 10 },
  addPlaceholder: {
    flex: 1,
    backgroundColor: Colours.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colours.border,
  },
  plusText: { fontSize: 24, color: Colours.text, fontWeight: "300" },
  filledSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.cardBackground,
    borderWidth: 1,
    borderColor: Colours.border,
  },
  perfumeImg: { width: "80%", height: "70%" },
  testFrame: {
    position: "absolute",
    bottom: 30,
    right: 15,
    borderWidth: 2,
    borderColor: "#AAAAAA",
    borderStyle: "dashed",
    borderRadius: 15,
    padding: 10,
    paddingTop: 18,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 9999,
    elevation: 10,
  },
  testLabelContainer: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#AAAAAA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  testLabelText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  testButtonGroupInner: { flexDirection: "row", gap: 8 },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  testButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "bold" },
});
