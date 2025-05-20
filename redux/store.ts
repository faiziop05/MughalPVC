// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import categoriesSlice from './categoriesSlice'; // The reducer for your CMS state
import categoryItemsSlice from './categoryItemsSlice'; // The reducer for your CMS state
import roomsSlice from './roomsSlice'; // The reducer for your CMS state
import supportingMaterialSlice from './supportingMaterialSlice'; // The reducer for your CMS state
import themeSlice from './themeSlice'; // The reducer for your CMS state

const store = configureStore({
  reducer: {
    theme: themeSlice,
    categories: categoriesSlice,
    categoryItems: categoryItemsSlice,
    supportingMaterial:supportingMaterialSlice,
    rooms:roomsSlice
  },
});

export default store;
