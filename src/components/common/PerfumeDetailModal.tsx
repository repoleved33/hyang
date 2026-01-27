import { modalStyles } from "@/src/components/common/modalStyles";
import { accordStyles } from "@/src/components/shelf/accordStyles";
import { Btn, Colours } from "@/src/constants/theme";
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
  perfume: any;
  onClose: () => void;
}

export default function PerfumeDetailModal({
  visible,
  perfume,
  onClose,
}: DetailModalProps) {
  if (!perfume) return null;
  const imageSource =
    typeof perfume.image === "string" ? { uri: perfume.image } : perfume.image;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* top section */}
                <View style={styles.topSection}>
                  {/* info section - image */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={imageSource}
                      style={styles.perfumeImage}
                      resizeMode="contain"
                    />
                  </View>
                  {/* top section - info */}
                  <View style={styles.infoContainer}>
                    <Text style={modalStyles.modalItemDetailBrand}>
                      {perfume.brand}
                    </Text>
                    <Text style={modalStyles.modalItemDetailName}>
                      {perfume.name}
                    </Text>
                  </View>
                </View>
                {/* status section - i have / my favourite */}
                <View style={styles.statusContainer}>
                  <TouchableOpacity style={Btn.detailBtn}>
                    <Text>I have</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Btn.detailBtn}>
                    <Text>My Favourite</Text>
                  </TouchableOpacity>
                </View>
                {/* Main Accords */}
                <View style={accordStyles.accordsContainer}>
                  {Object.entries(perfume.accords)
                    .sort(
                      ([, valueA], [, valueB]) =>
                        Number(valueB) - Number(valueA),
                    )
                    .map(([key, value]: [string, any]) => (
                      <View key={key} style={accordStyles.accordItem}>
                        <View style={styles.labelRow}>
                          <Text style={accordStyles.accordLabel}>{key}</Text>
                          <Text style={accordStyles.accordValue}>{value}%</Text>
                        </View>
                        <View style={accordStyles.accordBarBackground}>
                          <View
                            style={[
                              accordStyles.accordBarFill,
                              { width: `${(value / 10) * 100}%` },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                </View>
              </ScrollView>

              {/* close */}
              <TouchableOpacity style={Btn.closeBtn} onPress={onClose}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colours.text,
    marginBottom: 16,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
});
