import { modalStyles } from "@/src/components/common/modalStyles";
import { accordStyles } from "@/src/components/shelf/accordStyles";
import { Btn, Colours } from "@/src/constants/theme";
import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { MainPerfumeList } from "@/src/data/dummyDatasfromServer";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface DetailModalProps {
  visible: boolean;
  selectedPerfId: string | null;
  onClose: () => void;
}

export default function PerfumeDetailModal({
  visible,
  // perfumeWithDetail,
  selectedPerfId,
  onClose,
}: DetailModalProps) {
  const { myPerfumes, toggleFavourite, toggleHave } = useMyPerfume();

  const perfume = MainPerfumeList.find((p) => p.perfId === selectedPerfId);
  const currData = myPerfumes.find((p) => p.perfId === selectedPerfId);
  // if (!perfumeWithDetail) return null;
  if (!selectedPerfId || !perfume) return null;

  const isFavourite = currData?.isFavourite ?? false;

  const imageSource =
    typeof perfume.imageUrl === "string"
      ? { uri: perfume.imageUrl }
      : perfume.imageUrl;

  const handleToggleFavourite = () => {
    toggleFavourite(perfume.perfId);
  };

  const handleToggleHave = () => {
    toggleHave(perfume.perfId);
    if (currData) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.topSection}>
                <View style={styles.imageContainer}>
                  <Image
                    source={imageSource}
                    style={styles.perfumeImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={modalStyles.modalItemDetailBrand}>
                    {perfume.brand}
                  </Text>
                  <Text style={modalStyles.modalItemDetailName}>
                    {perfume.name}
                  </Text>
                </View>
              </View>

              {/* Status btn */}
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={Btn.detailBtn}
                  onPress={() => handleToggleFavourite()}
                >
                  <Text>
                    {isFavourite ? "My Favourite ❤️" : "My Favourite"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Btn.detailBtn}
                  onPress={() => handleToggleHave()}
                >
                  <Text>I have</Text>
                </TouchableOpacity>
              </View>

              {/* Main Accords */}
              <View style={accordStyles.accordsContainer}>
                {perfume.mainAccords
                  .sort((a, b) => b.score - a.score)
                  .map(({ accord, score }) => (
                    <View key={accord} style={accordStyles.accordItem}>
                      <View style={styles.labelRow}>
                        <Text style={accordStyles.accordLabel}>{accord}</Text>
                        <Text style={accordStyles.accordValue}>{score}</Text>
                      </View>
                      <View style={accordStyles.accordBarBackground}>
                        <View
                          style={[
                            accordStyles.accordBarFill,
                            { width: `${(score / 5) * 100}%` },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>

            {/* 닫기 버튼 */}
            <TouchableOpacity style={Btn.closeBtn} onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    marginVertical: 10,
    backgroundColor: Colours.background,
    padding: 10,
  },
  perfumeImage: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
});
