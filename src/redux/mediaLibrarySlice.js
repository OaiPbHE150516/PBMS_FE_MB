import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setAssetsShowing = createAsyncThunk(
  "setAssetsShowing",
  async (assetsShowing) => {
    return assetsShowing;
  }
);

// export const isShowingAsset
// export const setIsShowingAsset = createAsyncThunk(
//   "setIsShowingAsset",
//   async (isShowingAsset) => {
//     return isShowingAsset;
//   }
// );

const mediaLibrarySlice = createSlice({
  name: "mediaLibrary",
  initialState: {
    assetsShowing: {
      asset: null,
      isShowingAsset: "false"
    }
    // isShowingAsset: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAssetsShowing.fulfilled, (state, action) => {
      state.assetsShowing = action.payload;
    });
    builder.addCase(setAssetsShowing.rejected, (state, action) => {
      state.assetsShowing = null;
    });
    // builder.addCase(setIsShowingAsset.fulfilled, (state, action) => {
    //   state.isShowingAsset = action.payload;
    // });
    // builder.addCase(setIsShowingAsset.rejected, (state, action) => {
    //   state.isShowingAsset = false;
    // });
  }
});

export default mediaLibrarySlice;
