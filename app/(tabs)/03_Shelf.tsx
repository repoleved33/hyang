import { AppText } from "@/src/components/common/AppText";
import { Colours } from "@/src/constants/Theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import { usePerfumeActions } from "@/src/hooks/usePerfumehooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "@/src/styles/03_Shelf.styles";
import { headerStyles } from "@/src/styles/commonHeader.styles";

export default function ShelfScreen() {
  const insets = useSafeAreaInsets();
  const [numColumns, setNumColumns] = useState(1);

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

  const sortedPerfumes = React.useMemo(() => {
    return [...myPerfumes].sort((a, b) => {
      if (a.isFavourite !== b.isFavourite) {
        return a.isFavourite ? -1 : 1;
      }
      // if both favourite
      return (b.addedAt || 0) - (a.addedAt || 0);
    });
  }, [myPerfumes]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colours.secondaryText} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={headerStyles.header}>
        {/* HEADER LEFT - title */}
        <AppText style={headerStyles.headerTitle}>MY SHELF</AppText>

        {/* HEADER RIGHT - show toggle / +(search) btn */}
        <View style={headerStyles.headerActionRow}>
          {/* left - layout toggle */}
          <TouchableOpacity
            style={styles.layoutToggleButton}
            onPress={() => setNumColumns(numColumns === 1 ? 2 : 1)}
          >
            <Ionicons
              name={numColumns === 1 ? "grid-outline" : "list-outline"}
              size={14}
              color={Colours.secondaryText}
            />
            <AppText style={styles.layoutToggleText}>
              {numColumns === 1 ? "SHOW 2X2" : "SHOW 1X1"}
            </AppText>
          </TouchableOpacity>

          {/* right */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            {/* btn - option1 */}
            <TouchableOpacity
              onPress={handleOpenSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="add" size={26} color={Colours.primaryText} />
            </TouchableOpacity>
            {/* btn - option2 */}
            <TouchableOpacity
              style={headerStyles.headerInlineAddBtn}
              onPress={handleOpenSearch}
            >
              <Ionicons name="add" size={20} color={Colours.whiteText} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Modal */}
        <SearchPerfumeModal
          visible={searchModalVisible}
          excludeIds={myPerfumes.map((p) => p.perfId)}
          onSelect={handleSelectPerfume}
          onClose={() => setSearchModalVisible(false)}
          isLogScreen={false}
        />
      </View>

      {myPerfumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="flask-outline" size={60} color={Colours.dimText} />
          </View>
          <AppText style={styles.emptyTitle}>
            Your shelf seems Lonely...
          </AppText>
          <AppText style={styles.emptySub}>
            Search and add your favorite perfumes!
          </AppText>
        </View>
      ) : (
        <FlatList
          data={sortedPerfumes}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(perfume) => perfume.perfId}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={
            numColumns === 2 ? { justifyContent: "space-between" } : null
          }
          renderItem={({ item }) => {
            const isGrid = numColumns === 2;
            return (
              <View
                style={[
                  styles.card,
                  isGrid && styles.cardGrid,
                  item.isFavourite && styles.cardFavourite,
                ]}
              >
                {/* onclick - details modal */}
                <TouchableOpacity
                  style={[
                    styles.cardMainAction,
                    isGrid && styles.cardMainActionGrid,
                  ]}
                  onPress={() => handlePressDetail(item)}
                >
                  <View
                    style={[styles.imageBox, isGrid && styles.imageBoxGrid]}
                  >
                    {item.details?.image_url ? (
                      <Image
                        source={{ uri: item.details.image_url }}
                        style={styles.image}
                      />
                    ) : (
                      <Ionicons
                        name="beaker-outline"
                        size={30}
                        color={Colours.dimText}
                      />
                    )}
                  </View>
                  <View style={[styles.infoBox, isGrid && styles.infoBoxGrid]}>
                    <AppText
                      style={[styles.brandText, isGrid && styles.brandTextGrid]}
                    >
                      {item.details?.brand}
                    </AppText>
                    <AppText
                      style={[styles.nameText, isGrid && styles.nameTextGrid]}
                      numberOfLines={2}
                    >
                      {item.details?.name}
                    </AppText>
                  </View>
                </TouchableOpacity>

                <View
                  style={[styles.actionBox, isGrid && styles.actionBoxGrid]}
                >
                  <TouchableOpacity
                    onPress={() => toggleFavourite(item.perfId)}
                  >
                    <Ionicons
                      name={item.isFavourite ? "heart" : "heart-outline"}
                      size={24}
                      color={
                        item.isFavourite
                          ? Colours.favourite
                          : Colours.secondaryText
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={!isGrid && { marginTop: 20 }}
                    onPress={() =>
                      confirmRemove(item.perfId, item.details?.name || "Scent")
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={Colours.secondaryText}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
      {/* Detail Modal */}
      <PerfumeDetailModal
        visible={detailModalVisible}
        perfume={selectedPerfume}
        onClose={() => setDetailModalVisible(false)}
      />
    </View>
  );
}
