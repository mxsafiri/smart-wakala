import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OverdraftTransaction {
  id: string;
  type: 'overdraft' | 'repayment' | 'collateral' | 'auto_deduction';
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
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
  performanceScore: number;
  nextPaymentDue: string;
  nextPaymentAmount: number;
  lastTopUpAmount: number;
  lastAutoDeduction: number;
  repaymentDueDate: string;
  isOffline: boolean;
  notifications: any[];
  overdraftUsed: number;
  creditScoreFactors: {
    repaymentHistory: number;
    transactionVolume: number;
    collateralRatio: number;
    accountAge: number;
  };
}

const initialState: OverdraftState = {
  currentBalance: 50000,
  limit: 100000,
  repaymentPercentage: 10, 
  totalRepaid: 25000,
  collateralAmount: 50000,
  loading: false,
  error: null,
  overdraftBalance: 50000,
  overdraftLimit: 100000,
  repaymentProgress: 0.25,
  availableOverdraft: 50000,
  isEligible: true,
  isProcessing: false,
  overdraftTransactions: [
    {
      id: '1',
      type: 'overdraft',
      amount: 75000,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      description: 'Float liquidity overdraft',
    },
    {
      id: '2',
      type: 'repayment',
      amount: 25000,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      description: 'Manual repayment',
      paymentMethod: 'mobile_money'
    }
  ],
  performanceScore: 85,
  nextPaymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
  nextPaymentAmount: 10000,
  lastTopUpAmount: 500000,
  lastAutoDeduction: 50000,
  repaymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  isOffline: false,
  notifications: [],
  overdraftUsed: 50000,
  creditScoreFactors: {
    repaymentHistory: 90,
    transactionVolume: 75,
    collateralRatio: 80,
    accountAge: 65
  }
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
      
      // Update credit score factors
      state.creditScoreFactors.repaymentHistory = Math.min(100, state.creditScoreFactors.repaymentHistory + 2);
      
      // Add transaction record
      state.overdraftTransactions.unshift({
        id: Date.now().toString(),
        type: 'repayment',
        amount: action.payload,
        date: new Date().toISOString(),
        description: 'Manual repayment'
      });
    },
    processTopUp: (state, action: PayloadAction<{ amount: number }>) => {
      const { amount } = action.payload;
      const autoDeductionAmount = Math.round(amount * (state.repaymentPercentage / 100));
      
      // Record the top-up
      state.lastTopUpAmount = amount;
      
      // Process auto-deduction if there's an outstanding balance
      if (state.currentBalance > 0 && autoDeductionAmount > 0) {
        // Apply auto-deduction to the current balance
        const actualDeduction = Math.min(autoDeductionAmount, state.currentBalance);
        state.currentBalance -= actualDeduction;
        state.overdraftBalance = state.currentBalance;
        state.totalRepaid += actualDeduction;
        state.lastAutoDeduction = actualDeduction;
        
        // Update repayment progress
        if (state.overdraftLimit > 0) {
          state.repaymentProgress = Math.min(1, state.totalRepaid / state.overdraftLimit);
        }
        
        // Update available overdraft
        state.availableOverdraft = Math.max(0, state.overdraftLimit - state.overdraftBalance);
        
        // Update credit score factors
        state.creditScoreFactors.repaymentHistory = Math.min(100, state.creditScoreFactors.repaymentHistory + 1);
        state.creditScoreFactors.transactionVolume = Math.min(100, state.creditScoreFactors.transactionVolume + 2);
        
        // Add transaction record
        state.overdraftTransactions.unshift({
          id: Date.now().toString(),
          type: 'auto_deduction',
          amount: actualDeduction,
          date: new Date().toISOString(),
          description: `Auto-deduction (${state.repaymentPercentage}% of top-up)`
        });
      }
      
      // Update transaction volume score regardless of deduction
      state.creditScoreFactors.transactionVolume = Math.min(100, state.creditScoreFactors.transactionVolume + 1);
      
      // Recalculate performance score based on credit factors
      state.performanceScore = Math.round(
        (state.creditScoreFactors.repaymentHistory * 0.4) +
        (state.creditScoreFactors.transactionVolume * 0.3) +
        (state.creditScoreFactors.collateralRatio * 0.2) +
        (state.creditScoreFactors.accountAge * 0.1)
      );
    },
    updatePerformanceScore: (state, action: PayloadAction<number>) => {
      state.performanceScore = Math.max(0, Math.min(100, action.payload));
      
      // Adjust overdraft limit based on performance score and collateral
      // Higher performance scores can increase the leverage ratio
      const leverageMultiplier = state.performanceScore >= 80 ? 3 : state.performanceScore >= 60 ? 2.5 : 2;
      state.overdraftLimit = Math.round(state.collateralAmount * leverageMultiplier);
      state.availableOverdraft = Math.max(0, state.overdraftLimit - state.overdraftBalance);
    },
    updateRepaymentPercentage: (state, action: PayloadAction<number>) => {
      // Ensure percentage is within reasonable bounds (5-20%)
      state.repaymentPercentage = Math.max(5, Math.min(20, action.payload));
    },
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = !action.payload;
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
    updateCreditScoreFactors: (state, action: PayloadAction<Partial<OverdraftState['creditScoreFactors']>>) => {
      state.creditScoreFactors = {
        ...state.creditScoreFactors,
        ...action.payload
      };
      
      // Recalculate performance score based on updated factors
      state.performanceScore = Math.round(
        (state.creditScoreFactors.repaymentHistory * 0.4) +
        (state.creditScoreFactors.transactionVolume * 0.3) +
        (state.creditScoreFactors.collateralRatio * 0.2) +
        (state.creditScoreFactors.accountAge * 0.1)
      );
    },
    updateCollateral: (state, action: PayloadAction<number | { amount: number; paymentMethod: string }>) => {
      const newCollateralAmount = typeof action.payload === 'number' 
        ? action.payload 
        : action.payload.amount;
      
      state.collateralAmount = newCollateralAmount;
      
      // Update overdraft limit based on collateral (typically 2-3x collateral)
      const multiplier = state.performanceScore >= 80 ? 3 : state.performanceScore >= 60 ? 2.5 : 2;
      state.overdraftLimit = Math.round(newCollateralAmount * multiplier);
      state.availableOverdraft = Math.max(0, state.overdraftLimit - state.overdraftBalance);
      
      // Update credit score factor
      state.creditScoreFactors.collateralRatio = Math.min(100, Math.round((newCollateralAmount / state.overdraftLimit) * 100));
      
      // Add transaction record
      state.overdraftTransactions.unshift({
        id: Date.now().toString(),
        type: 'collateral',
        amount: newCollateralAmount,
        date: new Date().toISOString(),
        description: 'Collateral update'
      });
    },
    requestOverdraft: (state, action: PayloadAction<number | { amount: number; reason: string }>) => {
      const requestedAmount = typeof action.payload === 'number' 
        ? action.payload 
        : action.payload.amount;
      
      if (requestedAmount <= state.availableOverdraft) {
        state.overdraftBalance += requestedAmount;
        state.currentBalance += requestedAmount;
        state.availableOverdraft = Math.max(0, state.overdraftLimit - state.overdraftBalance);
        state.overdraftUsed = state.overdraftBalance;
        
        // Add transaction record
        state.overdraftTransactions.unshift({
          id: Date.now().toString(),
          type: 'overdraft',
          amount: requestedAmount,
          date: new Date().toISOString(),
          description: typeof action.payload === 'object' && action.payload.reason 
            ? `Float liquidity overdraft: ${action.payload.reason}`
            : 'Float liquidity overdraft'
        });
      }
    }
  },
});

export const { 
  setOverdraftData, 
  updateRepayment, 
  processTopUp, 
  updatePerformanceScore,
  updateRepaymentPercentage,
  setNetworkStatus,
  setLoading, 
  setProcessing, 
  setError, 
  addOverdraftTransaction,
  updateCreditScoreFactors,
  updateCollateral,
  requestOverdraft
} = overdraftSlice.actions;

export default overdraftSlice.reducer;
