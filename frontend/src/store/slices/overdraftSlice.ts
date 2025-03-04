import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OverdraftTransaction {
  id: string;
  type: 'overdraft' | 'repayment';
  amount: number;
  date: string;
  description: string;
}

export interface OverdraftState {
  currentBalance: number;
  limit: number;
  repaymentPercentage: number;
  totalRepaid: number;
  collateralAmount: number;
  loading: boolean;
  error: string | null;
  overdraftBalance: number;
  overdraftLimit: number;
  repaymentProgress: number;
  availableOverdraft: number;
  isEligible: boolean;
  isProcessing: boolean;
  overdraftTransactions: OverdraftTransaction[];
}

const initialState: OverdraftState = {
  currentBalance: 0,
  limit: 0,
  repaymentPercentage: 10, 
  totalRepaid: 0,
  collateralAmount: 0,
  loading: false,
  error: null,
  overdraftBalance: 0,
  overdraftLimit: 100000,
  repaymentProgress: 0,
  availableOverdraft: 100000,
  isEligible: true,
  isProcessing: false,
  overdraftTransactions: [],
};

const overdraftSlice = createSlice({
  name: 'overdraft',
  initialState,
  reducers: {
    setOverdraftData: (state, action: PayloadAction<Partial<OverdraftState>>) => {
      return { ...state, ...action.payload, loading: false, error: null };
    },
    updateRepayment: (state, action: PayloadAction<number>) => {
      state.totalRepaid += action.payload;
      state.currentBalance -= action.payload;
      state.overdraftBalance = state.currentBalance;
      
      if (state.overdraftLimit > 0) {
        state.repaymentProgress = Math.min(1, state.totalRepaid / state.overdraftLimit);
      }
      
      state.availableOverdraft = Math.max(0, state.overdraftLimit - state.overdraftBalance);
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
    addOverdraftTransaction: (state, action: PayloadAction<OverdraftTransaction>) => {
      state.overdraftTransactions.unshift(action.payload);
    },
  },
});

export const { 
  setOverdraftData, 
  updateRepayment, 
  setLoading, 
  setError,
  setProcessing,
  addOverdraftTransaction
} = overdraftSlice.actions;

export const updateCollateral = (data: { amount: number; paymentMethod: string }) => {
  return async (dispatch: any) => {
    dispatch(setProcessing(true));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollateralAmount = initialState.collateralAmount + data.amount;
      const newOverdraftLimit = newCollateralAmount * 2; 
      
      dispatch(setOverdraftData({
        collateralAmount: newCollateralAmount,
        limit: newOverdraftLimit,
        overdraftLimit: newOverdraftLimit,
        availableOverdraft: newOverdraftLimit - initialState.currentBalance,
      }));
      
      const transaction: OverdraftTransaction = {
        id: Date.now().toString(),
        type: 'repayment',
        amount: data.amount,
        date: new Date().toISOString(),
        description: `Collateral deposit via ${data.paymentMethod}`,
      };
      
      dispatch(addOverdraftTransaction(transaction));
      dispatch(setProcessing(false));
      
      return transaction;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to update collateral'));
      throw error;
    }
  };
};

export default overdraftSlice.reducer;
