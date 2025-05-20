import { COLORS } from "@/utills/ThemeStyles";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity
} from "react-native";

interface CustomIconButtonProps {
  icon: React.ReactNode;
  style?: object;
  onPress: () => void;
  disabled?:boolean
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({ icon, style, onPress,disabled }) => {
  return <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.container,style]}>{icon}</TouchableOpacity>;
};

export default CustomIconButton;

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    height: 48,
    alignItems:"center",
    justifyContent:"center",
    borderWidth: 1,
    borderColor: COLORS().primary,
    borderRadius: 12,
  },
});
