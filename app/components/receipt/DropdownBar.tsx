import { Colours } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
const HEADERBAR_HEIGHT = 40;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DROPDOWN_HEIGHT = SCREEN_HEIGHT / 3.5;

interface DropdownProps {
  onSave: () => void;
}

export default function DropdownBar({ onSave }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const nextOpen = !isOpen;

    Animated.timing(animationController, {
      toValue: nextOpen ? 1 : 0, // 1: open, 0: close
      duration: 250, // 0.25 sec
      useNativeDriver: true, // 뭐노
    }).start();

    setIsOpen(nextOpen);
  };

  // -DROPDOWN_HEIGHT(hidden) -> 0(seen)
  const movedY = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [-DROPDOWN_HEIGHT, 0],
  });

  return (
    <>
      <View
        style={[
          styles.wrapper,
          {
            position: isOpen ? "absolute" : "relative",
            height: HEADERBAR_HEIGHT,
          },
        ]}
      >
        <StatusBar
          // 드롭다운이 열리면 글자를 하얗게(light), 닫히면 검게(dark) 혹은 그 반대
          barStyle={isOpen ? "light-content" : "dark-content"}
          // 안드로이드 배경색도 실시간 변경 가능
          backgroundColor={isOpen ? "black" : "white"}
          // translucent={true}
        />
        {/* 1. 드롭다운 밖 영역 (Backdrop) - 열렸을 때만 렌더링 */}
        {isOpen && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={toggleDropdown} // 밖을 누르면 닫힘
          />
        )}

        {/* header */}
        <TouchableOpacity
          style={styles.headerBar}
          onPress={toggleDropdown}
          activeOpacity={0.8}
        >
          <Text style={styles.headerText}>Option {isOpen ? "▲" : "▼"} </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              transform: [{ translateY: movedY }],
            },
          ]}
        >
          {/* contents - title */}
          <Text style={styles.dropdownText}>customise receipt</Text>

          {/* contents - option (last month / last week) */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => {
                onSave();
                toggleDropdown();
              }}
            >
              <Text style={styles.buttonText}>last month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn]}
              onPress={() => {
                onSave();
                toggleDropdown();
              }}
            >
              <Text style={styles.buttonText}>last week</Text>
            </TouchableOpacity>
          </View>

          {/* contents - icons */}
          <View style={styles.iconRow}>
            {/* <View style={styles.iconCircle}>
            <Ionicons name="arrow-down" size={24} color="black" />
          </View> */}
            <FontAwesome6 name="x-twitter" size={28} color="white" />
            <AntDesign name="instagram" size={32} color="white" />
            <FontAwesome6 name="tiktok" size={28} color="white" />
          </View>

          {/* contents - footer */}

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>tips | </Text>

            <Text style={styles.footerText}>Founder</Text>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: -500,
    left: -100,
    right: -100,

    height: SCREEN_HEIGHT * 2,
    backgroundColor: Colours.transparentBackground,
    zIndex: 50,
  },
  wrapper: {
    zIndex: 100,
    width: "100%",
    backgroundColor: "transparent",
    height: HEADERBAR_HEIGHT,
    overflow: "visible",
  },
  headerBar: {
    zIndex: 120,
    height: HEADERBAR_HEIGHT,
    backgroundColor: Colours.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    color: Colours.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownContainer: {
    zIndex: 110,
    position: "absolute", // layer on main screen
    height: DROPDOWN_HEIGHT,
    top: 0, // start point - header
    left: 0,
    right: 0,
    backgroundColor: Colours.primary,
    alignItems: "center",
    paddingTop: HEADERBAR_HEIGHT + 10,
    paddingVertical: 20,
    overflow: "hidden",
  },
  dropdownText: {
    color: Colours.secondary,
    fontSize: 18,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 30,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colours.secondary,
    minWidth: 110,
    alignItems: "center",
  },
  buttonText: {
    color: Colours.secondary,
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: Colours.secondary,
    fontSize: 12,
  },
});
