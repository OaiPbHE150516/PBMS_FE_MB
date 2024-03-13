import { createSlice, configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import authenSlice from "../redux/authenSlice";
import walletSlice from "../redux/walletSlice";
import datedisplay from "../redux/datedisplaySlice";
import transactionSlice from "../redux/transactionSlice";
import categorySlice from "../redux/categorySlice";

const rootReducers = combineReducers({
  authen: authenSlice.reducer,
  wallet: walletSlice.reducer,
  datedisplay: datedisplay.reducer,
  transaction: transactionSlice.reducer,
  category: categorySlice.reducer
});

const store = configureStore({
  reducer: rootReducers
});

export default store;
