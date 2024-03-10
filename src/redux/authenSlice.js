import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authenServices from "../services/authenServices";

export const signin = createAsyncThunk("signin", async (data) => {
  const response = await authenServices.signin(data);
  return response;
});

const authenSlice = createSlice({
  name: "authen",
  initialState: {
    account: null,
  },
  reducers: {
    // setAccount: (state, action) => {
    //   console.log("setAccount");
    //   state.account = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.fulfilled, (state, action) => {
        state.account = action.payload;
      })
      .addCase(signin.rejected, (state, action) => {
        state.account = null;
      })
      .addCase(signin.pending, (state, action) => {
        state.account = null;
      });
  },
});

export default authenSlice;
