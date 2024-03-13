import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryServices from "../services/categoryServices";

export const getCategories = createAsyncThunk(
  "getCategories",
  async (accountid) => {
    const response = await categoryServices.getCategories(accountid);
    return response;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: null
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
      });
  }
});

export default categorySlice;
