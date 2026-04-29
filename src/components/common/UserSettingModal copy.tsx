import { useUser } from "@/src/context/UserContext";
import { styles } from "@/src/styles/UserSettingModal.styles";
import React, { useEffect, useState } from "react";
import {
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

  const [tempName, setTempName] = useState("");
  const [tempCode, setTempCode] = useState("");
  const [tempHolder, setTempHolder] = useState("");

  useEffect(() => {
    if (visible && userInfo) {
      setTempName(userInfo.userName || "");
      setTempCode(userInfo.customCode || "");
      setTempHolder(userInfo.cardholderName || "");
    }
  }, [visible, userInfo]);

  const handleSave = () => {
    updateUserInfo({
      userName: tempName,
      customCode: tempCode,
      cardholderName: tempHolder,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.container}>
            <View style={styles.charcoalVerticalStripe} />

            <View style={styles.content}>
              <AppText style={styles.cardBrand}>HYANG CHECK</AppText>

              <View style={styles.inputSection}>
                <View style={styles.inputGroup}>
                  <AppText style={styles.infoLabel}>SHELF NAME</AppText>
                  <View style={styles.sharedInputBox}>
                    <TextInput
                      style={styles.sharedTextInput}
                      value={tempName}
                      onChangeText={setTempName}
                      placeholder="SHELF NAME"
                      placeholderTextColor="#999"
                      autoCapitalize="characters"
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
                    />
                  </View>
                </View>

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
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <AppText style={styles.saveBtnText}>SAVE</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
