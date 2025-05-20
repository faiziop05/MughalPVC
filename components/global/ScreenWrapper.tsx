import { COLORS } from "@/utills/ThemeStyles";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;                     
  backgroundColor?: string;            
  padding?: boolean;                  
  statusBarStyle?: "light" | "dark";  
  edges?: ("top" | "bottom" | "left" | "right")[];
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scroll = false,
  backgroundColor = COLORS().background,
  padding = true,
  statusBarStyle = "dark",
  edges, 
}) => {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor }]}
    >
      <StatusBar barStyle={`${statusBarStyle}-content`} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
      >
        <Container
          contentContainerStyle={
            scroll ? [styles.flexGrow, padding && styles.padding] : undefined
          }
          style={!scroll && padding ? styles.padding : undefined}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  padding: {
    padding: 16,
  },
});
