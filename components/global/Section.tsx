import { COLORS } from "@/utills/ThemeStyles";
import { StyleSheet, Switch, Text, View } from "react-native";

export const Section = ({
  title,
  children,
  containerStyle,
  onChange,
  isSwitchOn,
  showSwitch,
}: {
  title: string;
  children: React.ReactNode;
  containerStyle?: object;
  onChange?: () => void;
  isSwitchOn?: boolean;
  showSwitch?: boolean;
}) => (
  <View style={[styles.section, containerStyle]}>
    <View style={styles.switchWrapper}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showSwitch && (
        <Switch
          thumbColor={COLORS().primary}
          trackColor={{
            false: COLORS().border,
            true: COLORS().primaryDisabled,
          }}
          onChange={onChange}
          value={isSwitchOn}
        />
      )}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: COLORS().background,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    margin:5
  },
  switchWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS().primary,
  },
});
