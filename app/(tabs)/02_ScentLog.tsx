import MyFavListModal from "@/src/components/scentlog/MyFavListModal";
import { Months } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScentLog } from "@/src/types/scentLog";

interface ScentLogItem {
  id: string;
  day: number;
  month: string;
  dateString: string;
}

export default function ScentLogScreen() {
  const { scentLogs, upsertScentLog } = useScentLog();
  const [listHeight, setListHeight] = useState(0);
  const dateItemHeight = listHeight / 7;

  const [favModalVisible, setFavModalVisible] = useState(false);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  // dates listup
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

  // data matching
  const selectedDayEntries = useMemo(() => {
    const dayLogs = scentLogs.filter(
      (log) => log.date === selectedDate.dateString,
    );
    const slots = [null, null, null] as (any | null)[];

    dayLogs.forEach((log) => {
      const detail = MainPerfumeList.find((p) => p.perfId === log.perfId);
      if (detail) slots[log.orderIdx - 1] = { ...detail, logIdx: log.idx };
    });
    return slots;
  }, [selectedDate, scentLogs]);

  const onLayout = (event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height);
  };

  const handleOpenModal = (idx: number) => {
    setActiveSlotIdx(idx);
    setFavModalVisible(true);
  };

  const handleSelectPerfume = (perfId: string) => {
    if (activeSlotIdx === null) return;

    const currSlot = selectedDayEntries[activeSlotIdx];

    const newLogData: ScentLog = {
      idx: currSlot ? currSlot.logIdx : 0,
      userId: "u001", // auth 대체
      date: selectedDate.dateString,
      perfId: perfId,
      orderIdx: activeSlotIdx + 1,
    };
    upsertScentLog(newLogData);
    setFavModalVisible(false);
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
        <Text style={styles.monthLabel}>{item.month}</Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {item.day}
        </Text>
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>
          {selectedDate.month} {selectedDate.day}
        </Text>

        {selectedDayEntries.map((perfume, index) => (
          <View key={index} style={styles.scentRow}>
            <Text style={styles.slotLabel}>
              {["first", "second", "third"][index]}
            </Text>
            <TouchableOpacity
              style={styles.imageSlot}
              onPress={() => handleOpenModal(index)}
            >
              {perfume ? (
                <View style={styles.filledSlot}>
                  <Image
                    source={
                      typeof perfume.imageUrl === "string"
                        ? { uri: perfume.imageUrl }
                        : perfume.imageUrl
                    }
                    style={styles.perfumeImg}
                    resizeMode="contain"
                  />
                  <Text style={styles.perfumeName} numberOfLines={1}>
                    {perfume.name}
                  </Text>
                </View>
              ) : (
                <View style={styles.addPlaceholder}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <MyFavListModal
        visible={favModalVisible}
        onClose={() => setFavModalVisible(false)}
        onSelect={handleSelectPerfume}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#fff" },
  leftColumn: {
    width: 75,
    backgroundColor: "#F5F5F5",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  dateItem: { justifyContent: "center", alignItems: "center" },
  selectedDateItem: { backgroundColor: "#fff" },
  monthLabel: {
    fontSize: 11,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#000",
    marginBottom: 2,
    fontFamily: "serif",
  },
  dateText: { fontSize: 18, color: "#AAAAAA" },
  selectedDateText: { color: "#000", fontWeight: "900" },
  rightColumn: { flex: 1, padding: 25, paddingTop: 80 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 40,
    textTransform: "uppercase",
    fontFamily: "serif",
  },
  scentRow: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  slotLabel: {
    width: 65,
    fontSize: 13,
    color: "#000",
    fontWeight: "400",
    textTransform: "lowercase",
  },
  imageSlot: { flex: 1, height: 120, marginLeft: 10 },
  addPlaceholder: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  plusText: { fontSize: 24, color: "#BBB", fontWeight: "300" },
  filledSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  perfumeImg: { width: "80%", height: "70%" },
  perfumeName: { fontSize: 10, marginTop: 4, color: "#666" },
});
