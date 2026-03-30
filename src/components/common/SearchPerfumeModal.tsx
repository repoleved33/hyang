import { Btn, Colours, Input } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { modalStyles } from "@/src/styles/modalStyles";
import { Perfume } from "@/src/types/perfume";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppText } from "./AppText";
interface perfumeSearchModalProps {
  visible: boolean;
  onClose: () => void;
  excludeIds?: string[];
  onSelect: (perfume: Perfume) => void;
}

export default function SearchPerfumeModal({
  visible,
  onClose,
  excludeIds = [],
  onSelect,
}: perfumeSearchModalProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { searchPerfumes } = useMyPerfume();

  const handleSearchUpdate = async (text: string) => {
    setSearchKeyword(text);

    if (!text.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const results = await searchPerfumes(text);
      const filtered = results.filter(
        (p: Perfume) => !excludeIds?.includes(p.perfId || ""),
      );
      setSearchResults(filtered);
      setPage(0);
      setHasMore(true);
    } catch (error) {
      console.error("search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (loading || !hasMore || !searchKeyword.trim()) return;

    setLoading(true);
    const nextPage = page + 1;
    const newResults = await searchPerfumes(searchKeyword, nextPage);

    if (newResults.length < 50) setHasMore(false);

    const filtered = newResults.filter((p) => !excludeIds.includes(p.perfId!));
    setSearchResults((prev) => [...prev, ...filtered]);
    setPage(nextPage);
    setLoading(false);
  };

  const handleClose = () => {
    setSearchKeyword("");
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.fullScreenOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={modalStyles.modalContainer}>
              <TextInput
                style={[
                  Input.searchInput,
                  {
                    borderRadius: 15,
                    borderWidth: 1,
                    paddingHorizontal: 15,
                  },
                ]}
                placeholder="PERFUME OR BRAND NAME"
                value={searchKeyword}
                onChangeText={(text) => handleSearchUpdate(text)}
                autoCapitalize="none"
                autoFocus={true}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />

              {loading && (
                <View style={{ marginTop: 10, height: 20 }}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              )}

              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.perfId!}
                style={{ maxHeight: 350, marginTop: 10 }}
                onEndReached={loadMoreResults}
                onEndReachedThreshold={0.5}
                keyboardShouldPersistTaps="handled"
                ListFooterComponent={() =>
                  loading ? (
                    <ActivityIndicator
                      size="small"
                      color="#000"
                      style={{ margin: 10 }}
                    />
                  ) : null
                }
                ListEmptyComponent={() =>
                  !loading && searchKeyword.length > 0 ? (
                    <View style={{ padding: 20, alignItems: "center" }}>
                      <AppText style={{ color: Colours.secondaryText }}>
                        No Results
                      </AppText>
                    </View>
                  ) : null
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={modalStyles.modalsearchItem}
                    onPress={() => {
                      onSelect(item);
                      handleClose();
                    }}
                  >
                    <View>
                      <AppText style={modalStyles.modalItemSearchName}>
                        {item.name}
                      </AppText>
                      <AppText style={modalStyles.modalItemSearchBrand}>
                        {item.brand}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={Btn.closeBtn} onPress={handleClose}>
                <AppText style={modalStyles.modalText}>CLOSE</AppText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: Colours.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
});
