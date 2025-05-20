import { Button, CustomInput, ScreenWrapper, SelectInput } from "@/components";
import { Section } from "@/components/global/Section";
import { selectCategories } from "@/redux/categoriesSlice";
import {
  addCategoryItems,
  selectCategoryItems,
  setAllCategoriesItems,
  updateCategoryItems,
} from "@/redux/categoryItemsSlice";
import { COLORS } from "@/utills/ThemeStyles";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

type Item = {
  name: string;
  price: number;
  width?: number;
  height?: number;
  categoryId?: string; // Ensure categoryId exists in the Item type
  categoryName: string;
};

type CategoryOption = {
  label: string;
  value: string;
  price: number;
  width: number;
  height: number;
};

const ManageCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const categoryItems = useSelector(selectCategoryItems);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryOption | null>(null);
  const [wantToAddItems, setWantToAddItems] = React.useState(false);
  const [wantDimensions, setWantDimensions] = React.useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [itemName, setItemName] = React.useState("");
  const [itemPrice, setItemPrice] = React.useState("");
  const [itemWidth, setItemWidth] = React.useState("");
  const [itemHeight, setItemHeight] = React.useState("");

  const [items, setItems] = React.useState<Item[]>([]);

  const addItemToCategory = async () => {
    try {
      if (!selectedCategory || !itemName || !itemPrice) return;

      const newItem: Item = {
        name: itemName,
        price: parseFloat(itemPrice),
        categoryId: selectedCategory.value,
        categoryName: selectedCategory.label,
      };

      if (wantDimensions) {
        if (itemWidth) newItem.width = parseFloat(itemWidth);
        if (itemHeight) newItem.height = parseFloat(itemHeight);
      }
      if (isEditing) {
        dispatch(updateCategoryItems(newItem));
        const updatedItems = categoryItems.map((item) => {
          return item.name == newItem.name && item.price == newItem.price
            ? newItem
            : item;
        });
        await AsyncStorage.setItem(
          "categoryItems",
          JSON.stringify(updatedItems)
        );
      } else {
        dispatch(addCategoryItems(newItem));
        await AsyncStorage.setItem(
          "categoryItems",
          JSON.stringify([...categoryItems, newItem])
        );
      }
      setItemName("");
      setItemPrice("");
      setItemWidth("");
      setItemHeight("");
      setSelectedCategory(null);
      setWantToAddItems(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (cat: any) => {
    try {
      setIsEditing(true);
      const foundCategory = categories?.find(
        (catItem) => catItem.id == cat.categoryId
      );
      if (foundCategory) {
        setSelectedCategory({
          label: foundCategory.name,
          value: foundCategory.id,
          price: 0,
          width: 0,
          height: 0,
        });

        setWantToAddItems(true);
        setItemName(cat.name);
        setItemPrice(cat.price.toString());
        if (cat?.width) {
          setWantDimensions(true);
          setItemWidth(cat.width.toString());
        }
        if (cat?.height) {
          setWantDimensions(true);
          setItemHeight(cat.height.toString()); // Corrected: Setting itemHeight
        }
      } else {
        setSelectedCategory(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleDelete = async (cat: any) => {
    const updatedCategoriesItems = categoryItems.filter((item) => item != cat);
    dispatch(setAllCategoriesItems(updatedCategoriesItems));
    await AsyncStorage.setItem(
      "categoryItems",
      JSON.stringify(updatedCategoriesItems)
    );
  };

  return (
    <ScreenWrapper scroll edges={["left", "right"]}>
      <Section title="Select Category">
        <SelectInput
          onSelect={(value) => {
            setSelectedCategory(value[0]); // Assuming single-select
            setWantToAddItems(false);
          }}
          selectedValues={selectedCategory ? [selectedCategory] : []}
          placeholder="Select Category"
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
            price: 0, // Ensure price is always a number
            width: 0,
            height: 0,
          }))}
        />
      </Section>

      {selectedCategory && (
        <Section title="Do you want to add items in this category?">
          <View style={styles.row}>
            <Text style={styles.label}>Add Items:</Text>
            <Switch
              value={wantToAddItems}
              onValueChange={setWantToAddItems}
              thumbColor={COLORS().primary}
              trackColor={{
                true: COLORS().primaryDisabled,
                false: COLORS().border,
              }}
            />
          </View>
        </Section>
      )}

      {selectedCategory && wantToAddItems && (
        <>
          <Section title="Item Info">
            <CustomInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="Item Name"
            />
            <CustomInput
              value={itemPrice}
              onChangeText={setItemPrice}
              placeholder="Price"
              keyboardType="numeric"
            />
          </Section>

          <Section title="Want to add item dimensions?">
            <View style={styles.row}>
              <Text style={styles.label}>Include Dimensions:</Text>
              <Switch
                value={wantDimensions}
                onValueChange={setWantDimensions}
                thumbColor={COLORS().primary}
                trackColor={{
                  true: COLORS().primaryDisabled,
                  false: COLORS().border,
                }}
              />
            </View>
          </Section>

          {wantDimensions && (
            <Section title="Item Dimensions">
              <CustomInput
                value={itemWidth}
                onChangeText={setItemWidth}
                placeholder="Width"
                keyboardType="numeric"
              />
              <CustomInput
                value={itemHeight}
                onChangeText={setItemHeight}
                placeholder="Height"
                keyboardType="numeric"
              />
            </Section>
          )}

          <Section title="">
            <Button title={isEditing ? "Update Item": "Add Item"} onPress={addItemToCategory} />
          </Section>
        </>
      )}

      {categoryItems.length > 0 && !isEditing && (
        <Section title="Items Added">
          {categoryItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.row}>
                <Text style={styles.key}>Name:</Text>
                <Text style={styles.value}>{item.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Price:</Text>
                <Text style={styles.value}>RS.{item.price}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Category:</Text>
                <Text style={styles.value}>{item.categoryName}</Text>
              </View>
              {item.width && (
                <View style={styles.row}>
                  <Text style={styles.key}>Width:</Text>
                  <Text style={styles.value}>{item.width} (Inches)</Text>
                </View>
              )}
              {item.height && (
                <View style={styles.row}>
                  <Text style={styles.key}>Height:</Text>
                  <Text style={styles.value}>{item.height} (Inches)</Text>
                </View>
              )}
              <View style={styles.rowIcons}>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={COLORS().error}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUpdate(item)}>
                  <Feather
                    name="edit"
                    size={20}
                    color={COLORS().primaryVariant}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Section>
      )}
    </ScreenWrapper>
  );
};

export default ManageCategories;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  itemContainer: {
    marginBottom: 20, // Adds separation between items
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  rowIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 4,
    alignSelf: "flex-end",
    gap: 5,
  },
  key: {
    fontWeight: "bold",
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
});
