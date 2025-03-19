import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiDollarSign, FiPlus } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { updateCollateral } from '../../store/slices/overdraftSlice';

interface CollateralSummaryProps {
  collateralAmount: number;
  maxOverdraftEligibility: number;
  performanceScore: number;
  isProcessing: boolean;
  onAddCollateral: (amount: number, paymentMethod: string) => Promise<void>;
}

const CollateralSummary: React.FC<CollateralSummaryProps> = ({
  collateralAmount,
  maxOverdraftEligibility,
  performanceScore,
  isProcessing,
  onAddCollateral
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash_deposit':
        return 'Cash Deposit';
      default:
        return method;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isProcessing) return;
    
    try {
      await onAddCollateral(Number(amount), paymentMethod);
      setAmount('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add collateral:', error);
    }
  };

  // Calculate leverage ratio (overdraft eligibility / collateral amount)
  const leverageRatio = collateralAmount > 0 
    ? (maxOverdraftEligibility / collateralAmount).toFixed(1) 
    : '0.0';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Collateral Summary</h3>
        <div className="p-2 bg-green-100 rounded-full">
          <IconComponent Icon={FiShield} className="h-5 w-5 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <IconComponent Icon={FiDollarSign} className="h-4 w-4 text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">Total Collateral</p>
          </div>
          <p className="text-xl font-bold">{formatCurrency(collateralAmount)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <IconComponent Icon={FiTrendingUp} className="h-4 w-4 text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">Max Overdraft</p>
          </div>
          <p className="text-xl font-bold">{formatCurrency(maxOverdraftEligibility)}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">Leverage Ratio</p>
            <p className="text-sm text-blue-600">
              {leverageRatio}x your collateral
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Performance Score</p>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                <motion.div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${performanceScore}%` }}
                ></motion.div>
              </div>
              <span className="text-sm text-blue-600">{performanceScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <IconComponent Icon={FiPlus} className="h-4 w-4 mr-2" />
          Add Collateral
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (TZS)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter amount"
              required
            />
          </div>
          
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="mobile_money">{getPaymentMethodLabel('mobile_money')}</option>
              <option value="bank_transfer">{getPaymentMethodLabel('bank_transfer')}</option>
              <option value="cash_deposit">{getPaymentMethodLabel('cash_deposit')}</option>
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Confirm'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="text-xs text-gray-500 mt-2">
        <p>Your collateral determines your maximum overdraft eligibility. Higher performance scores can increase your leverage ratio.</p>
      </div>
    </div>
  );
};

const CollateralSummaryContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    collateralAmount,
    performanceScore = 85, // Default value if not in state
    isProcessing 
  } = useSelector((state: RootState) => state.overdraft);
  
  // Calculate max overdraft eligibility based on collateral and performance
  // Higher performance scores give better leverage
  const leverageMultiplier = performanceScore >= 80 ? 3 : performanceScore >= 60 ? 2.5 : 2;
  const maxOverdraftEligibility = Math.round(collateralAmount * leverageMultiplier);
  
  const handleAddCollateral = async (amount: number, paymentMethod: string) => {
    try {
      await dispatch(updateCollateral({ amount, paymentMethod }) as any);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update collateral:', error);
      return Promise.reject(error);
    }
  };
  
  return (
    <CollateralSummary
      collateralAmount={collateralAmount}
      maxOverdraftEligibility={maxOverdraftEligibility}
      performanceScore={performanceScore}
      isProcessing={isProcessing}
      onAddCollateral={handleAddCollateral}
    />
  );
};

export default CollateralSummaryContainer;
