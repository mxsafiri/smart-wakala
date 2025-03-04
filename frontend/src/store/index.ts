import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import floatReducer from './slices/floatSlice';
import overdraftReducer from './slices/overdraftSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    float: floatReducer,
    overdraft: overdraftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
