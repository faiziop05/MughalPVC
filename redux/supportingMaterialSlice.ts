import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Material = {
  id: string; // Unique identifier for each material
  name: string;
  price: number;
  length?: number;
  categoryName?: string; // Optional: if you want to associate materials with categories
};

const initialState = {
  supportingMaterial: [] as Material[],
};

const supportingMaterialSlice = createSlice({
  name: "supportingMaterial",
  initialState,
  reducers: {
    // Set the entire supporting material array
    setSupportingMaterial: (state, action: PayloadAction<Material[]>) => {
      state.supportingMaterial = action.payload;
    },
    // Add a new material
    addSupportingMaterial: (state, action: PayloadAction<Material>) => {
      state.supportingMaterial.push(action.payload);
    },
    // Update an existing material by ID
    updateSupportingMaterial: (
      state,
      action: PayloadAction<{ id: string; updatedMaterial: Partial<Material> }>
    ) => {
      const { id, updatedMaterial } = action.payload;
      const index = state.supportingMaterial.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.supportingMaterial[index] = {
          ...state.supportingMaterial[index],
          ...updatedMaterial,
        };
      }
    },
    // Delete a material by ID
    deleteSupportingMaterial: (state, action: PayloadAction<string>) => {
      state.supportingMaterial = state.supportingMaterial.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setSupportingMaterial,
  addSupportingMaterial,
  updateSupportingMaterial,
  deleteSupportingMaterial,
} = supportingMaterialSlice.actions;

export const selectSupportingMaterial = (state: { supportingMaterial: { supportingMaterial: Material[] } }) =>
  state.supportingMaterial.supportingMaterial;

export default supportingMaterialSlice.reducer;