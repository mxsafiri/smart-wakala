import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiSettings, FiAlertCircle } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { processTopUp, requestOverdraft } from '../../store/slices/overdraftSlice';

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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
      } else {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Float Management</h3>
          <div className="p-2 bg-indigo-100 rounded-full">
            <IconComponent Icon={FiSettings} className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'topup'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('topup')}
          >
            Top Up Float
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'overdraft'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overdraft')}
          >
            Request Overdraft
          </button>
        </div>
        
        {activeTab === 'topup' ? (
          <form onSubmit={handleTopUpSubmit} className="space-y-4">
            <div>
              <label htmlFor="topUpAmount" className="block text-sm font-medium text-gray-700">
                Top Up Amount (TZS)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">TZS</span>
                </div>
                <input
                  type="number"
                  id="topUpAmount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            {topUpAmount && Number(topUpAmount) > 0 && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <IconComponent Icon={FiAlertCircle} className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      {repaymentPercentage}% (
                      {formatCurrency(Math.round(Number(topUpAmount) * (repaymentPercentage / 100)))}
                      ) will be automatically deducted for overdraft repayment.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isProcessing || !topUpAmount}
              className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isProcessing || !topUpAmount
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              <IconComponent Icon={FiArrowUp} className="h-4 w-4 mr-2" />
              Top Up Float
            </button>
          </form>
        ) : (
          <form onSubmit={handleOverdraftSubmit} className="space-y-4">
            <div>
              <label htmlFor="overdraftAmount" className="block text-sm font-medium text-gray-700">
                Overdraft Amount (TZS)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">TZS</span>
                </div>
                <input
                  type="number"
                  id="overdraftAmount"
                  value={overdraftAmount}
                  onChange={(e) => setOverdraftAmount(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="0"
                  max={availableOverdraft}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Available: {formatCurrency(availableOverdraft)}
              </p>
            </div>
            
            <div>
              <label htmlFor="overdraftReason" className="block text-sm font-medium text-gray-700">
                Reason for Overdraft
              </label>
              <textarea
                id="overdraftReason"
                value={overdraftReason}
                onChange={(e) => setOverdraftReason(e.target.value)}
                rows={2}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Briefly explain why you need this overdraft"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isProcessing || !overdraftAmount || !overdraftReason || Number(overdraftAmount) > availableOverdraft}
              className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isProcessing || !overdraftAmount || !overdraftReason || Number(overdraftAmount) > availableOverdraft
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              <IconComponent Icon={FiArrowDown} className="h-4 w-4 mr-2" />
              Request Overdraft
            </button>
          </form>
        )}
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCancel}></div>
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Action</h3>
            <p className="text-sm text-gray-500 mb-6">{confirmationMessage}</p>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FloatManagementContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    repaymentPercentage, 
    isProcessing,
    availableOverdraft
  } = useSelector((state: RootState) => state.overdraft);
  
  const handleTopUp = async (amount: number) => {
    await dispatch(processTopUp({ amount }));
  };
  
  const handleRequestOverdraft = async (amount: number, reason: string) => {
    await dispatch(requestOverdraft({ amount, reason }));
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
