import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fileServices from "../services/fileServices";

export const upToScanInvoice = createAsyncThunk(
  "upToScanInvoice",
  async (file) => {
    const response = await fileServices.upToScanInvoice(file);
    return response;
  }
);

const fileSlice = createSlice({
  name: "file",
  initialState: {
    invoiceScanning: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(upToScanInvoice.fulfilled, (state, action) => {
      state.invoiceScanning = action.payload;
      console.log("upToScanInvoice.fulfilled: ", action.payload);
    });
    builder.addCase(upToScanInvoice.rejected, (state, action) => {
      state.invoiceScanning = null;
      console.log("upToScanInvoice.rejected: ", action.payload);
    });
  }
});

export default fileSlice;
