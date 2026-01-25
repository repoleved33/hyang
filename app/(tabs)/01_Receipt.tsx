import { Colours } from "@/constants/theme";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
const screenWidth = Dimensions.get("window").width;

export default function ReceiptView() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.receiptPaper}>
        {/* Header */}
        <Text style={styles.title}>HYANGRECEIPT</Text>
        <Text style={styles.subTitle}>LAST MONTH or LAST WEEK</Text>

        <View style={styles.infoSection}>
          <Text style={styles.monoText}>ORDER #0001 FOR [username]</Text>
          <Text style={styles.monoText}>[DAY]], [DATE], [MONTH], [YEAR]]</Text>
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
          <Text style={styles.barcodeText}>||||||||||||||||||||||||||||||</Text>
          <Text style={styles.monoText}>HYANG 2026</Text>
        </View>
      </ScrollView>
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
    paddingTop: 50,
    alignItems: "center",
  },
  receiptPaper: {
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
