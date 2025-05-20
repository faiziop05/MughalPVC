import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  LeftIconStyle?: object;
  inputStyle?: object;
  rightIconStyle?: object;
  containerStyle?: object;
  placeholder?: string;
  value?: string;
  onchangeText?: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad" | 'decimal-pad';
  disabled?: boolean;
};

const CustomInput = ({
  leftIcon,
  inputStyle,
  rightIcon,
  LeftIconStyle,
  rightIconStyle,
  value,
  onChangeText,
  placeholder,
  containerStyle,
  keyboardType,
  disabled,
}: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && <View style={[styles.icon, LeftIconStyle]}>{leftIcon}</View>}

      <TextInput
        keyboardType={keyboardType}
        style={[styles.input, inputStyle]}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={disabled}
      />

      {rightIcon && (
        <View style={[styles.icon, rightIconStyle]}>{rightIcon}</View>
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 10,
  },
  icon: {
    paddingHorizontal: 5,
  },
});
