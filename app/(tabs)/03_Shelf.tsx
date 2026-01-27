import { modalStyles } from "@/app/components/common/modalStyles";
import PerfumeDetailModal from "@/app/components/common/PerfumeDetailModal";
import PerfumeCard from "@/app/components/shelf/PerfumeCard";
import { Btn, Card, Colours, Inuput, Layout } from "@/constants/theme";
import { useMyPerfume } from "@/context/myPerfumeContext";
import { dummyMainPerfumes } from "@/data/dummyMainPerfumes";
import { MaterialIcons } from "@expo/vector-icons";
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

import { SafeAreaView } from "react-native-safe-area-context";

export default function ShelfScreen() {
  const { myPerfumes, addMyPerfume } = useMyPerfume();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const keyword = searchKeyword.trim().toLowerCase();
  const filteredMainPerfumes = dummyMainPerfumes.filter((p) => {
    // except my perfume list
    const isInMyPerfumes = myPerfumes.some((mp) => mp.id === p.id);
    if (isInMyPerfumes) return false;
    // search keyword filter
    if (!keyword) return true;
    return (
      p.name.toLowerCase().includes(keyword) ||
      p.brand.toLowerCase().includes(keyword)
    );
  });

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<any>(null);

  return (
    <SafeAreaView style={Layout.safeArea}>
      <View style={Layout.container}>
        {/* Button - add to my perfume */}
        <TouchableOpacity
          style={Btn.plusBtn}
          onPress={() => setAddModalVisible(true)}
        >
          <MaterialIcons name="add" size={22} color={Colours.border} />
        </TouchableOpacity>
        {/* Modal - add to my perfume */}
        <Modal
          visible={addModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAddModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
            <View style={modalStyles.modalBackground}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={modalStyles.modalContainer}>
                  <TextInput
                    style={Inuput.searchInput}
                    placeholder="search by name/brand"
                    placeholderTextColor={modalStyles.modalText.color}
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                    autoCapitalize="none"
                    returnKeyType="search"
                  />
                  {/* Modal -> search from main perfume list */}
                  <FlatList
                    data={filteredMainPerfumes}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    style={{ height: 300 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={modalStyles.modalsearchItem}
                        onPress={() => {
                          addMyPerfume(item);
                          setAddModalVisible(false);
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
                  <TouchableOpacity
                    style={Btn.closeBtn}
                    onPress={() => setAddModalVisible(false)}
                  >
                    <Text style={modalStyles.modalText}>close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* my perfume list */}
        <FlatList
          data={myPerfumes}
          numColumns={Card.cols}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: Card.marginBottom,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedPerfume(item);
                setDetailModalVisible(true);
              }}
            >
              <PerfumeCard perfume={item} width={Card.width} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        ></FlatList>
        {/* Modal - perfume details */}
        <PerfumeDetailModal
          visible={detailModalVisible}
          perfume={selectedPerfume}
          onClose={() => setDetailModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
