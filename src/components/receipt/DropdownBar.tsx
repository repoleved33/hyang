import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// FontAwesome 혹은 Ionicons에서 종이비행기 가져오기
import { Colours } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../common/AppText";

const HEADERBAR_HEIGHT = 40;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DROPDOWN_HEIGHT = SCREEN_HEIGHT / 3; // 버튼이 추가되어 높이를 조금 늘림

interface DropdownProps {
  onSave: (period: number) => void;
  onShare: () => void; // 공유 함수 프롭 추가
}

export default function DropdownBar({ onSave, onShare }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const nextOpen = !isOpen;
    Animated.timing(animationController, {
      toValue: nextOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setIsOpen(nextOpen);
  };

  const movedY = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [-DROPDOWN_HEIGHT, 0],
  });

  return (
    <View
      style={[
        styles.wrapper,
        {
          position: isOpen ? "absolute" : "relative",
          height: HEADERBAR_HEIGHT,
        },
      ]}
    >
      <StatusBar barStyle={isOpen ? "light-content" : "dark-content"} />

      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={toggleDropdown}
        />
      )}

      <TouchableOpacity
        style={styles.headerBar}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <AppText style={styles.headerText}>
          Option {isOpen ? "▲" : "▼"}{" "}
        </AppText>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.dropdownContainer,
          { transform: [{ translateY: movedY }] },
        ]}
      >
        <AppText style={styles.dropdownText}>customise receipt</AppText>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => {
              onSave(30);
              toggleDropdown();
            }}
          >
            <AppText style={styles.buttonText}>last month</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => {
              onSave(7);
              toggleDropdown();
            }}
          >
            <AppText style={styles.buttonText}>last week</AppText>
          </TouchableOpacity>
        </View>

        {/* --- 공유(종이비행기) 버튼 영역 --- */}
        <View style={styles.shareActionRow}>
          <TouchableOpacity
            style={styles.paperPlaneBtn}
            onPress={() => {
              onShare(); // 부모의 공유 함수 실행
              toggleDropdown(); // 닫기
            }}
          >
            <Ionicons name="paper-plane-outline" size={24} color="white" />
            <AppText style={styles.shareBtnText}>SHARE</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <AppText style={styles.footerText}>tips | Founder</AppText>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: -500,
    left: -100,
    right: -100,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: Colours.modalBackground,
    zIndex: 50,
  },
  wrapper: { zIndex: 100, width: "100%", backgroundColor: "transparent" },
  headerBar: {
    zIndex: 120,
    height: HEADERBAR_HEIGHT,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { color: "white", fontSize: 14, fontWeight: "600" },
  dropdownContainer: {
    zIndex: 110,
    position: "absolute",
    height: DROPDOWN_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    alignItems: "center",
    paddingTop: HEADERBAR_HEIGHT + 20,
  },
  dropdownText: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "monospace",
  },
  buttonRow: { flexDirection: "row", gap: 20, marginBottom: 20 },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "white",
    minWidth: 100,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 12 },

  // 종이비행기 버튼 스타일
  shareActionRow: { marginBottom: 20 },
  paperPlaneBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    gap: 10,
  },
  shareBtnText: { color: "white", fontWeight: "800", fontSize: 13 },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    marginBottom: 15,
  },
  footerRow: { flexDirection: "row", marginTop: 5 },
  footerText: { color: "white", fontSize: 11, opacity: 0.6 },
});
