import { MyPerfumeProvider } from "@/src/context/MyPerfumeContext";
import { ScentLogProvider } from "@/src/context/ScentLogContext";
import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MyFont: require("@/assets/fonts/DepartureMono-Regular.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

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
