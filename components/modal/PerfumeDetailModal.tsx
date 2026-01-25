import { accordStyles } from "@/constants/accordStyles";
import { modalStyles } from "@/constants/modalStyles";
import { Btn, Colours } from "@/constants/theme";
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
                {/* Header */}
                <View style={styles.header}>
                  <Text style={modalStyles.modalItemDetailBrand}>
                    {perfume.brand}
                  </Text>
                  <Text style={modalStyles.modalItemDetailName}>
                    {perfume.name}
                  </Text>
                </View>

                {/* image */}
                {perfume.image && (
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: perfume.image }}
                      style={styles.perfumeImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

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
                              { width: `${(value / 5) * 100}%` },
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  imageWrapper: {
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  perfumeImage: {
    width: 200,
    height: 200,
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
