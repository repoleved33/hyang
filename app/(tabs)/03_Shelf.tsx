import { AppText } from "@/src/components/common/AppText";
import { Colours } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react"; // 💡 useState 추가
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";

export default function ShelfScreen() {
  const { myPerfumes, isLoading, addMyPerfume, toggleFavourite, toggleHave } =
    useMyPerfume();

  // state - search modal
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleOpenSearch = () => {
    console.log("🚀 [Action] Opening Search Modal...");
    setSearchModalVisible(true);
  };

  const handleSelectPerfume = async (perfume: any) => {
    await addMyPerfume(perfume); // SQLite save
    setSearchModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colours.text} />
      </View>
    );
  }

  // 2. Main List UI
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>My Shelf</AppText>
        {/* plus btn */}
        <TouchableOpacity
          onPress={handleOpenSearch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={28} color={Colours.text} />
        </TouchableOpacity>

        {/* search modal component */}
        <SearchPerfumeModal
          visible={searchModalVisible}
          excludeIds={myPerfumes.map((p) => p.perfId)}
          onSelect={(perfume) => handleSelectPerfume(perfume)}
          onClose={() => setSearchModalVisible(false)}
        />
      </View>

      {myPerfumes.length === 0 ? (
        /* Empty State */
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
          keyExtractor={(item) => item.perfId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
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
                <AppText style={styles.nameText}>{item.details?.name}</AppText>
              </View>

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
                  onPress={() => toggleHave(item.perfId)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Styles same as previous response)
  container: { flex: 1, backgroundColor: Colours.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: Colours.text },
  listContent: { padding: 20, paddingBottom: 120 },
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
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#eee",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colours.text,
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 15,
    color: Colours.textDim,
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
    backgroundColor: Colours.text,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#fcfcfc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  infoBox: { flex: 1, marginLeft: 18, justifyContent: "center" },
  brandText: {
    fontSize: 12,
    color: Colours.textDim,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  nameText: { fontSize: 17, fontWeight: "700", color: Colours.text },
  actionBox: { paddingLeft: 10, alignItems: "center" },
});
