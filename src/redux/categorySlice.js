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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: null,
    categoryToAddTransaction: null,
    modalCategoryVisible: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categories = null;
        console.error("getCategories.rejected");
      })
      .addCase(getCategories.pending, (state, action) => {
        state.categories = null;
      })
      .addCase(setCategoryToAddTransaction.fulfilled, (state, action) => {
        state.categoryToAddTransaction = action.payload;
      })
      .addCase(setCategoryToAddTransaction.rejected, (state, action) => {
        state.categoryToAddTransaction = null;
        console.error("setCategoryToAddTransaction.rejected");
      })
      .addCase(setCategoryToAddTransaction.pending, (state, action) => {
        state.categoryToAddTransaction = null;
      })
      .addCase(setModalCategoryVisible.fulfilled, (state, action) => {
        state.modalCategoryVisible = action.payload;
      })
      .addCase(setModalCategoryVisible.rejected, (state, action) => {
        state.modalCategoryVisible = false;
        console.error("setModalCategoryVisible.rejected");
      });
  }
});

export default categorySlice;
