import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../common/Card';

const OverdraftSummary: React.FC = () => {
  const { overdraftBalance, overdraftLimit, repaymentProgress } = useSelector(
    (state: RootState) => state.overdraft
  );
  
  // Calculate percentage of overdraft used
  const overdraftUsedPercentage = overdraftLimit > 0
    ? Math.min(100, Math.round((overdraftBalance / overdraftLimit) * 100))
    : 0;
  
  // Calculate repayment progress percentage
  const repaymentProgressPercentage = Math.round(repaymentProgress * 100);
  
  return (
    <Card title="Overdraft Summary">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overdraft Balance</span>
            <span className="text-sm font-medium text-gray-900">
              TZS {overdraftBalance.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{ width: `${overdraftUsedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {overdraftUsedPercentage}% of limit used
            </span>
            <span className="text-xs text-gray-500">
              Limit: TZS {overdraftLimit.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Repayment Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {repaymentProgressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${repaymentProgressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {repaymentProgressPercentage < 25 ? 'Just started' : 
               repaymentProgressPercentage < 50 ? 'Making progress' :
               repaymentProgressPercentage < 75 ? 'Good progress' : 'Almost there'}
            </span>
            <span className="text-xs text-gray-500">
              Target: 100%
            </span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Repayment Method</h4>
          <div className="flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>10% of each float top-up is deducted for repayment</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OverdraftSummary;
