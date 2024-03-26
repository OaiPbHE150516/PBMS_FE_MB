import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authenServices from "../services/authenServices";

export const signin = createAsyncThunk("signin", async (data) => {
  const response = await authenServices.signin(data);
  return response;
});

export const signout = createAsyncThunk("signout", async () => {
  const response = await authenServices.signout();
  return response;
});

// hot hardcode signin
export const signinHardcode = createAsyncThunk(
  "signinHardcode",
  async (data) => {
    return data;
  }
);

const authenSlice = createSlice({
  name: "authen",
  initialState: {
    account: null
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

    builder
      .addCase(signout.fulfilled, (state, action) => {
        state.account = null;
      })
      .addCase(signout.rejected, (state, action) => {
        state.account = null;
      })
      .addCase(signout.pending, (state, action) => {
        state.account = null;
      });

    builder
      .addCase(signinHardcode.fulfilled, (state, action) => {
        state.account = action.payload;
      })
      .addCase(signinHardcode.rejected, (state, action) => {
        state.account = null;
      })
      .addCase(signinHardcode.pending, (state, action) => {
        state.account = null;
      });
  }
});

export default authenSlice;
