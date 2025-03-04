import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FloatTransaction {
  id: string;
  amount: number;
  timestamp: number;
  provider: string;
  status: 'pending' | 'completed' | 'failed';
  repaymentAmount: number;
  type: 'top-up' | 'withdrawal' | 'repayment';
  date: string;
  description: string;
}

export interface FloatState {
  balance: number;
  transactions: FloatTransaction[];
  loading: boolean;
  error: string | null;
  currentFloat: number;
  floatTarget: number;
  recentTransactions: FloatTransaction[];
  isProcessing: boolean;
}

const initialState: FloatState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
  currentFloat: 0,
  floatTarget: 1000000,
  recentTransactions: [],
  isProcessing: false,
};

const floatSlice = createSlice({
  name: 'float',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      state.currentFloat = action.payload;
    },
    setTransactions: (state, action: PayloadAction<FloatTransaction[]>) => {
      state.transactions = action.payload;
      state.recentTransactions = action.payload.slice(0, 5);
    },
    addTransaction: (state, action: PayloadAction<FloatTransaction>) => {
      state.transactions.unshift(action.payload);
      state.recentTransactions = state.transactions.slice(0, 5);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.isProcessing = false;
    },
    setFloatTarget: (state, action: PayloadAction<number>) => {
      state.floatTarget = action.payload;
    },
  },
});

export const { 
  setBalance, 
  setTransactions, 
  addTransaction, 
  setLoading, 
  setError,
  setProcessing,
  setFloatTarget
} = floatSlice.actions;

// Thunk action for float top-up
export const topUpFloat = (data: { amount: number; paymentMethod: string; repaymentAmount: number }) => {
  return async (dispatch: any) => {
    dispatch(setProcessing(true));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction: FloatTransaction = {
        id: Date.now().toString(),
        amount: data.amount,
        timestamp: Date.now(),
        provider: data.paymentMethod,
        status: 'completed',
        repaymentAmount: data.repaymentAmount,
        type: 'top-up',
        date: new Date().toISOString(),
        description: `Float top-up via ${data.paymentMethod}`,
      };
      
      dispatch(addTransaction(newTransaction));
      dispatch(setBalance(initialState.balance + data.amount - data.repaymentAmount));
      dispatch(setProcessing(false));
      
      return newTransaction;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to process float top-up'));
      throw error;
    }
  };
};

export default floatSlice.reducer;
