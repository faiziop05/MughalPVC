import { createSlice } from "@reduxjs/toolkit";
interface ThemeState {
  theme: string;
}
const initialState: ThemeState = {
  theme: "light", // Default theme can be "light" or "dark"
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});


export const { setTheme } = themeSlice.actions;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export default themeSlice.reducer;