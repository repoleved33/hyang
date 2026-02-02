import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal";
import AddMyShelfModal from "@/src/components/shelf/AddMyShelfModal";
import PerfumeCard from "@/src/components/shelf/PerfumeCard";
import { Btn, Card, Colours, Layout } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/myPerfumeContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import { MyPerfume, Perfume } from "@/src/types/perfume";

type MyPerfumeWithDetail = {
  perfume: Perfume;
  my: MyPerfume;
};

export default function ShelfScreen() {
  const { myPerfumes, addMyPerfume } = useMyPerfume();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPerfume, setSelectedPerfume] =
    useState<MyPerfumeWithDetail | null>(null);

  // perfume detail data
  const myPerfumeWithDetail = myPerfumes
    .map((mp) => {
      const perfume = MainPerfumeList.find((p) => p.perfId === mp.perfId) as
        | Perfume
        | undefined; //
      if (!perfume) return null;

      return {
        perfume,
        my: mp,
      };
    })
    .filter((v): v is MyPerfumeWithDetail => v !== null);

  const myPerfumesPerfId = myPerfumes.map((p) => p.perfId);

  return (
    <SafeAreaView style={Layout.safeArea}>
      <View style={Layout.container}>
        {/* add to my shelf*/}
        <TouchableOpacity
          style={Btn.plusBtn}
          onPress={() => setAddModalVisible(true)}
        >
          <MaterialIcons name="add" size={22} color={Colours.border} />
        </TouchableOpacity>
        <AddMyShelfModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          mainPerfumes={MainPerfumeList}
          myPerfumesPerfId={myPerfumesPerfId}
          addMyPerfume={addMyPerfume}
        />
        {/* my shelf list*/}
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
              <PerfumeCard
                perfume={item.perfume}
                width={Card.width}
                isFavourite={item.my.isFavourite}
              />
            </TouchableOpacity>
          )}
        />
        {/* clicked -> detail modal */}
        <PerfumeDetailModal
          visible={detailModalVisible}
          perfumeWithDetail={selectedPerfume} // MyPerfumeWithDetail
          onClose={() => setDetailModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
