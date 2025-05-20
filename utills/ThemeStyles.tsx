const theme = "light"; // Change this to "light" or "dark"

export const COLORS = () => {
  return {
    primary: theme === "dark" ? "#6200EA" : "#6200EA", // Purple for both modes, slightly different shades
    primaryVariant: theme === "dark" ? "#3700B3" : "#3700B3",
    primaryDisabled: theme === "dark" ? "#C5CAE9" : "#C5CAE9",

    secondary: theme === "dark" ? "#8BC34A" : "#8BC34A", // Fresh green for both themes
    secondaryDisabled: theme === "dark" ? "#80C1B7" : "#80C1B7",

    background: theme === "dark" ? "#121212" : "#FAFAFA", // Dark gray for dark mode, light gray for light mode
    surface: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
    border: theme === "dark" ? "#424242" : "#E0E0E0", // Darker border for dark mode, lighter for light mode
    error: theme === "dark" ? "#D32F2F" : "#B00020", // Strong red for errors
    white: "#FFFFFF",
    black: "#000000",

    textPrimary: theme === "dark" ? "#E1E1E1" : "#212121", // Light gray for text in dark mode, dark gray in light mode
    textSecondary: theme === "dark" ? "#90A4AE" : "#757575", // Soft gray for secondary text
    textHint: theme === "dark" ? "#B0BEC5" : "#9E9E9E", // Lighter hint text
    textDisabled: theme === "dark" ? "#616161" : "#BDBDBD", // Subtle disabled text
  };
};
