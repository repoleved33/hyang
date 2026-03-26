import { AppText } from "@/src/components/common/AppText";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { usePerfumeActions } from "@/src/hooks/usePerfumehooks";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 💡 Grid Configuration
const cols = 2;
const gap = 20; // Increased gap to make boxes smaller and airy
const cardWidth = (SCREEN_WIDTH - gap * (cols + 1)) / cols;

export default function ShelfScreen() {
  const { myPerfumes, isLoading, addMyPerfume, toggleFavourite } =
    useMyPerfume();
  const { confirmRemove } = usePerfumeActions();
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<any>(null);

  const handleOpenSearch = () => setSearchModalVisible(true);

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
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>MY SHELF</AppText>
        <TouchableOpacity onPress={handleOpenSearch} hitSlop={10}>
          <Ionicons name="add-sharp" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <SearchPerfumeModal
        visible={searchModalVisible}
        excludeIds={myPerfumes.map((p) => p.perfId)}
        onSelect={handleSelectPerfume}
        onClose={() => setSearchModalVisible(false)}
      />

      <PerfumeDetailModal
        visible={detailModalVisible}
        perfume={selectedPerfume}
        onClose={() => setDetailModalVisible(false)}
      />

      {myPerfumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="flask-outline" size={50} color="#CCC" />
          <AppText style={styles.emptyTitle}>EMPTY SHELF</AppText>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={handleOpenSearch}
          >
            <AppText style={styles.emptyAddText}>ADD FIRST SCENT</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myPerfumes}
          keyExtractor={(item) => item.perfId}
          numColumns={cols}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Card Top Actions */}
              <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => toggleFavourite(item.perfId)}>
                  <Ionicons
                    name={item.isFavourite ? "heart" : "heart-outline"}
                    size={16}
                    color={item.isFavourite ? "#FF3B30" : "#DDD"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    confirmRemove(item.perfId, item.details?.name || "Scent")
                  }
                >
                  <Ionicons name="close-sharp" size={16} color="#DDD" />
                </TouchableOpacity>
              </View>

              {/* Card Body */}
              <TouchableOpacity
                style={styles.cardMain}
                onPress={() => handlePressDetail(item)}
                activeOpacity={0.8}
              >
                <View style={styles.imageBox}>
                  {item.details?.image_url ? (
                    <Image
                      source={{ uri: item.details.image_url }}
                      style={styles.image}
                    />
                  ) : (
                    <Ionicons name="beaker-outline" size={24} color="#EEE" />
                  )}
                </View>

                <View style={styles.infoBox}>
                  <AppText
                    style={styles.brandText}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                  >
                    {item.details?.brand || "UNKNOWN"}
                  </AppText>

                  <AppText
                    style={styles.nameText}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.7}
                  >
                    {item.details?.name || "SCENT"}
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingAddBtn}
        onPress={handleOpenSearch}
      >
        <Ionicons name="add-sharp" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F2F9", // Muted Purple theme
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
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  listContent: {
    paddingHorizontal: gap,
    paddingTop: 10,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  // 💡 Smaller, Sharp Card Design
  card: {
    width: cardWidth,
    height: cardWidth * 1.2, // Slightly vertical rectangle
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 0,
    marginBottom: gap,
    padding: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  cardMain: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageBox: {
    width: "100%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  infoBox: {
    width: "100%",
    alignItems: "center",
    marginTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: "#F5F5F5",
    paddingTop: 4,
  },
  brandText: {
    fontSize: 7,
    fontWeight: "800",
    color: "#AAA",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#222",
    marginTop: 1,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#AAA",
    marginTop: 20,
    letterSpacing: 3,
  },
  emptyAddBtn: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  emptyAddText: {
    fontSize: 10,
    fontWeight: "700",
    paddingBottom: 2,
  },
  floatingAddBtn: {
    position: "absolute",
    bottom: 35,
    right: 25,
    width: 52,
    height: 52,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
