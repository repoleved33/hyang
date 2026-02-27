import MyFavListModal from "@/src/components/scentlog/MyFavListModal";
import { Colours, Months } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import React, { useMemo, useState } from "react";
import {
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
import { ScentLog } from "@/src/types/scentLog";

interface ScentLogItem {
  id: string;
  day: number;
  month: string;
  dateString: string;
}

export default function ScentLogScreen() {
  const { scentLogs, upsertScentLog, deleteScentLog } = useScentLog();
  const [listHeight, setListHeight] = useState(0);
  const dateItemHeight = listHeight / 7;

  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  const [favModalVisible, setFavModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const { myPerfumes } = useMyPerfume();

  // my fav perfume listup
  const favIds = useMemo(
    () => myPerfumes.filter((p) => p.isFavourite).map((p) => p.perfId),
    [myPerfumes],
  );

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

  const handleDeleteCurrSlot = () => {
    if (activeSlotIdx === null) return;
    const logToDelete = scentLogs.find(
      (log) =>
        log.date === selectedDate.dateString &&
        log.orderIdx === activeSlotIdx + 1,
    );
    if (logToDelete) {
      console.log(
        "delete date: ",
        logToDelete.date,
        " idx: ",
        logToDelete.orderIdx,
      );
      deleteScentLog(logToDelete.idx);
      setFavModalVisible(false);
    } else {
      console.log("No data");
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
                      typeof perfume.imageUrl === "string"
                        ? { uri: perfume.imageUrl }
                        : perfume.imageUrl
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

      <MyFavListModal
        visible={favModalVisible}
        onClose={() => setFavModalVisible(false)}
        onSelect={handleSelectPerfume}
        onDelete={handleDeleteCurrSlot}
        onSearchOpen={() => {
          setFavModalVisible(false);
          setTimeout(() => setSearchModalVisible(true), 300);
        }}
      />

      <SearchPerfumeModal
        visible={searchModalVisible}
        mainPerfumes={MainPerfumeList}
        excludeIds={favIds}
        onSelect={(perfume) => handleSelectPerfume(perfume.perfId)}
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
  // perfumeName: { fontSize: 10, marginTop: 4, color: "#666" },
});
