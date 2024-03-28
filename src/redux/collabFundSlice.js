import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import collabFundServices from "../services/collabFundServices";

export const getAllCollabFund = createAsyncThunk(
  "getAllCollabFund",
  async (accountid) => {
    const response = await collabFundServices.getAllCollabFund(accountid);
    return response;
  }
);

export const getCollabFundActivities = createAsyncThunk(
  "getCollabFundActivities",
  async (data) => {
    const response = await collabFundServices.getCollabFundActivities(data);
    return response;
  }
);

const collabFundSlice = createSlice({
  name: "collabFund",
  initialState: {
    collabFunds: null,
    collabFundActivities: null
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

    builder
      .addCase(getCollabFundActivities.fulfilled, (state, action) => {
        state.collabFundActivities = action.payload;
      })
      .addCase(getCollabFundActivities.rejected, (state, action) => {
        console.log("getCollabFundActivities.rejected");
        state.collabFundActivities = null;
      })
      .addCase(getCollabFundActivities.pending, (state, action) => {
        state.collabFundActivities = null;
      });
  }
});

export default collabFundSlice;
