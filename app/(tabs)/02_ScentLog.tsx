import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Months } from "@/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// Divide screen height by 7
const DATE_ITEM_HEIGHT = SCREEN_HEIGHT / 7;

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
  // Generate dates - Index 0: 29 days ago, Index 29: today
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

  // default selected: today and last item
  const [selectedDate, setSelectedDate] = useState<ScentLogItem>(
    logs[logs.length - 1],
  );

  const renderDateItem = ({ item }: { item: ScentLogItem }) => {
    const isSelected = selectedDate.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item)}
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          { height: DATE_ITEM_HEIGHT },
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
    <View style={styles.container}>
      {/* LEFT : date selector (Today: bottom) */}
      <View style={styles.leftColumn}>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderDateItem}
          showsVerticalScrollIndicator={false}
          snapToInterval={DATE_ITEM_HEIGHT}
          decelerationRate="fast"
          // Initial : today
          initialScrollIndex={29}
          getItemLayout={(data, index) => ({
            length: DATE_ITEM_HEIGHT,
            offset: DATE_ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>

      {/* RIGHT: Selected Date Details */}
      <View style={styles.rightColumn}>
        <Text style={styles.headerTitle}>
          {selectedDate.month} {selectedDate.day}
        </Text>

        {selectedDate.scents.map((scent, index) => (
          <View key={index} style={styles.scentRow}>
            <Text style={styles.slotLabel}>
              {["first", "second", "third"][index]}
            </Text>

            <TouchableOpacity style={styles.imageSlot}>
              {scent ? (
                <Image source={{ uri: scent.img }} style={styles.perfumeImg} />
              ) : (
                <View style={styles.addPlaceholder}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              )}
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
  /* Left Sidebar Styles */
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
  perfumeImg: {
    flex: 1,
    resizeMode: "contain",
  },
});
