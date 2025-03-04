import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../common/Card';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const FloatSummary: React.FC = () => {
  const { currentFloat, floatTarget, recentTransactions } = useSelector(
    (state: RootState) => state.float
  );
  
  // Calculate percentage of float target achieved
  const floatPercentage = floatTarget > 0
    ? Math.min(100, Math.round((currentFloat / floatTarget) * 100))
    : 0;
  
  // Determine status color based on percentage
  const getStatusColor = (percentage: number) => {
    if (percentage < 30) return 'text-red-600';
    if (percentage < 70) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  return (
    <Card 
      title="Float Summary"
      footer={
        <div className="flex justify-end">
          <Link to="/float">
            <Button variant="outline" size="sm">
              Manage Float
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Current Float</span>
            <span className={`text-sm font-medium ${getStatusColor(floatPercentage)}`}>
              TZS {currentFloat.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                floatPercentage < 30 ? 'bg-red-500' : 
                floatPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${floatPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {floatPercentage}% of target
            </span>
            <span className="text-xs text-gray-500">
              Target: TZS {floatTarget.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Float Transactions</h4>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'top-up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          transaction.type === 'top-up' ? 'text-green-600' : 'text-red-600'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        {transaction.type === 'top-up' ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    transaction.type === 'top-up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'top-up' ? '+' : '-'} TZS {transaction.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent transactions</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FloatSummary;
