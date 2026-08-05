import { AppText } from "@/src/components/common/AppText";
import { Colours } from "@/src/constants/Theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { useUser } from "@/src/context/UserContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

import PerfumeDetailModal from "@/src/components/common/PerfumeDetailModal";
import SearchPerfumeModal from "@/src/components/common/SearchPerfumeModal";
import UserSettingModal from "@/src/components/common/UserSettingModal";

import { usePerfumeActions } from "@/src/hooks/usePerfumehooks";
import { styles } from "@/src/styles/03_Shelf.styles";
import { headerStyles } from "@/src/styles/commonHeader.styles";

import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShelfScreen() {
  const { userInfo, updateUserInfo } = useUser();

  const [userModalVisible, setUserModalVisible] = useState(false);

  const shelfTitle = userInfo?.cardholderName
    ? `${userInfo.cardholderName.toUpperCase()}'S SHELF`
    : "MY SHELF";

  const insets = useSafeAreaInsets();

  // UserContext의 numColumns 값을 사용 (기본값 1)
  const numColumns = userInfo?.numColumns ?? 1;

  const handleToggleLayout = () => {
    const nextNumColumns = numColumns === 1 ? 2 : 1;
    updateUserInfo({ numColumns: nextNumColumns });
  };

  const {
    myPerfumes,
    isLoading,
    addMyPerfume,
    toggleFavourite,
    selectMyPerfumes,
  } = useMyPerfume();

  // 화면 다시 열릴 때 최신 데이터 가져오기
  useFocusEffect(
    useCallback(() => {
      selectMyPerfumes();
    }, []),
  );

  const { confirmRemove } = usePerfumeActions();

  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [selectedPerfume, setSelectedPerfume] = useState<any>(null);

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

  const sortedPerfumes = useMemo(() => {
    return [...myPerfumes].sort((a, b) => {
      if (a.isFavourite !== b.isFavourite) {
        return a.isFavourite ? -1 : 1;
      }

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
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={headerStyles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}
        >
          <AppText style={headerStyles.headerTitle}>{shelfTitle}</AppText>

          <TouchableOpacity onPress={() => setUserModalVisible(true)}>
            <FontAwesome5
              name="id-card-alt"
              size={20}
              color={Colours.primaryText}
            />
          </TouchableOpacity>
        </View>

        <UserSettingModal
          visible={userModalVisible}
          onClose={() => setUserModalVisible(false)}
        />

        <View style={headerStyles.headerActionRow}>
          <TouchableOpacity
            style={styles.layoutToggleButton}
            onPress={handleToggleLayout}
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

          <TouchableOpacity
            style={headerStyles.headerInlineAddBtn}
            onPress={() => setSearchModalVisible(true)}
          >
            <Ionicons name="add" size={20} color={Colours.whiteText} />
          </TouchableOpacity>
        </View>

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
          keyExtractor={(item) => item.perfId}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={
            numColumns === 2 ? { justifyContent: "space-between" } : undefined
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
                <TouchableOpacity
                  style={[
                    styles.cardMainAction,
                    isGrid && styles.cardMainActionGrid,
                  ]}
                  onPress={() => {
                    if (!item.isDeleted) {
                      handlePressDetail(item);
                    }
                  }}
                >
                  <View
                    style={[styles.imageBox, isGrid && styles.imageBoxGrid]}
                  >
                    {item.details?.image_url && !item.isDeleted ? (
                      <Image
                        source={{
                          uri: item.details.image_url,
                        }}
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
                      {item.isDeleted
                        ? "DATA UNAVAILABLE"
                        : item.details?.brand}
                    </AppText>

                    <AppText
                      style={[styles.nameText, isGrid && styles.nameTextGrid]}
                      numberOfLines={2}
                    >
                      {item.isDeleted ? "REMOVED PERFUME" : item.details?.name}
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
                    style={!isGrid ? { marginTop: 20 } : undefined}
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

      <PerfumeDetailModal
        visible={detailModalVisible}
        perfume={selectedPerfume}
        onClose={() => setDetailModalVisible(false)}
      />
    </View>
  );
}
