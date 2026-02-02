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

import { modalStyles } from "@/src/components/common/modalStyles";
import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal";
import PerfumeCard from "@/src/components/shelf/PerfumeCard";
import { Btn, Card, Colours, Inuput, Layout } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/myPerfumeContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import { MyPerfume, Perfume } from "@/src/types/perfume";

/* ===============================
   화면 전용 타입
=============================== */
type MyPerfumeWithDetail = {
  perfume: Perfume;
  my: MyPerfume;
};

export default function ShelfScreen() {
  const { myPerfumes, addMyPerfume } = useMyPerfume();

  /* ===============================
     state
  =============================== */
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPerfume, setSelectedPerfume] =
    useState<MyPerfumeWithDetail | null>(null);

  // perfume detail data
  const myPerfumeWithDetail = myPerfumes
    .map((mp) => {
      const perfume = MainPerfumeList.find((p) => p.perfId === mp.perfId) as
        | Perfume
        | undefined; // << 여기서 캐스팅
      if (!perfume) return null;

      return {
        perfume,
        my: mp,
      };
    })
    .filter((v): v is MyPerfumeWithDetail => v !== null);

  const keyword = searchKeyword.trim().toLowerCase();

  const filteredMainPerfumes = MainPerfumeList.filter((p) => {
    const isInMyPerfumes = myPerfumes.some((mp) => mp.perfId === p.perfId);
    if (isInMyPerfumes) return false;

    if (!keyword) return true;

    return (
      p.name.toLowerCase().includes(keyword) ||
      p.brand.toLowerCase().includes(keyword)
    );
  });

  return (
    <SafeAreaView style={Layout.safeArea}>
      <View style={Layout.container}>
        {/* add to my shelf btn*/}
        <TouchableOpacity
          style={Btn.plusBtn}
          onPress={() => setAddModalVisible(true)}
        >
          <MaterialIcons name="add" size={22} color={Colours.border} />
        </TouchableOpacity>

        <Modal
          visible={addModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAddModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
            <View style={modalStyles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={modalStyles.modalContainer}>
                  <TextInput
                    style={Inuput.searchInput}
                    placeholder="search by name / brand"
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                    autoCapitalize="none"
                  />

                  <FlatList
                    data={filteredMainPerfumes}
                    keyExtractor={(item) => item.perfId}
                    style={{ height: 300 }}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={modalStyles.modalsearchItem}
                        onPress={() => {
                          addMyPerfume(item); // Perfume 전달
                          setAddModalVisible(false);
                          setSearchKeyword("");
                        }}
                      >
                        <Text>{item.name}</Text>
                        <Text>{item.brand}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <FlatList
          data={myPerfumeWithDetail}
          numColumns={Card.cols}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: Card.marginBottom,
          }}
          keyExtractor={(item) => item.perfume.perfId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedPerfume(item);
                setDetailModalVisible(true);
              }}
            >
              <PerfumeCard perfume={item.perfume} width={Card.width} />
            </TouchableOpacity>
          )}
        />

        {/* detail modal */}
        <PerfumeDetailModal
          visible={detailModalVisible}
          perfumeWithDetail={selectedPerfume} // MyPerfumeWithDetail
          onClose={() => setDetailModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
