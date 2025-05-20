import { COLORS } from "@/utills/ThemeStyles";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Option = {
    label: string;
    value: string;
    price: number;
    width: number;
    height: number;
  };
  

type Props = {
  options: Option[];
  multiple?: boolean;
  placeholder?: string;
  selectedValues: Option[];
  onSelect: (selected: Option[]) => void;
  style?: object;
  disabled?:boolean
};

const SelectInput: React.FC<Props> = ({
  options,
  multiple = false,
  placeholder = "Select",
  selectedValues,
  onSelect,
  style,
  disabled
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleOption = (option: Option) => {
    if (multiple) {
      const exists = selectedValues.some((item) => item.value === option.value);
      if (exists) {
        onSelect(selectedValues.filter((item) => item.value !== option.value));
      } else {
        onSelect([...selectedValues, option]);
      }
    } else {
      onSelect([option]);
      setModalVisible(false);
    }
  };

  const isSelected = (option: Option) =>
    selectedValues.some((item) => item.value === option.value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View>
      <TouchableOpacity
      disabled={disabled}
        style={[styles.selector,style,disabled && { backgroundColor: COLORS().border,}]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: selectedValues.length ? "#000" : "#999" }}>
          {selectedValues.length
            ? multiple
              ? selectedValues.map((s) => s.label).join(", ")
              : selectedValues[0].label
            : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#555" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Search..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />

            <ScrollView style={{ maxHeight: 250 }}>
              {filteredOptions.length ? (
                filteredOptions.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.optionItem}
                    onPress={() => toggleOption(item)}
                  >
                    <Text>{item.label}</Text>
                    {isSelected(item) && (
                      <Ionicons name="checkmark" size={18} color="green" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResult}>No results found</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={{ textAlign: "center", color: "#fff" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: COLORS().border,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: COLORS().background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor:COLORS().background,
    borderRadius: 10,
    padding: 15,
    maxHeight: "80%",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS().border,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: COLORS().border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noResult: {
    textAlign: "center",
    padding: 10,
    color: COLORS().textSecondary,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: COLORS().primary,
    padding: 10,
    borderRadius: 8,
  },
});
