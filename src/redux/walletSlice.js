import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import walletServices from "../services/walletServices";

export const getWallet = createAsyncThunk("getWallet", async (accountid) => {
  const response = await walletServices.getWallet(accountid);
  return response;
});

export const getTotalBalance = createAsyncThunk(
  "getTotalBalance",
  async (accountid) => {
    const response = await walletServices.getTotalBalance(accountid);
    return response;
  }
);

// /api/wallet/get/total-amount-each-wallet/
export const getTotalBalanceEachWallet = createAsyncThunk(
  "getTotalBalanceEachWallet",
  async (accountid) => {
    const response = await walletServices.getTotalBalanceEachWallet(accountid);
    console.log("getTotalBalanceEachWallet: ", response);
    return response;
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallet: null,
    totalBalance: null,
    totalBalanceEachWallet: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get wallet
      .addCase(getWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.wallet = null;
      })
      .addCase(getWallet.pending, (state, action) => {
        state.wallet = null;
      })
      // total balance
      .addCase(getTotalBalance.fulfilled, (state, action) => {
        state.totalBalance = action.payload;
      })
      .addCase(getTotalBalance.rejected, (state, action) => {
        state.totalBalance = null;
      })
      // total balance each wallet
      .addCase(getTotalBalanceEachWallet.fulfilled, (state, action) => {
        state.totalBalanceEachWallet = action.payload;
      })
      .addCase(getTotalBalanceEachWallet.rejected, (state, action) => {
        console.log("getTotalBalanceEachWallet.rejected");
        state.totalBalanceEachWallet = null;
      })
  }
});

export default walletSlice;
