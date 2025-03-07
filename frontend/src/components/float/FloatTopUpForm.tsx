import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { topUpFloat } from '../../store/slices/floatSlice';
import { RootState } from '../../store';
import Card from '../common/Card';
import Input from '../ui/Input';
import Button from '../common/Button';
import { FiAlertCircle, FiCheckCircle, FiDollarSign, FiCreditCard, FiSmartphone, FiClock } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { motion, AnimatePresence } from 'framer-motion';

const FloatTopUpForm: React.FC = () => {
  const dispatch = useDispatch();
  const { isProcessing } = useSelector((state: RootState) => state.float);
  const { overdraftBalance, repaymentPercentage } = useSelector((state: RootState) => state.overdraft);
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState<number[]>([50000, 100000, 200000]);
  
  // Calculate repayment amount (based on repaymentPercentage)
  const repaymentAmount = amount ? parseFloat(amount) * (repaymentPercentage / 100) : 0;
  
  // Calculate final amount after repayment deduction
  const finalAmount = amount ? parseFloat(amount) - repaymentAmount : 0;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount))) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (parseFloat(amount) < 1000) {
      newErrors.amount = 'Amount must be at least TZS 1,000';
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await dispatch(topUpFloat({
        amount: parseFloat(amount),
        paymentMethod,
        repaymentAmount,
      }) as any);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after successful submission
      setAmount('');
      setPaymentMethod('mobile_money');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error: any) {
      setErrors({
        form: error.message || 'Failed to process float top-up. Please try again.',
      });
    }
  };
  
  const handleQuickAmountSelect = (amount: number) => {
    setAmount(amount.toString());
    // Clear any amount-related errors
    if (errors.amount) {
      const { amount, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };
  
  return (
    <>
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 text-green-700 p-4 rounded-md mb-4 flex items-start shadow-sm border border-green-100"
          >
            <IconComponent Icon={FiCheckCircle} className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Top-up successful!</p>
              <p className="text-sm">Your float balance has been updated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {errors.form && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-4 rounded-md mb-4 flex items-start shadow-sm border border-red-100"
        >
          <IconComponent Icon={FiAlertCircle} className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p>{errors.form}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <Input
            id="amount"
            name="amount"
            type="number"
            label="Amount (TZS)"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
            prefix="TZS"
            className="text-lg"
          />
          
          {/* Quick amount selection */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2">Quick select amount:</p>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => handleQuickAmountSelect(quickAmount)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    amount === quickAmount.toString()
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {formatCurrency(quickAmount)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickAmountSelect(500000)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  amount === '500000'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {formatCurrency(500000)}
              </button>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-gray-500">Minimum amount: TZS 1,000</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                paymentMethod === 'mobile_money'
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('mobile_money')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-full p-2">
                    <IconComponent Icon={FiSmartphone} className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Mobile Money
                  </span>
                </div>
                {paymentMethod === 'mobile_money' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            <div
              className={`border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                paymentMethod === 'bank_transfer'
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('bank_transfer')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-full p-2">
                    <IconComponent Icon={FiCreditCard} className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Bank Transfer
                  </span>
                </div>
                {paymentMethod === 'bank_transfer' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            <div
              className={`border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                paymentMethod === 'cash'
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-full p-2">
                    <IconComponent Icon={FiDollarSign} className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Cash
                  </span>
                </div>
                {paymentMethod === 'cash' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>
          )}
        </div>
        
        <AnimatePresence>
          {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <IconComponent Icon={FiClock} className="mr-2 text-gray-500" />
                  Transaction Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top-up Amount:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(parseFloat(amount))}
                    </span>
                  </div>
                  
                  {overdraftBalance > 0 && repaymentPercentage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Repayment Deduction ({repaymentPercentage}%):</span>
                      <span className="text-sm font-medium text-red-600">
                        - {formatCurrency(repaymentAmount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Final Amount:</span>
                    <span className="text-base font-semibold text-green-600">
                      {formatCurrency(finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isProcessing || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          className="flex items-center justify-center py-3 text-base"
        >
          <IconComponent Icon={FiDollarSign} className="mr-2" />
          {isProcessing ? 'Processing...' : 'Complete Top-Up'}
        </Button>
      </form>
    </>
  );
};

export default FloatTopUpForm;
