import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  id: string;
  name: string;
}

const initialState: Category[] = [];

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.push(action.payload);
    },
    setAllCategories: (state, action: PayloadAction<Category[]>) => {
        return action.payload;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      return state.filter(category => category.id !== action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addCategory, deleteCategory, updateCategory, setAllCategories} = categoriesSlice.actions;

export const selectCategories = (state: { categories: Category[] }) => state.categories;

export default categoriesSlice.reducer;
