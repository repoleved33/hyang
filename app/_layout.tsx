import { MyPerfumeProvider } from "@/src/context/MyPerfumeContext";
import { ScentLogProvider } from "@/src/context/ScentLogContext";
import { UserProvider } from "@/src/context/UserContext";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Platform, StatusBar as RNStatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MyFont: require("@/assets/fonts/DepartureMono-Regular.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="hyang.db">
        <SQLiteProvider databaseName="hyang_myperfume.db">
          <SQLiteProvider databaseName="hyang_scentlogs.db">
            <UserProvider>
              <MyPerfumeProvider>
                <ScentLogProvider>
                  <View style={{ flex: 1, backgroundColor: "#111111" }}>
                    {Platform.OS === "android" && (
                      <RNStatusBar
                        backgroundColor="#111111"
                        barStyle="light-content"
                      />
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
            </UserProvider>
          </SQLiteProvider>
        </SQLiteProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
