import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authenSlice from "../redux/authenSlice";
import walletSlice from "../redux/walletSlice";
import datedisplay from "../redux/datedisplaySlice";
import transactionSlice from "../redux/transactionSlice";
import categorySlice from "../redux/categorySlice";
import modalSlice from "../redux/modalSlice";

const rootReducer = combineReducers({
    authen: authenSlice.reducer,
    wallet: walletSlice.reducer,
    datedisplay: datedisplay.reducer,
    transaction: transactionSlice.reducer,
    category: categorySlice.reducer,
    modal: modalSlice.reducer
});

const store = configureStore({
    reducer: rootReducer
});

export default store;
