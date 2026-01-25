import { MyPerfumeProvider } from "@/context/myPerfumeContext";
import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MyPerfumeProvider>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </MyPerfumeProvider>
    </SafeAreaProvider>
  );
}
