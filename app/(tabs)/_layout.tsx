import { Colours } from "@/src/constants/theme";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colours.background,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colours.text,
        tabBarInactiveTintColor: Colours.textDim,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen name="01_Receipt" options={{ title: "Receipt" }} />
      <Tabs.Screen name="02_ScentLog" options={{ title: "Scent Log" }} />
      <Tabs.Screen name="03_Shelf" options={{ title: "Shelf" }} />
    </Tabs>
  );
}
