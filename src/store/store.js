import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authenSlice from "../redux/authenSlice";
import walletSlice from "../redux/walletSlice";
import datedisplay from "../redux/datedisplaySlice";
import transactionSlice from "../redux/transactionSlice";
import categorySlice from "../redux/categorySlice";
import modalSlice from "../redux/modalSlice";
import fileSlice from "../redux/fileSlice";
import collabFundSlice from "../redux/collabFundSlice";
import dataSlice from "../redux/dataSlice";

const rootReducer = combineReducers({
    authen: authenSlice.reducer,
    wallet: walletSlice.reducer,
    datedisplay: datedisplay.reducer,
    transaction: transactionSlice.reducer,
    category: categorySlice.reducer,
    modal: modalSlice.reducer,
    file: fileSlice.reducer,
    collabFund: collabFundSlice.reducer,
    data: dataSlice.reducer
});

const store = configureStore({
    reducer: rootReducer
});

export default store;
