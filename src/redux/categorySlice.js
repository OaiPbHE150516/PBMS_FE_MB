import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryServices from "../services/categoryServices";

export const getCategories = createAsyncThunk(
  "getCategories",
  async (accountid) => {
    const response = await categoryServices.getCategories(accountid);
    return response;
  }
);

export const setCategoryToAddTransaction = createAsyncThunk(
  "setCategoryToAddTransaction",
  async (category) => {
    return category;
  }
);

export const setModalCategoryVisible = createAsyncThunk(
  "setModalCategoryVisible",
  async (modalCategoryVisible) => {
    return modalCategoryVisible;
  }
);

export const createCategory = createAsyncThunk(
  "createCategory",
  async (category) => {
    const response = await categoryServices.createCategory(category);
    return response;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: null,
    categoryToAddTransaction: null,
    modalCategoryVisible: false,
    createCategory: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categories = null;
        console.log("getCategories.rejected");
      })
      .addCase(getCategories.pending, (state, action) => {
        state.categories = null;
      })
      .addCase(setCategoryToAddTransaction.fulfilled, (state, action) => {
        state.categoryToAddTransaction = action.payload;
      })
      .addCase(setCategoryToAddTransaction.rejected, (state, action) => {
        state.categoryToAddTransaction = null;
        console.log("setCategoryToAddTransaction.rejected");
      })
      .addCase(setCategoryToAddTransaction.pending, (state, action) => {
        state.categoryToAddTransaction = null;
      })
      .addCase(setModalCategoryVisible.fulfilled, (state, action) => {
        state.modalCategoryVisible = action.payload;
      })
      .addCase(setModalCategoryVisible.rejected, (state, action) => {
        state.modalCategoryVisible = false;
        console.log("setModalCategoryVisible.rejected");
      });

    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createCategory = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createCategory = null;
        console.log("createCategory.rejected");
      })
      .addCase(createCategory.pending, (state, action) => {
        state.createCategory = null;
      });
  }
});

export default categorySlice;
