import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText } from "../common/AppText";

// Constants for layout
const HEADERBAR_HEIGHT = 45;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const DROPDOWN_HEIGHT = 220; // Explicit height for the dropdown content

interface DropdownProps {
  onSave: (period: number) => void;
  onShare: () => void;
}

export default function DropdownBar({ onSave, onShare }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  // Toggle animation: 0 is closed (hidden behind header), 1 is open
  const toggleDropdown = () => {
    const nextOpen = !isOpen;
    Animated.timing(animationController, {
      toValue: nextOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(nextOpen);
  };

  // Interpolate Y position: starts hidden above the bar, slides down to view
  const translateY = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [-DROPDOWN_HEIGHT, 0],
  });

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle={isOpen ? "light-content" : "dark-content"} />

      {/* 1. Backdrop: Dims the background when open */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={toggleDropdown}
        />
      )}

      {/* 2. Dropdown Container: Slides out from behind the header */}
      <Animated.View
        style={[styles.dropdownContainer, { transform: [{ translateY }] }]}
      >
        <View style={styles.contentInner}>
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

          {/* Share Button Section */}
          <View style={styles.shareActionRow}>
            <TouchableOpacity
              style={styles.paperPlaneBtn}
              onPress={() => {
                onShare();
                toggleDropdown();
              }}
            >
              <Ionicons name="paper-plane-outline" size={20} color="white" />
              <AppText style={styles.shareBtnText}>SHARE</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <AppText style={styles.footerText}>tips | Founder</AppText>
          </View>
        </View>
      </Animated.View>

      {/* 3. Header Bar: The black trigger bar, stays on top of the dropdown */}
      <TouchableOpacity
        style={styles.headerBar}
        onPress={toggleDropdown}
        activeOpacity={1}
      >
        <AppText style={styles.headerText}>Option {isOpen ? "▲" : "▼"}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Wrapper needs a high zIndex to stay above main screen content
  wrapper: {
    zIndex: 5000,
    width: "100%",
    height: HEADERBAR_HEIGHT,
  },
  // Background overlay when the dropdown is active
  backdrop: {
    position: "absolute",
    top: 0,
    left: -SCREEN_WIDTH, // Cover full width even if parent is narrower
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 10,
  },
  // The trigger bar itself
  headerBar: {
    height: HEADERBAR_HEIGHT,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100, // Higher than dropdownContainer
  },
  headerText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // The animated sliding part
  dropdownContainer: {
    position: "absolute",
    top: HEADERBAR_HEIGHT, // Starts exactly below the header bar
    left: 0,
    right: 0,
    height: DROPDOWN_HEIGHT,
    backgroundColor: "black",
    zIndex: 50, // Lower than headerBar to appear "behind" it
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  contentInner: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  dropdownText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "white",
    minWidth: 110,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  shareActionRow: {
    marginBottom: 20,
  },
  paperPlaneBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    gap: 10,
    borderWidth: 0.5,
    borderColor: "#444",
  },
  shareBtnText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
  },
  footerRow: {
    marginTop: 5,
  },
  footerText: {
    color: "white",
    fontSize: 11,
    opacity: 0.5,
  },
});
