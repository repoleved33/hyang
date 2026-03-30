import { Colours } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colours.tabBarBg,
          borderTopWidth: 1,
          // borderTopColor: Colours.tabBarBorder,
          height: 65,
          paddingBottom: 10,
          // 💡 그림자 살짝 넣어서 입체감 주기
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: "MyFont",
          fontSize: 10,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        tabBarActiveTintColor: Colours.lavenderActive,
        tabBarInactiveTintColor: Colours.lavenderInactive,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="01_Receipt"
        options={{
          title: "RECEIPT",
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="02_ScentLog"
        options={{
          title: "LOG",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="03_Shelf"
        options={{
          title: "SHELF",
          tabBarIcon: ({ color }) => (
            <Ionicons name="layers" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
