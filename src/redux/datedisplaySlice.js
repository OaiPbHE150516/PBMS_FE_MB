import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setDatenow = createAsyncThunk("setDatenow", async (datenow) => {
  console.log("Slice setDatenow : ", datenow);
  return datenow;
});

const datedisplay = createSlice({
  name: "datedisplay",
  initialState: {
    datenow: null
  },
  reducers: {
    setDate: (state, action) => {
      state.datenow = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setDatenow.fulfilled, (state, action) => {
      state.datenow = action.payload;
    //   console.log("setDatenow.fulfilled");
    });
  }
});

export default datedisplay;
