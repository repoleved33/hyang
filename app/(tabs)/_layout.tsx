import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#333333", // 배경과 동일
          borderTopWidth: 0, // 탭 하단 라인 제거
        },
        tabBarActiveTintColor: "#F4CCCC",
        tabBarInactiveTintColor: "#F4CCCC",
        tabBarShowLabel: true, // 필요에 따라 true/false
      }}
    >
      <Tabs.Screen name="shelf" options={{ title: "Shelf" }} />
      <Tabs.Screen name="Scentlog" options={{ title: "Scent Log" }} />
    </Tabs>
  );
}
