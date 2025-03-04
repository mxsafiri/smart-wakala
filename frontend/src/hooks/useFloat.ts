import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setBalance, setTransactions, setLoading, setError } from '../store/slices/floatSlice';
import { getFloatBalance, getFloatTransactions, topUpFloat, FloatTopUp } from '../services/float';

export const useFloat = (userId: string | undefined) => {
  const dispatch = useDispatch();
  const { balance, transactions, loading, error } = useSelector((state: RootState) => state.float);
  
  const fetchFloatData = async () => {
    if (!userId) return;
    
    try {
      dispatch(setLoading(true));
      
      // Get float balance
      const floatBalance = await getFloatBalance(userId);
      dispatch(setBalance(floatBalance));
      
      // Get recent transactions
      const floatTransactions = await getFloatTransactions(userId);
      dispatch(setTransactions(floatTransactions));
    } catch (err) {
      console.error('Error fetching float data:', err);
      dispatch(setError((err as Error).message));
    }
  };
  
  const handleTopUp = async (topUpData: FloatTopUp) => {
    if (!userId) return;
    
    try {
      dispatch(setLoading(true));
      await topUpFloat(userId, topUpData);
      
      // Refresh data after top-up
      await fetchFloatData();
      return true;
    } catch (err) {
      console.error('Error topping up float:', err);
      dispatch(setError((err as Error).message));
      return false;
    }
  };
  
  useEffect(() => {
    fetchFloatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  
  return {
    balance,
    transactions,
    loading,
    error,
    refreshData: fetchFloatData,
    topUp: handleTopUp
  };
};
