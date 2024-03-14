import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setModalAddTransactionVisible = createAsyncThunk(
  "setModalAddTransactionVisible",
  async (modalAddTransactionVisible) => {
    return modalAddTransactionVisible;
  }
);

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalAddTransactionVisible: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      setModalAddTransactionVisible.fulfilled,
      (state, action) => {
        state.modalAddTransactionVisible = action.payload;
      }
    );
    builder.addCase(setModalAddTransactionVisible.rejected, (state, action) => {
      state.modalAddTransactionVisible = false;
    });
  }
});

export default modalSlice;
