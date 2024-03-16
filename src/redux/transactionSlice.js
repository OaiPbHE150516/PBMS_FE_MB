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
    addTransactionTime: null
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
        console.error("getTransactionWeekByDay.rejected");
      })
      .addCase(getTransactionWeekByDay.pending, (state, action) => {
        state.transactionWeekByDay = null;
      })
      .addCase(setTransactionWeekByDayOnDisplay.fulfilled, (state, action) => {
        state.transactionWeekByDayOnDisplay = action.payload;
      })
      .addCase(setTransactionWeekByDayOnDisplay.rejected, (state, action) => {
        state.transactionWeekByDayOnDisplay = null;
        console.error("setTransactionWeekByDayOnDisplay.rejected");
      })
      .addCase(setTransactionWeekByDayOnDisplay.pending, (state, action) => {
        state.transactionWeekByDayOnDisplay = null;
      })
      .addCase(setAddTransactionTime.fulfilled, (state, action) => {
        state.addTransactionTime = action.payload;
      })
      .addCase(setAddTransactionTime.rejected, (state, action) => {
        state.addTransactionTime = null;
        console.error("setAddTransactionTime.rejected");
      });
  }
});

export default transactionSlice;
