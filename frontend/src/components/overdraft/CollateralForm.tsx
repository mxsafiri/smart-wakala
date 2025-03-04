import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCollateral } from '../../store/slices/overdraftSlice';
import { RootState } from '../../store';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const CollateralForm: React.FC = () => {
  const dispatch = useDispatch();
  const { collateralAmount, isProcessing } = useSelector((state: RootState) => state.overdraft);
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount))) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
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
      await dispatch(updateCollateral({
        amount: parseFloat(amount),
        paymentMethod,
      }) as any);
      
      // Reset form after successful submission
      setAmount('');
      setPaymentMethod('mobile_money');
    } catch (error: any) {
      setErrors({
        form: error.message || 'Failed to update collateral. Please try again.',
      });
    }
  };
  
  return (
    <Card title="Update Collateral">
      <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">About Collateral</h4>
        <p className="text-sm text-blue-700">
          Increasing your collateral amount will raise your overdraft limit. The current collateral amount is <strong>TZS {collateralAmount.toLocaleString()}</strong>.
        </p>
      </div>
      
      {errors.form && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div
              className={`border rounded-md p-3 cursor-pointer ${
                paymentMethod === 'mobile_money'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setPaymentMethod('mobile_money')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
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
              className={`border rounded-md p-3 cursor-pointer ${
                paymentMethod === 'bank_transfer'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setPaymentMethod('bank_transfer')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
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
              className={`border rounded-md p-3 cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
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
        
        {amount && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Collateral:</span>
                <span className="text-sm font-medium text-gray-700">
                  TZS {collateralAmount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Additional Collateral:</span>
                <span className="text-sm font-medium text-green-600">
                  + TZS {parseFloat(amount).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">New Total Collateral:</span>
                <span className="text-sm font-medium text-green-600">
                  TZS {(collateralAmount + parseFloat(amount)).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Estimated New Overdraft Limit:</span>
                <span className="text-sm font-medium text-blue-600">
                  TZS {(collateralAmount + parseFloat(amount) * 2).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Update Collateral'}
        </Button>
      </form>
    </Card>
  );
};

export default CollateralForm;
