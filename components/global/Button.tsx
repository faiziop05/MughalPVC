import { COLORS } from "@/utills/ThemeStyles";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
interface ButtonProps {
  title: string;
  buttonStyle?: object; // You can replace 'object' with a more specific type if needed
  onPress?: () => void; // Optional onPress function
  disabled?: boolean; // Optional disabled prop
  loading?: boolean; // Optional loading prop
  icon?: React.ReactNode; // Optional icon prop
  titleStyle?: object; // Optional title style prop
}
const Button: React.FC<ButtonProps> = ({
  title,
  buttonStyle,
  onPress,
  disabled,
  loading,
  icon,
  titleStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS().primary} />
      ) : (
        <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
      )}
      {icon && icon}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    // width: WIDTH * 0.9,
    backgroundColor: COLORS().primary,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", gap:10
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS().white,
  },
});
