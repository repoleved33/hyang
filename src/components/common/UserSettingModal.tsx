import { Colours } from "@/src/constants/Theme";
import { useUser } from "@/src/context/UserContext";
import { styles } from "@/src/styles/UserSettingModal.styles";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppText } from "./AppText";

interface UserSettingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UserSettingModal({
  visible,
  onClose,
}: UserSettingModalProps) {
  const { userInfo, updateUserInfo } = useUser();
  const [tempCode, setTempCode] = useState("");
  const [tempHolder, setTempHolder] = useState("");

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(animValue, {
        toValue: 1,
        friction: 6, // strength
        tension: 40, // speed
        useNativeDriver: true,
      }).start();

      if (userInfo) {
        setTempCode(userInfo.customCode || "");
        setTempHolder(userInfo.cardholderName || "");
      }
    } else {
      animValue.setValue(0);
    }
  }, [visible, userInfo]);

  const animatedCardStyle = {
    opacity: animValue,
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [500, 0], // from bottom to 0
        }),
      },
    ],
  };

  useEffect(() => {
    if (visible && userInfo) {
      setTempCode(userInfo.customCode || "");
      setTempHolder(userInfo.cardholderName || "");
    }
  }, [visible, userInfo]);

  const handleSave = () => {
    updateUserInfo({
      customCode: tempCode,
      cardholderName: tempHolder,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      // animationType="fade"
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.container, animatedCardStyle]}>
            <View style={styles.charcoalVerticalStripe} />
            <View style={styles.container}>
              <View style={styles.content}>
                <AppText style={styles.cardBrand}>HYANG CHECK</AppText>

                <View style={styles.inputSection}>
                  <View style={styles.inputGroup}>
                    <AppText style={styles.infoLabel}>SPECIAL CODE</AppText>
                    <View style={styles.sharedInputBox}>
                      <TextInput
                        style={styles.sharedTextInput}
                        value={tempCode}
                        onChangeText={setTempCode}
                        placeholder="0000"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        maxLength={4}
                        selectionColor={Colours.lavender}
                        cursorColor={Colours.lavender}
                      />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <AppText style={styles.infoLabel}>CARD HOLDER</AppText>
                    <View style={styles.sharedInputBox}>
                      <TextInput
                        style={styles.sharedTextInput}
                        value={tempHolder}
                        onChangeText={setTempHolder}
                        placeholder="NAME"
                        placeholderTextColor="#999"
                        autoCapitalize="characters"
                        selectionColor={Colours.lavender}
                        cursorColor={Colours.lavender}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <AppText style={styles.saveBtnText}>SAVE</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
