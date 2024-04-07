import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllData = createAsyncThunk("fetchAllData", async (data) => {
  return data;
});

const dataSlice = createSlice({
  name: "data",
  initialState: {
    shouldFetchData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.shouldFetchData = action.payload;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.shouldFetchData = null;
      })
      .addCase(fetchAllData.pending, (state, action) => {
        state.shouldFetchData = null;
      });
  },
});

export default dataSlice;