import { modalStyles } from "@/src/components/common/modalStyles";
import { Btn, Inuput } from "@/src/constants/theme";
import { Perfume } from "@/src/types/perfume";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
                style={Inuput.searchInput}
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
                    <Text style={modalStyles.modalItemSearchName}>
                      {item.name}
                    </Text>
                    <Text style={modalStyles.modalItemSearchBrand}>
                      {item.brand}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={Btn.closeBtn} onPress={onClose}>
                <Text style={modalStyles.modalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
