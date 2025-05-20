import { ScreenWrapper } from "@/components";
import { Section } from "@/components/global/Section";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const main = () => {
  const navigation = useNavigation();
  const settings = [
    { id: 1, name: "Categories", route: "index" },
    { id: 2, name: "Manage Categories", route: "manageCategories" },
    {
      id: 3,
      name: "Manage Supporting Material",
      route: "manageSupportingMaterial",
    },
  ];

  return (
    <ScreenWrapper scroll edges={["left", "right"]}>
      <Section title="Geneal Settings">
        {settings.map((setting) => (
          <TouchableOpacity
            key={setting.id}
            onPress={() => {
              navigation.navigate(setting.route as never);
            }}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text>{setting.name}</Text>
          </TouchableOpacity>
        ))}
      </Section>
    </ScreenWrapper>
  );
};

export default main;

const styles = StyleSheet.create({});
