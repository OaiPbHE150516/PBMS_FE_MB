import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionServices from "../services/transactionServices";

export const getTransactionWeekByDay = createAsyncThunk(
  "getTransactionWeekByDay",
  async ({ accountid, time }) => {
    // console.log("getTransactionWeekByDaySlice: ", accountid);
    // console.log("getTransactionWeekByDaySlice: ", time);
    const response = await transactionServices.getTransactionWeekByDay(
      accountid,
      time
    );
    return response;
  }
);

export const setTransactionWeekByDayOnDisplay = createAsyncThunk(
  "setTransactionWeekByDayOnDisplay",
  async (data) => {
    console.log("setTransactionWeekByDayOnDisplay: ", data);
    return data;
  }
);

export const setAddTransactionTime = createAsyncThunk(
  "setAddTransactionTime",
  async (data) => {
    return data;
  }
);

export const setAddTransactionWallet = createAsyncThunk(
  "setAddTransactionWallet",
  async (data) => {
    return data;
  }
);

export const addTransactionNoInvoice = createAsyncThunk(
  "addTransactionNoInvoice",
  async (data) => {
    console.log("addTransactionNoInvoice: ", data);
    const response = await transactionServices.addTransactionNoInvoice(data);
    return response;
  }
);

export const setTransCompIsLoading = createAsyncThunk(
  "setTransCompIsLoading",
  async (data) => {
    return data;
  }
);

export const addTransactionWithInvoice = createAsyncThunk(
  "addTransactionWithInvoice",
  async (data) => {
    console.log("addTransactionWithInvoice: ", data);
    console.log("invoice: ", data.invoice);
    console.log("products: ", data.invoice.products);
    const response = await transactionServices.addTransactionWithInvoice(data);
    return response;
  }
);

// export const addToListTransaction = createAsyncThunk(
//   "addToListTransaction",
//   async (data) => {
//     console.log("addToListTransaction: ", data);
//     return data;
//   }
// );

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactionWeekByDayOnDisplay: null,
    transactionWeekByDay: null,
    listTransaction: [{ week: null, data: null }],
    addTransactionTime: null,
    addTransactionWallet: null,
    transCompIsLoading: false,
    addTransactionWithInvoice: null

  },
  reducers: {
    // fetchTransactionData: (state, action) => {
    //   switch (action.type) {
    //     case 'addListTransaction':
    //       return state.listTransaction.push(action.payload);
    //     default:
    //       return state;
    //   }
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionWeekByDay.fulfilled, (state, action) => {
        state.transactionWeekByDay = action.payload;
      })
      .addCase(getTransactionWeekByDay.rejected, (state, action) => {
        state.transactionWeekByDay = null;
        console.log("getTransactionWeekByDay.rejected");
      })
      .addCase(getTransactionWeekByDay.pending, (state, action) => {
        state.transactionWeekByDay = null;
      })
      // Set Transaction Week By Day On Display
      .addCase(setTransactionWeekByDayOnDisplay.fulfilled, (state, action) => {
        state.transactionWeekByDayOnDisplay = action.payload;
      })
      .addCase(setTransactionWeekByDayOnDisplay.rejected, (state, action) => {
        state.transactionWeekByDayOnDisplay = null;
        console.log("setTransactionWeekByDayOnDisplay.rejected");
      })
      .addCase(setTransactionWeekByDayOnDisplay.pending, (state, action) => {
        state.transactionWeekByDayOnDisplay = null;
      })
      // Set Add Transaction Time
      .addCase(setAddTransactionTime.fulfilled, (state, action) => {
        state.addTransactionTime = action.payload;
      })
      .addCase(setAddTransactionTime.rejected, (state, action) => {
        state.addTransactionTime = null;
        console.log("setAddTransactionTime.rejected");
      })
      // Set Add Transaction Wallet
      .addCase(setAddTransactionWallet.fulfilled, (state, action) => {
        state.addTransactionWallet = action.payload;
      })
      .addCase(setAddTransactionWallet.rejected, (state, action) => {
        state.addTransactionWallet = null;
        console.log("setAddTransactionWallet.rejected");
      })
      // Add Transaction No Invoice
      .addCase(addTransactionNoInvoice.fulfilled, (state, action) => {
        console.log("addTransactionNoInvoice.fulfilled: ", action.payload);
      })
      .addCase(addTransactionNoInvoice.rejected, (state, action) => {
        console.log("addTransactionNoInvoice.rejected");
      })
      // Set Transaction Component Is Loading
      .addCase(setTransCompIsLoading.fulfilled, (state, action) => {
        state.transCompIsLoading = action.payload;
      })
      .addCase(setTransCompIsLoading.rejected, (state, action) => {
        state.transCompIsLoading = false;
        console.log("setTransCompIsLoading.rejected");
      })
      // Add Transaction With Invoice
      .addCase(addTransactionWithInvoice.fulfilled, (state, action) => {
        state.addTransactionWithInvoice = action.payload;
        console.log("addTransactionWithInvoice.fulfilled: ", action.payload);
      })
      .addCase(addTransactionWithInvoice.rejected, (state, action) => {
        state.addTransactionWithInvoice = null;
        console.log("addTransactionWithInvoice.rejected");
      });
  }
});

export default transactionSlice;
