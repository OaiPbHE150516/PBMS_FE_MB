import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import walletServices from "../services/walletServices";

export const getAllWallet = createAsyncThunk(
  "getAllWallet",
  async (accountid) => {
    const response = await walletServices.getAllWallet(accountid);
    return response;
  }
);

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
    // console.log("getTotalBalanceEachWallet: ", response);
    return response;
  }
);

// createWallet
export const createWallet = createAsyncThunk("createWallet", async (wallet) => {
  const response = await walletServices.createWallet(wallet);
  return response;
});

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallets: null,
    totalBalance: null,
    totalBalanceEachWallet: null,
    createWallet: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get wallet
      .addCase(getAllWallet.fulfilled, (state, action) => {
        state.wallets = action.payload;
      })
      .addCase(getAllWallet.rejected, (state, action) => {
        state.wallets = null;
      })
      .addCase(getAllWallet.pending, (state, action) => {
        state.wallets = null;
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
      });
    builder
      .addCase(createWallet.fulfilled, (state, action) => {
        state.createWallet = action.payload;
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.createWallet = null;
        console.log("createWallet.rejected");
      });
  }
});

export default walletSlice;
