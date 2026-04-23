import { Colours, Input } from "@/src/constants/Theme";
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

  const commonInputStyle = [
    Input.searchInput,
    {
      borderRadius: 15,
      borderWidth: 1,
      borderColor: Colours.white,
      paddingHorizontal: 15,
      backgroundColor: Colours.transparentBlack,
      marginTop: 8,
      height: 45,
    },
  ];

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

            {/* SHELF NAME */}
            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>SHELF NAME</AppText>
              <TextInput
                style={commonInputStyle}
                value={tempName}
                onChangeText={setTempName}
                placeholder="ENTER USER NAME"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>

            {/* RECEIPT CARD HOLDER */}
            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>RECEIPT CARD HOLDER</AppText>
              <TextInput
                style={commonInputStyle}
                value={tempHolder}
                onChangeText={setTempHolder}
                placeholder="CARD HOLDER NAME"
                placeholderTextColor="#666"
                autoCapitalize="characters"
              />
            </View>

            {/* CUSTOM CODE */}
            <View style={styles.inputGroup}>
              <AppText style={styles.inputLabel}>CUSTOM CODE</AppText>
              <TextInput
                style={commonInputStyle}
                value={tempCode}
                onChangeText={setTempCode}
                placeholder="4-DIGIT CODE"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={4}
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
