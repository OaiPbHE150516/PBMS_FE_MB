import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authenSlice from '../redux/authenSlice';

const rootReducers = combineReducers({
  // Add reducers here
  authen: authenSlice.reducer,
});


const store = configureStore({
	reducer: rootReducers
});

export default store;