import { modalStyles } from "@/src/components/common/modalStyles";
import { Btn, Input } from "@/src/constants/theme";
import { Perfume } from "@/src/types/perfume";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppText } from "./AppText";

interface perfumeSearchModalProps {
  visible: boolean;
  onClose: () => void;
  mainPerfumes: Perfume[];
  excludeIds?: string[];
  onSelect: (perfume: Perfume) => void;
}

export default function SearchPerfumeModal({
  visible,
  onClose,
  mainPerfumes,
  excludeIds = [],
  onSelect,
}: perfumeSearchModalProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const keyword = searchKeyword.trim().toLowerCase();

  const filteredMainPerfumes = mainPerfumes.filter((p) => {
    if (excludeIds.includes(p.perfId)) return false;
    if (!keyword) return true;
    return (
      p.name.toLowerCase().includes(keyword) ||
      p.brand.toLowerCase().includes(keyword)
    );
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.modalContainer}>
              <TextInput
                style={Input.searchInput}
                placeholder="Search by name/brand"
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                autoCapitalize="none"
              />

              <FlatList
                data={filteredMainPerfumes}
                keyExtractor={(item) => item.perfId}
                style={{ maxHeight: 300 }}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={modalStyles.modalsearchItem}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                      setSearchKeyword("");
                    }}
                  >
                    <AppText style={modalStyles.modalItemSearchName}>
                      {item.name}
                    </AppText>
                    <AppText style={modalStyles.modalItemSearchBrand}>
                      {item.brand}
                    </AppText>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={Btn.closeBtn} onPress={onClose}>
                <AppText style={modalStyles.modalText}>Close</AppText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
