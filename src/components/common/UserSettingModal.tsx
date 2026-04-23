import { useUser } from "@/src/context/UserContext";
import { styles } from "@/src/styles/UserSettingModal.styles"; // 별도 스타일 파일 추천
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

  // 내부 수정을 위한 임시 상태
  const [tempName, setTempName] = useState("");
  const [tempCode, setTempCode] = useState("");
  const [tempHolder, setTempHolder] = useState("");

  // 모달이 열릴 때 현재 유저 정보로 초기화
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
            <AppText style={styles.title}>USER PROFILE</AppText>

            {/* Read-only Auth Code Section */}
            <View style={styles.authSection}>
              <AppText style={styles.label}>SPECIAL AUTH CODE</AppText>
              <AppText style={styles.authValue}>{userInfo?.authCode}</AppText>
            </View>

            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>SHELF NAME</AppText>
              <TextInput
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="ENTER USER NAME"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>RECEIPT CARD HOLDER</AppText>
              <TextInput
                style={styles.input}
                value={tempHolder}
                onChangeText={setTempHolder}
                placeholder="CARD HOLDER NAME"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>CUSTOM CODE</AppText>
              <TextInput
                style={styles.input}
                value={tempCode}
                onChangeText={setTempCode}
                placeholder="4-DIGIT CODE"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onClose}
              >
                <AppText style={styles.cancelBtnText}>CANCEL</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleSave}
              >
                <AppText style={styles.saveBtnText}>SAVE</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
