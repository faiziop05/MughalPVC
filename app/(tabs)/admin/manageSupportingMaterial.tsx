import { Button, CustomInput, ScreenWrapper, SelectInput } from "@/components";
import { Section } from "@/components/global/Section";
import { selectCategories } from "@/redux/categoriesSlice";
import {
  addSupportingMaterial,
  deleteSupportingMaterial,
  selectSupportingMaterial,
  updateSupportingMaterial,
} from "@/redux/supportingMaterialSlice";
import { COLORS } from "@/utills/ThemeStyles";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ManageSupportingMaterial = () => {
  const dispatch = useDispatch();
  const supportingMaterials = useSelector(selectSupportingMaterial);
  const categories = useSelector(selectCategories);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  interface Option {
    label: string;
    value: string;
    price: number;
    width: number;
    height: number;
  }

  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [wantToAddMaterial, setWantToAddMaterial] = useState(false);

  
  const [materialName, setMaterialName] = useState("");
  const [materialPrice, setMaterialPrice] = useState("");
  const [materialLength, setMaterialLength] = useState("");
  const [selectMaterial, setSelectedMaterial] = useState<{
    id: string;
    name: string;
    price: number;
    length?: number;
    categoryName: string;
  } | null>(null);
  const addMaterial = async () => {
    if (!selectedCategory || !materialName || !materialPrice) return;

    const newMaterial = {
      id: isEditing && selectMaterial?.id ? selectMaterial.id : `${Date.now()}`, // Ensure id is always a string
      name: materialName,
      price: parseFloat(materialPrice),
      length: materialLength ? parseFloat(materialLength) : undefined,
      categoryName: selectedCategory.label,
    };
    if (isEditing) {
      dispatch(
        updateSupportingMaterial({
          id: newMaterial.id,
          updatedMaterial: newMaterial,
        })
      );
      const updated = supportingMaterials.map((item) =>
        item.id == newMaterial.id ? newMaterial : item
      );
      await AsyncStorage.setItem(
        "supportingMaterials",
        JSON.stringify(updated)
      );
    } else {
      dispatch(addSupportingMaterial(newMaterial));
      await AsyncStorage.setItem(
        "supportingMaterials",
        JSON.stringify([...supportingMaterials, newMaterial])
      );
    }
    setMaterialName("");
    setMaterialPrice("");
    setMaterialLength("");
    setWantToAddMaterial(false);
    setIsEditing(false);
    setSelectedCategory(null),
    setSelectedCategory(null)
  };

  const deleteMaterial = async (id: string) => {
    dispatch(deleteSupportingMaterial(id));
    const updatedMaterials = supportingMaterials.filter(
      (material) => material.id !== id
    );
    await AsyncStorage.setItem(
      "supportingMaterials",
      JSON.stringify(updatedMaterials)
    );
  };
  const handleUpdate = async (item: any) => {
    try {
      setIsEditing(true);
      const foundCategory = categories?.find(
        (catItem) => catItem.name == item.categoryName
      );
      setSelectedMaterial(item);
      if (foundCategory) {
        setSelectedCategory({
          label: foundCategory.name,
          value: foundCategory.id,
          price: 0,
          width: 0,
          height: 0,
        });
        setWantToAddMaterial(true);
        setMaterialName(item.name);
        setMaterialPrice(String(item.price).toString());
        if (item?.length) {
          setMaterialLength(String(item.length).toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper scroll edges={["left", "right"]}>
      <Section title="Select Category">
        <SelectInput
          onSelect={(value) => {
            setSelectedCategory(value[0]); // Assuming single-select
            setWantToAddMaterial(false);
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
        <Section title="Do you want to add supporting material?">
          <View style={styles.row}>
            <Text style={styles.label}>Add Material:</Text>
            <Switch
              value={wantToAddMaterial}
              onValueChange={setWantToAddMaterial}
              thumbColor={COLORS().primary}
              trackColor={{
                true: COLORS().primaryDisabled,
                false: COLORS().border,
              }}
            />
          </View>
        </Section>
      )}

      {selectedCategory && wantToAddMaterial && (
        <Section title="Material Info">
          <CustomInput
            value={materialName}
            onChangeText={setMaterialName}
            placeholder="Material Name"
          />
          <CustomInput
            value={materialPrice}
            onChangeText={setMaterialPrice}
            placeholder="Price"
            keyboardType="numeric"
          />
          <CustomInput
            value={materialLength}
            onChangeText={setMaterialLength}
            placeholder="Length (optional)"
            keyboardType="numeric"
          />
          <Button
            title={isEditing ? "Update Material" : "Add Material"}
            onPress={addMaterial}
          />
        </Section>
      )}

      {supportingMaterials.length > 0 && (
        <Section title="Supporting Materials">
          {supportingMaterials.map((material) => (
            <View key={material.id} style={styles.materialItem}>
              {material.name && (
                <View style={styles.row}>
                  <Text style={styles.key}>Name:</Text>
                  <Text style={styles.value}>{material.name}</Text>
                </View>
              )}
              {material.price && (
                <View style={styles.row}>
                  <Text style={styles.key}>Price:</Text>
                  <Text style={styles.value}>Rs. {material.price}</Text>
                </View>
              )}
              {material.categoryName && (
                <View style={styles.row}>
                  <Text style={styles.key}>Category:</Text>
                  <Text style={styles.value}>{material.categoryName}</Text>
                </View>
              )}
              {material.length && (
                <View style={styles.row}>
                  <Text style={styles.key}>Length:</Text>
                  <Text style={styles.value}>{material.length}</Text>
                </View>
              )}
              <View style={styles.rowIcons}>
                <TouchableOpacity onPress={() => deleteMaterial(material.id)}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={COLORS().error}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUpdate(material)}>
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

export default ManageSupportingMaterial;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
  },
  materialItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS().border,
    borderRadius: 10,
    padding: 10,
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
