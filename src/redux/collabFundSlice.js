import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import collabFundServices from "../services/collabFundServices";

export const getAllCollabFund = createAsyncThunk(
  "getAllCollabFund",
  async (accountid) => {
    const response = await collabFundServices.getAllCollabFund(accountid);
    return response;
  }
);



const collabFundSlice = createSlice({
  name: "collabFund",
  initialState: {
    collabFunds: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCollabFund.fulfilled, (state, action) => {
        state.collabFunds = action.payload;
      })
      .addCase(getAllCollabFund.rejected, (state, action) => {
        console.log("getAllCollabFund.rejected");
        state.collabFunds = null;
      })
      .addCase(getAllCollabFund.pending, (state, action) => {
        state.collabFunds = null;
      });
  }
});

export default collabFundSlice;
