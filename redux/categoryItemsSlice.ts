import { createSlice } from "@reduxjs/toolkit";

interface Items {
  id: string;
  name: string;
  width: number;
  height: number;
  price: number;
  categoryName: string;
}

const initialState: Items[] = [];

const categoryItemsSlice = createSlice({
  name: "categoryItems",
  initialState,
  reducers: {
    addCategoryItems: (state, action) => {
      state.push(action.payload);
    },
    setAllCategoriesItems: (state, action) => {
      return action.payload;
    },
    deleteCategoryItems: (state, action) => {
      return state.filter((category) => category.id !== action.payload);
    },
    updateCategoryItems: (state, action) => {
      const index = state.findIndex(
        (cat) =>
          (cat.name && cat.price) ===
          (action.payload.name && action.payload.price)
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const {
  addCategoryItems,
  deleteCategoryItems,
  setAllCategoriesItems,
  updateCategoryItems,
} = categoryItemsSlice.actions;

export const selectCategoryItems = (state: { categoryItems: Items[] }) =>
  state.categoryItems;

export default categoryItemsSlice.reducer;
