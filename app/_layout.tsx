import { MyPerfumeProvider } from "@/src/context/MyPerfumeContext";
import { ScentLogProvider } from "@/src/context/ScentLogContext";
import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MyPerfumeProvider>
        <ScentLogProvider>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
        </ScentLogProvider>
      </MyPerfumeProvider>
    </SafeAreaProvider>
  );
}
