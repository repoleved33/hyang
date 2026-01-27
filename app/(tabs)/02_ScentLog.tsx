import React, { useMemo, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Months } from "@/src/constants/theme";

// Types
interface ScentData {
  id: string;
  img: string;
  name: string;
}

interface ScentLogItem {
  id: string;
  day: number;
  month: string;
  dateString: string;
  scents: (ScentData | null)[];
}

export default function ScentLog() {
  // State for dynamic height calculation
  const [listHeight, setListHeight] = useState(0);
  const dateItemHeight = listHeight / 7;

  const logs: ScentLogItem[] = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        id: `date-${i}`,
        day: date.getDate(),
        month: Months[date.getMonth()],
        dateString: date.toDateString(),
        scents: [null, null, null],
      };
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState<ScentLogItem>(
    logs[logs.length - 1],
  );

  // Measure the actual available height of the container
  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setListHeight(height);
  };

  const renderDateItem = ({ item }: { item: ScentLogItem }) => {
    const isSelected = selectedDate.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item)}
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          { height: dateItemHeight }, // Use calculated height
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
      {/* LEFT : date selector */}
      <View style={styles.leftColumn}>
        {listHeight > 0 && ( // Render only after height is measured
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={renderDateItem}
            showsVerticalScrollIndicator={false}
            snapToInterval={dateItemHeight}
            decelerationRate="fast"
            initialScrollIndex={29}
            getItemLayout={(data, index) => ({
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
        {/* Detail Slots ... */}
        {selectedDate.scents.map((_, index) => (
          <View key={index} style={styles.scentRow}>
            <Text style={styles.slotLabel}>
              {["first", "second", "third"][index]}
            </Text>
            <TouchableOpacity style={styles.imageSlot}>
              <View style={styles.addPlaceholder}>
                <Text style={styles.plusText}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  leftColumn: {
    width: 75,
    backgroundColor: "#F5F5F5",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  dateItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDateItem: {
    backgroundColor: "#fff",
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#000",
    marginBottom: 2,
    fontFamily: "serif",
  },
  dateText: {
    fontSize: 18,
    color: "#AAAAAA",
  },
  selectedDateText: {
    color: "#000",
    fontWeight: "900",
  },
  rightColumn: {
    flex: 1,
    padding: 25,
    paddingTop: 80,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 40,
    textTransform: "uppercase",
    fontFamily: "serif",
  },
  scentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  slotLabel: {
    width: 65,
    fontSize: 13,
    color: "#000",
    fontWeight: "400",
    textTransform: "lowercase",
  },
  imageSlot: {
    flex: 1,
    height: 120,
    marginLeft: 10,
  },
  addPlaceholder: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  plusText: {
    fontSize: 24,
    color: "#BBB",
    fontWeight: "300",
  },
});
