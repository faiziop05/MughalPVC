import { COLORS } from "@/utills/ThemeStyles";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { color: COLORS().primary },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="home"
              size={size}
              color={focused ? COLORS().primary : COLORS().primaryDisabled}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person"
              size={size}
              color={focused ? COLORS().primary : COLORS().primaryDisabled}
            />
          ),
        }}
      />
    </Tabs>
  );
}
