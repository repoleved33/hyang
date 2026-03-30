import MyFavListModal from "@/src/components/common/MyFavListModal";
import { Months } from "@/src/constants/theme";
import { useScentLog } from "@/src/context/ScentLogContext";
import { ScentLog } from "@/src/types/scentLog";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  LayoutChangeEvent,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText } from "@/src/components/common/AppText";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { styles } from "@/src/styles/02_ScentLog.styles";
import { headerStyles } from "@/src/styles/commonHeader.styles";
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
  const dateItemHeight = listHeight / 8; // space between dates

  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
  const [favModalVisible, setFavModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  // favourite list (for exception)
  const favIds = useMemo(
    () => myPerfumes.filter((p) => p.isFavourite).map((p) => p.perfId),
    [myPerfumes],
  );

  // dates list (30 days)
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

  // match selected date<->data details
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

  // if select perfume
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
        {isSelected && <View style={styles.selectedBar} />}
        <AppText
          style={[styles.monthLabel, isSelected && styles.monthLabelSelected]}
        >
          {item.month.slice(0, 3)}
        </AppText>
        <AppText
          style={[styles.dateText, isSelected && styles.dateTextSelected]}
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
      {/* Header */}

      <View style={headerStyles.header}>
        <AppText style={headerStyles.headerTitle}>Scent Log</AppText>
      </View>

      <View style={styles.contentBody}>
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
          {selectedDayEntries.map((perfume, index) => (
            <View key={index} style={styles.scentRow}>
              <View style={styles.labelWrapper}>
                <AppText style={styles.slotLabel}># 0{index + 1}</AppText>
                <View style={styles.verticalLine} />
              </View>

              <TouchableOpacity
                style={[
                  styles.imageSlot,
                  perfume ? styles.filledSlot : styles.emptySlot,
                ]}
                onPress={() => handleOpenModal(index)}
              >
                {!perfume ? (
                  /* 1. no data */
                  <AppText style={styles.plusText}>+</AppText>
                ) : perfume.imageUrl || perfume.image_url ? (
                  /* 2. no data & image */
                  <Image
                    source={{ uri: perfume.imageUrl || perfume.image_url }}
                    style={styles.perfumeImg}
                    resizeMode="contain"
                  />
                ) : (
                  /* 3. data & no image */
                  <View style={styles.textDetailsSlot}>
                    <AppText style={styles.brandText} numberOfLines={1}>
                      {perfume.brand}
                    </AppText>
                    <AppText style={styles.nameText} numberOfLines={2}>
                      {perfume.name}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      {/* [TEST] */}
      <View style={styles.testFrame}>
        <View style={styles.testLabelContainer}>
          <AppText style={styles.testLabelText}>TEST MODE</AppText>
        </View>

        <View style={styles.testButtonGroupInner}>
          <TouchableOpacity
            style={styles.testButtonLog}
            onPress={handleCheckLogs}
          >
            <AppText style={styles.testButtonText}>Logs</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButtonDelete}
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
          console.log("✅ selected ID: ", id);
          // only from myperfumes
          const found = myPerfumes.find((p) => p.perfId === id);
          if (found) {
            console.log("✅ found details: ", found.details);
            handleSelectPerfume(found.details);
          } else {
            console.log("❌ ID not exist");
          }
        }}
        onDelete={handleDeleteCurrSlot}
        onSearchOpen={() => {
          console.log("🔍 Open Search");
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
