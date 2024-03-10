import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authenSlice from '../redux/authenSlice';
import walletSlice from '../redux/walletSlice';

const rootReducers = combineReducers({
  authen: authenSlice.reducer,
  wallet: walletSlice.reducer
});


const store = configureStore({
	reducer: rootReducers
});

export default store;