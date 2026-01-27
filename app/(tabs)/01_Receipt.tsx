import DropdownBar from "@/src/components/receipt/DropdownBar";
import { Colours } from "@/src/constants/theme";
import React, { useRef } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

const screenWidth = Dimensions.get("window").width;

export default function ReceiptScreen() {
  const receiptRef = useRef(null); // receipt pointer

  const saveReceiptImage = async () => {
    try {
      console.log("1. Starting image save process...");

      // 1. Check current media library permissions
      const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
      console.log("2. Current Status:", status, "Can Ask Again:", canAskAgain);

      // If permission is already granted
      if (status === "granted") {
        const uri = await captureRef(receiptRef, {
          format: "png",
          quality: 1.0,
        });
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Success", "Receipt saved to gallery! 🎉");
        return;
      }

      // If permission is undetermined or denied but can ask again
      if (status === "undetermined" || (status === "denied" && canAskAgain)) {
        const { status: newStatus } =
          await MediaLibrary.requestPermissionsAsync();

        if (newStatus === "granted") {
          const uri = await captureRef(receiptRef, {
            format: "png",
            quality: 1.0,
          });
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert("Success", "Receipt saved to gallery!");
        } else {
          Alert.alert(
            "Permission Denied",
            "Saving requires access to your photo library.",
          );
        }
      }
      // If permission is permanently denied (redirect to settings)
      else {
        Alert.alert(
          "Permission Required",
          "Please enable photo library access in Settings to save your receipt.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "An error occurred while saving the image.");
    }
  };

  return (
    <View style={styles.container}>
      {/* top option bar */}
      <View
        style={{ zIndex: 9999, width: "100%", position: "absolute", top: 50 }}
      >
        <DropdownBar onSave={saveReceiptImage} />
      </View>
      <View style={styles.saveContainer} ref={receiptRef} collapsable={false}>
        <ScrollView contentContainerStyle={styles.receiptPaper}>
          {/* Header */}
          <Text style={styles.title}>HYANGRECEIPT</Text>
          <Text style={styles.subTitle}>LAST MONTH or LAST WEEK</Text>

          <View style={styles.infoSection}>
            <Text style={styles.monoText}>ORDER #0001 FOR [username]</Text>
            <Text style={styles.monoText}>[DAY], [DATE], [MONTH], [YEAR]</Text>
          </View>

          {/* Divider */}
          <Text style={styles.divider}>--------------------------</Text>

          {/* Table Header */}
          <View style={styles.row}>
            <Text style={[styles.monoText, { width: 30 }]}>No</Text>
            <Text style={[styles.monoText, { flex: 1 }]}>ITEM</Text>
            <Text style={[styles.monoText, { width: 100, textAlign: "right" }]}>
              FREQUENCY
            </Text>
          </View>
          <Text style={styles.divider}>--------------------------</Text>

          {/* Item List */}
          <ItemRow
            qty="01"
            name="Aqua Universalis"
            brand="Maison Francis Kurkdjian"
            amt="3:00"
          />
          <ItemRow
            qty="03"
            name="Light Blue"
            brand="Dolce & Gabbana"
            amt="2:24"
          />

          {/* Footer Divider */}
          <Text style={styles.divider}>--------------------------</Text>

          {/* Summary */}
          <View style={styles.row}>
            <Text style={styles.monoText}>ITEM COUNT:</Text>
            <Text style={styles.monoText}>10</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.monoText}>TOTAL:</Text>
            <Text style={styles.monoText}>{"2" + "[total cnt]"}</Text>
          </View>

          <Text style={styles.divider}>--------------------------</Text>

          {/* Card Info */}
          <View style={styles.footerInfo}>
            <Text style={styles.monoText}>CARD #: **** **** **** 2026</Text>
            <Text style={styles.monoText}>AUTH CODE: 1234</Text>
            <Text style={styles.monoText}>{"CARDHOLDER: [USERNAME]"}</Text>
          </View>

          <Text style={styles.thanks}>THANK YOU FOR VISITING!</Text>

          {/* Barcode (Text representation) */}
          <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeText}>
              ||||||||||||||||||||||||||||||
            </Text>
            <Text style={styles.monoText}>HYANG 2026</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// receipt item component
function ItemRow({ qty, name, brand, amt }: any) {
  return (
    <View style={[styles.row, { alignItems: "flex-start", marginVertical: 4 }]}>
      <Text style={[styles.monoText, { width: 30 }]}>{qty}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.monoText}>{name} -</Text>
        <Text style={styles.monoText}>{brand}</Text>
      </View>
      <Text style={[styles.monoText, { width: 50, textAlign: "right" }]}>
        {amt}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.background,
    paddingTop: 100,
    // paddingBottom: 10,
    alignItems: "center",
  },
  saveContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  receiptPaper: {
    flex: 1,
    backgroundColor: Colours.cardBackground,
    width: screenWidth * 0.85,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: "Courier", //
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Courier",
  },
  infoSection: {
    marginBottom: 10,
  },
  monoText: {
    fontFamily: "Courier",
    fontSize: 12,
    color: "#333",
    lineHeight: 16,
  },
  divider: {
    textAlign: "center",
    color: "#333",
    marginVertical: 5,
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerInfo: {
    marginVertical: 15,
  },
  thanks: {
    textAlign: "center",
    fontFamily: "Courier",
    fontSize: 14,
    marginVertical: 20,
  },
  barcodeContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  barcodeText: {
    fontSize: 40,
    letterSpacing: -2,
  },
});
