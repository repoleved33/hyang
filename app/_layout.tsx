import { MyPerfumeProvider } from "@/src/context/MyPerfumeContext";
import { ScentLogProvider } from "@/src/context/ScentLogContext";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StatusBar as RNStatusBar, View } from "react-native"; // 💡 RNStatusBar 추가
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MyFont: require("@/assets/fonts/DepartureMono-Regular.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <MyPerfumeProvider>
        <ScentLogProvider>
          <View style={{ flex: 1, backgroundColor: "#111111" }}>
            {/* 💡 android background */}
            {Platform.OS === "android" && (
              <RNStatusBar backgroundColor="#111111" barStyle="light-content" />
            )}
            <StatusBar
              style="light"
              translucent={false}
              backgroundColor="#111111"
            />
            <Slot />
          </View>
        </ScentLogProvider>
      </MyPerfumeProvider>
    </SafeAreaProvider>
  );
}
