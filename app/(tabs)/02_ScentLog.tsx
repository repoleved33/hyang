import { AppText } from "@/src/components/common/AppText";
import MyFavListModal from "@/src/components/common/MyFavListModal";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { Months } from "@/src/constants/Theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { useScentLog } from "@/src/context/ScentLogContext";
import { useUser } from "@/src/context/UserContext";
import { ScentLog } from "@/src/types/scentLog";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "@/src/styles/02_ScentLog.styles";
import { headerStyles } from "@/src/styles/commonHeader.styles";

interface ScentLogItem {
  id: string;
  day: number;
  month: string;
  dateString: string;
}

export default function ScentLogScreen() {
  const { userInfo } = useUser();

  const insets = useSafeAreaInsets();

  const { scentLogs, upsertScentLog, deleteScentLog, selectLogs } =
    useScentLog();

  const { myPerfumes } = useMyPerfume();

  useFocusEffect(
    useCallback(() => {
      selectLogs();
    }, []),
  );

  const [listHeight, setListHeight] = useState(0);

  const dateItemHeight = listHeight / 8;

  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  const [favModalVisible, setFavModalVisible] = useState(false);

  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const favIds = useMemo(() => {
    return myPerfumes.filter((p) => p.isFavourite).map((p) => p.perfId);
  }, [myPerfumes]);

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

  const selectedDayEntries = useMemo(() => {
    const dayLogs = scentLogs.filter(
      (log) => log.date === selectedDate.dateString,
    );

    const slots = [null, null, null] as any[];

    dayLogs.forEach((log) => {
      slots[log.orderIdx - 1] = log;
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

  const handleSelectPerfume = (perfume: any) => {
    if (activeSlotIdx === null) return;

    const newLogData: ScentLog = {
      userId: userInfo?.authCode ?? "",
      date: selectedDate.dateString,
      perfId: perfume.perfId || "",
      name: perfume.name,
      brand: perfume.brand,
      orderIdx: activeSlotIdx + 1,
    };

    upsertScentLog(newLogData);

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

    if (logToDelete?.idx) {
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
          {
            height: dateItemHeight,
          },
        ]}
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

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
      onLayout={onLayout}
    >
      <View style={headerStyles.header}>
        <AppText style={headerStyles.headerTitle}>Scent Log</AppText>
      </View>

      <View style={styles.contentBody}>
        <View style={styles.leftColumn}>
          {listHeight > 0 && (
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id}
              renderItem={renderDateItem}
              showsVerticalScrollIndicator={false}
              snapToInterval={dateItemHeight}
              decelerationRate="fast"
              initialScrollIndex={23}
              getItemLayout={(_, index) => ({
                length: dateItemHeight,
                offset: dateItemHeight * index,
                index,
              })}
            />
          )}
        </View>

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
                  <AppText style={styles.plusText}>+</AppText>
                ) : perfume.imageUrl ? (
                  <Image
                    source={{
                      uri: perfume.imageUrl,
                    }}
                    style={styles.perfumeImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.textDetailsSlot}>
                    <AppText style={styles.brandText}>{perfume.brand}</AppText>

                    <AppText style={styles.nameText}>{perfume.name}</AppText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <MyFavListModal
        visible={favModalVisible}
        onClose={() => setFavModalVisible(false)}
        onSelect={(id) => {
          const found = myPerfumes.find((p) => p.perfId === id);

          if (found) {
            handleSelectPerfume({
              perfId: found.perfId,
              brand: found.details?.brand,
              name: found.details?.name,
            });
          }
        }}
        onDelete={handleDeleteCurrSlot}
        onSearchOpen={() => {
          setFavModalVisible(false);

          setTimeout(() => {
            setSearchModalVisible(true);
          }, 300);
        }}
      />

      <SearchPerfumeModal
        visible={searchModalVisible}
        excludeIds={favIds}
        onSelect={handleSelectPerfume}
        onClose={() => setSearchModalVisible(false)}
        isLogScreen={true}
      />
    </View>
  );
}
