import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal";
import SearchPerfumeModal from "@/src/components/scentlog/SearchPerfumeModal";
import PerfumeCard from "@/src/components/shelf/PerfumeCard";
import { Btn, Card, Colours, Layout } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";

export default function ShelfScreen() {
  const { myPerfumes, addMyPerfume } = useMyPerfume();

  const [searchPerfumeModalVisible, setSearchPerfumeModalVisible] =
    useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // based on perfume id
  const [selectedPerfId, setSelectedPerfId] = useState<string | null>(null);

  // my perfume listup
  const myPerfumeIds = useMemo(
    () => myPerfumes.map((p) => p.perfId),
    [myPerfumes],
  );

  return (
    <SafeAreaView style={Layout.safeArea}>
      <View style={Layout.container}>
        {/* add to my shelf*/}
        <TouchableOpacity
          style={Btn.plusBtn}
          onPress={() => setSearchPerfumeModalVisible(true)}
        >
          <MaterialIcons name="add" size={22} color={Colours.border} />
        </TouchableOpacity>

        <SearchPerfumeModal
          visible={searchPerfumeModalVisible}
          mainPerfumes={MainPerfumeList}
          excludeIds={myPerfumeIds}
          onSelect={addMyPerfume}
          onClose={() => setSearchPerfumeModalVisible(false)}
        />

        {/* my shelf list*/}
        <FlatList
          data={myPerfumes}
          numColumns={Card.cols}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: Card.marginBottom,
          }}
          keyExtractor={(item) => item.perfId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const detail = MainPerfumeList.find(
              (p) => p.perfId === item.perfId,
            );
            if (!detail) return null;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedPerfId(item.perfId);
                  setDetailModalVisible(true);
                }}
              >
                <PerfumeCard
                  perfume={detail}
                  width={Card.width}
                  isFavourite={item.isFavourite}
                />
              </TouchableOpacity>
            );
          }}
        />
        {/* clicked -> detail modal */}
        <PerfumeDetailModal
          visible={detailModalVisible}
          selectedPerfId={selectedPerfId}
          onClose={() => {
            setDetailModalVisible(false);
            setSelectedPerfId(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
