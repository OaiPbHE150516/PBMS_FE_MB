import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fileServices from "../services/fileServices";

export const upToScanInvoice = createAsyncThunk(
  "upToScanInvoice",
  async (file) => {
    const response = await fileServices.upToScanInvoice(file);
    return response;
  }
);

// uploadToInvoiceTransaction
export const uploadToInvoiceTransaction = createAsyncThunk(
  "uploadToInvoiceTransaction",
  async (file) => {
    const response = await fileServices.uploadToInvoiceTransaction(file);
    return response;
  }
);

export const uploadToInvoiceTransactionFileName = createAsyncThunk(
  "uploadToInvoiceTransactionFileName",
  async ({ asset, filenamecustom }) => {
    const response = await fileServices.uploadToInvoiceTransactionFileName({
      asset: asset,
      filenamecustom: filenamecustom
    });
    return response;
  }
);

// // export get InvoiceImageURL
// export const getInvoiceImageURL = createAsyncThunk(
//   "getInvoiceImageURL",
//   async (file) => {
//     return file;
//   }
// );

const fileSlice = createSlice({
  name: "file",
  initialState: {
    invoiceScanning: null,
    invoiceUploading: null,
    invoiceImageURL: null,
    invoiceUploadingFileName: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(upToScanInvoice.fulfilled, (state, action) => {
      state.invoiceScanning = action.payload;
      // console.log("upToScanInvoice.fulfilled: ", action.payload);
    });
    builder.addCase(upToScanInvoice.rejected, (state, action) => {
      state.invoiceScanning = null;
      console.log("upToScanInvoice.rejected: ", action.payload);
    });
    builder.addCase(uploadToInvoiceTransaction.fulfilled, (state, action) => {
      state.invoiceUploading = action.payload;
      console.log("uploadToInvoiceTransaction.fulfilled: ", action.payload);
      state.invoiceImageURL = action.payload;
    });
    builder.addCase(uploadToInvoiceTransaction.rejected, (state, action) => {
      state.invoiceUploading = null;
      console.log("uploadToInvoiceTransaction.rejected: ", action.payload);
    });
    builder.addCase(
      uploadToInvoiceTransactionFileName.fulfilled,
      (state, action) => {
        state.invoiceUploadingFileName = action.payload;
        state.invoiceImageURL = action.payload;
      }
    );
    builder.addCase(
      uploadToInvoiceTransactionFileName.rejected,
      (state, action) => {
        state.invoiceUploadingFileName = null;
        console.log(
          "uploadToInvoiceTransactionFileName.rejected: ",
          action.payload
        );
      }
    );
    // builder.addCase(getInvoiceImageURL.fulfilled, (state, action) => {
    //   state.invoiceImageURL = action.payload;
    //   // console.log("getInvoiceImageURL.fulfilled: ", action.payload);
    // });
    // builder.addCase(getInvoiceImageURL.rejected, (state, action) => {
    //   state.invoiceImageURL = null;
    //   console.log("getInvoiceImageURL.rejected: ", action.payload);
    // });
  }
});

export default fileSlice;
