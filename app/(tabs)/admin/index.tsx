import { Button, CustomInput, ScreenWrapper } from "@/components";
import { Section } from "@/components/global/Section";
import {
  addCategory,
  deleteCategory,
  selectCategories,
  updateCategory,
} from "@/redux/categoriesSlice";
import { COLORS } from "@/utills/ThemeStyles";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import asyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
const index = () => {
  const storedCategories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const [newCategory, setNewCategory] = React.useState({
    name: "",
    id: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleAddCategory = async () => {
    try {
      if (isEditing) {
        dispatch(updateCategory(newCategory));
        const updatedCategories = storedCategories.map((item) => {
          return item.id == newCategory.id ? newCategory : item;
        });
        await asyncStorage.setItem(
          "categories",
          JSON.stringify(updatedCategories)
        );
      } else {
        dispatch(addCategory(newCategory));
        await asyncStorage.setItem(
          "categories",
          JSON.stringify([...storedCategories, newCategory])
        );
      }
      setNewCategory({
        name: "",
        id: "",
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteCategory(id));
      await asyncStorage.setItem(
        "categories",
        JSON.stringify(storedCategories)
      );
      const updatedCategories = storedCategories.filter(
        (category) => category.id !== id
      );
      await asyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async (cat: any) => {
    try {
      setIsEditing(true);
      setNewCategory(cat);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScreenWrapper scroll edges={["left", "right"]}>
      <Section title="Add Categories">
        <CustomInput
          value={newCategory.name}
          onChangeText={(value) =>
            setNewCategory({
              name: value,
              id: isEditing ? newCategory.id : Date.now().toString(),
            })
          }
          placeholder="Add New Category"
        />
        <Button
          title={isEditing ? "Update Category" : "ADD NEW CATEGORY"}
          onPress={handleAddCategory}
        />
      </Section>
      <Section title="Categories">
        {storedCategories.length > 0 ? (
          storedCategories.map((category, index) => {
            return (
              <View style={styles.categoryItem} key={index}>
                <Text style={styles.category}>{category.name}</Text>
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => handleDelete(category.id)}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={24}
                      color={COLORS().error}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleUpdate(category)}>
                    <Feather
                      name="edit"
                      size={20}
                      color={COLORS().primaryVariant}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text>Nothing to show here</Text>
        )}
      </Section>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  categoryItem: {
    borderBottomWidth: 1,
    borderColor: COLORS().border,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 16,
    color: COLORS().textSecondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
