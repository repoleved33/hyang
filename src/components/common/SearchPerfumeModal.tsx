import { modalStyles } from "@/src/components/common/modalStyles";
import { Btn, Input } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Perfume } from "@/src/types/perfume";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
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

  const [page, setPage] = useState(0); // track current page
  const [hasMore, setHasMore] = useState(true); // check if more data exists

  const { searchPerfumes } = useMyPerfume();

  const handleSearchUpdate = async (text: string) => {
    setSearchKeyword(text);

    // if not exist
    if (!text.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // [Supabase]
      const results = await searchPerfumes(text);

      // filter excludeIds
      const filtered = results.filter(
        (p: Perfume) => !excludeIds?.includes(p.perfId || ""),
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("[Supabase] search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 💡 Load More Data when reaching the bottom
  const loadMoreResults = async () => {
    if (loading || !hasMore || !searchKeyword.trim()) return;

    setLoading(true);
    const nextPage = page + 1;
    const newResults = await searchPerfumes(searchKeyword, nextPage);

    if (newResults.length < 50) setHasMore(false); // No more data to fetch

    const filtered = newResults.filter((p) => !excludeIds.includes(p.perfId!));
    setSearchResults((prev) => [...prev, ...filtered]); // Append to existing list
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
                style={Input.searchInput}
                placeholder="Perfume or Brand Name"
                value={searchKeyword}
                onChangeText={(text) => handleSearchUpdate(text)} //
                autoCapitalize="none"
                autoFocus={true}
                returnKeyType="search"
                clearButtonMode="while-editing" // iOS
              />

              {loading && (
                <View style={{ marginTop: 10, height: 20 }}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              )}

              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.perfId!} // essential val
                style={{ maxHeight: 350, marginTop: 10 }}
                onEndReached={loadMoreResults}
                onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
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
                      <AppText style={{ color: "#999" }}>No Results</AppText>
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
                <AppText style={modalStyles.modalText}>Close</AppText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = {
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  } as const,
};
