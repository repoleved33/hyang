import { AppText } from "@/src/components/common/AppText";
import { Colours } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal"; // 💡 상세 모달 임포트 확인
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { usePerfumeActions } from "@/src/hooks/usePerfumehooks";
export default function ShelfScreen() {
  const { myPerfumes, isLoading, addMyPerfume, toggleFavourite } =
    useMyPerfume();
  const { confirmRemove } = usePerfumeActions();
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<any>(null);

  const handleOpenSearch = () => {
    setSearchModalVisible(true);
  };

  const handleSelectPerfume = async (perfume: any) => {
    await addMyPerfume(perfume);
    setSearchModalVisible(false);
  };

  const handlePressDetail = (perfume: any) => {
    setSelectedPerfume({
      ...perfume.details,
      perfId: perfume.perfId,
      isFavourite: perfume.isFavourite,
    });
    setDetailModalVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colours.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>My Shelf</AppText>
        <TouchableOpacity
          onPress={handleOpenSearch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={28} color={Colours.text} />
        </TouchableOpacity>

        {/* Search Modal */}
        <SearchPerfumeModal
          visible={searchModalVisible}
          excludeIds={myPerfumes.map((p) => p.perfId)}
          onSelect={(perfume) => handleSelectPerfume(perfume)}
          onClose={() => setSearchModalVisible(false)}
        />
      </View>

      {/* Detail Modal */}
      <PerfumeDetailModal
        visible={detailModalVisible}
        perfume={selectedPerfume}
        onClose={() => setDetailModalVisible(false)}
      />

      {myPerfumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="flask-outline" size={60} color={Colours.textDim} />
          </View>
          <AppText style={styles.emptyTitle}>
            Your shelf seems lonely...
          </AppText>
          <AppText style={styles.emptySub}>
            Search and add your favorite perfumes!
          </AppText>
        </View>
      ) : (
        <FlatList
          data={myPerfumes}
          keyExtractor={(perfume) => perfume.perfId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* onclick - details modal */}
              <TouchableOpacity
                style={styles.cardMainAction}
                onPress={() => handlePressDetail(item)}
              >
                <View style={styles.imageBox}>
                  {item.details?.image_url ? (
                    <Image
                      source={{ uri: item.details.image_url }}
                      style={styles.image}
                    />
                  ) : (
                    <Ionicons name="beaker-outline" size={30} color="#ddd" />
                  )}
                </View>

                <View style={styles.infoBox}>
                  <AppText style={styles.brandText}>
                    {item.details?.brand}
                  </AppText>
                  <AppText style={styles.nameText}>
                    {item.details?.name}
                  </AppText>
                </View>
              </TouchableOpacity>

              <View style={styles.actionBox}>
                <TouchableOpacity onPress={() => toggleFavourite(item.perfId)}>
                  <Ionicons
                    name={item.isFavourite ? "heart" : "heart-outline"}
                    size={24}
                    color={item.isFavourite ? "#ff4d4d" : Colours.textDim}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  onPress={() =>
                    confirmRemove(
                      item.perfId,
                      item.details?.name || "Unknown Scent",
                    )
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={Colours.textDim}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.floatingAddBtn}
        onPress={handleOpenSearch}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF9FF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111111",
    letterSpacing: -0.5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#5C5470",
    opacity: 0.2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 15,
    color: "#5C5470",
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 22,
  },
  floatingAddBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 15,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5C5470",
    shadowColor: "#5C5470",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardMainAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#FEF9FF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#5C5470",
    opacity: 0.8,
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  infoBox: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  brandText: {
    fontSize: 11,
    color: "#5C5470",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
    opacity: 0.5,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
  },
  actionBox: {
    paddingLeft: 10,
    alignItems: "center",
  },
});
