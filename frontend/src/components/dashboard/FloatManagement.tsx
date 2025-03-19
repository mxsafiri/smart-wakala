import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiSettings, FiAlertCircle, FiPlus, FiDollarSign, FiTrendingUp, FiCreditCard } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { processTopUp, requestOverdraft } from '../../store/slices/overdraftSlice';
import { useNavigate } from 'react-router-dom';

interface FloatManagementProps {
  repaymentPercentage: number;
  isProcessing: boolean;
  availableOverdraft: number;
  onTopUp: (amount: number) => Promise<void>;
  onRequestOverdraft: (amount: number, reason: string) => Promise<void>;
}

const FloatManagement: React.FC<FloatManagementProps> = ({
  repaymentPercentage,
  isProcessing,
  availableOverdraft,
  onTopUp,
  onRequestOverdraft
}) => {
  const [activeTab, setActiveTab] = useState<'topup' | 'overdraft'>('topup');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [overdraftAmount, setOverdraftAmount] = useState('');
  const [overdraftReason, setOverdraftReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const navigate = useNavigate();
  
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

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || isProcessing) return;
    
    const amount = Number(topUpAmount);
    const autoDeductionAmount = Math.round(amount * (repaymentPercentage / 100));
    
    setConfirmationMessage(
      `You are about to top up ${formatCurrency(amount)}. ${repaymentPercentage}% (${formatCurrency(autoDeductionAmount)}) will be automatically deducted for overdraft repayment.`
    );
    setShowConfirmation(true);
  };

  const handleOverdraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overdraftAmount || !overdraftReason || isProcessing) return;
    
    const amount = Number(overdraftAmount);
    
    setConfirmationMessage(
      `You are requesting an overdraft of ${formatCurrency(amount)} for: ${overdraftReason}`
    );
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      if (activeTab === 'topup') {
        await onTopUp(Number(topUpAmount));
        setTopUpAmount('');
      } else if (activeTab === 'overdraft') {
        await onRequestOverdraft(Number(overdraftAmount), overdraftReason);
        setOverdraftAmount('');
        setOverdraftReason('');
      }
      setShowConfirmation(false);
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleQuickTopUp = () => {
    navigate('/float-top-up');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Float Management</h3>
          <div className="p-2 bg-indigo-100 rounded-full">
            <IconComponent Icon={FiSettings} className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        
        {/* Value Proposition */}
        <div className="mb-6 bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg border border-primary-100">
          <div className="flex items-start">
            <div className="p-2 bg-primary-100 rounded-full mr-3 mt-1">
              <IconComponent Icon={FiTrendingUp} className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="text-md font-medium text-primary-800 mb-1">Need Higher Credit Limits?</h4>
              <p className="text-sm text-gray-600">
                Add collateral to increase your credit limits. Higher collateral means better overdraft terms and lower auto-deduction rates.
              </p>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'topup'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('topup')}
          >
            <div className="flex items-center justify-center">
              <IconComponent Icon={FiArrowDown} className="mr-2" />
              Top Up
            </div>
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'overdraft'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overdraft')}
          >
            <div className="flex items-center justify-center">
              <IconComponent Icon={FiCreditCard} className="mr-2" />
              Request Overdraft
            </div>
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'topup' ? (
            <form onSubmit={handleTopUpSubmit}>
              <div className="mb-4">
                <label htmlFor="topUpAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (TZS)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">TZS</span>
                  </div>
                  <input
                    type="number"
                    id="topUpAmount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="block w-full pl-12 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                    min="1000"
                    step="1000"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {topUpAmount && !isNaN(Number(topUpAmount)) && Number(topUpAmount) > 0 ? (
                    <span>
                      Auto-deduction: {formatCurrency(Math.round(Number(topUpAmount) * (repaymentPercentage / 100)))} ({repaymentPercentage}%)
                    </span>
                  ) : (
                    <span>Minimum amount: TZS 1,000</span>
                  )}
                </p>
              </div>
              
              <button
                type="submit"
                disabled={!topUpAmount || isNaN(Number(topUpAmount)) || Number(topUpAmount) <= 0 || isProcessing}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${
                  !topUpAmount || isNaN(Number(topUpAmount)) || Number(topUpAmount) <= 0 || isProcessing
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Top Up Float'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOverdraftSubmit}>
              <div className="mb-4">
                <label htmlFor="overdraftAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (TZS)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">TZS</span>
                  </div>
                  <input
                    type="number"
                    id="overdraftAmount"
                    value={overdraftAmount}
                    onChange={(e) => setOverdraftAmount(e.target.value)}
                    className="block w-full pl-12 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                    min="1000"
                    max={availableOverdraft}
                    step="1000"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Available overdraft: {formatCurrency(availableOverdraft)}
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="overdraftReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  id="overdraftReason"
                  value={overdraftReason}
                  onChange={(e) => setOverdraftReason(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="High customer demand">High customer demand</option>
                  <option value="Upcoming holiday/weekend">Upcoming holiday/weekend</option>
                  <option value="Special promotion">Special promotion</option>
                  <option value="Emergency situation">Emergency situation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={
                  !overdraftAmount || 
                  isNaN(Number(overdraftAmount)) || 
                  Number(overdraftAmount) <= 0 || 
                  Number(overdraftAmount) > availableOverdraft || 
                  !overdraftReason || 
                  isProcessing
                }
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 ${
                  !overdraftAmount || 
                  isNaN(Number(overdraftAmount)) || 
                  Number(overdraftAmount) <= 0 || 
                  Number(overdraftAmount) > availableOverdraft || 
                  !overdraftReason || 
                  isProcessing
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Request Overdraft'}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Action</h3>
            <p className="text-sm text-gray-500 mb-6">{confirmationMessage}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Container component to connect to Redux
const FloatManagementContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    repaymentPercentage,
    isProcessing,
    availableOverdraft
  } = useSelector((state: RootState) => state.overdraft);
  
  const handleTopUp = async (amount: number) => {
    try {
      await dispatch(processTopUp({ amount }) as any);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  const handleRequestOverdraft = async (amount: number, reason: string) => {
    try {
      await dispatch(requestOverdraft({ amount, reason }) as any);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  return (
    <FloatManagement
      repaymentPercentage={repaymentPercentage}
      isProcessing={isProcessing}
      availableOverdraft={availableOverdraft}
      onTopUp={handleTopUp}
      onRequestOverdraft={handleRequestOverdraft}
    />
  );
};

export default FloatManagementContainer;
