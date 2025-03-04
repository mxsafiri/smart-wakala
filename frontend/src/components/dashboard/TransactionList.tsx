import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../common/Card';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const TransactionList: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.float);
  
  // Function to get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top-up':
        return (
          <div className="p-2 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="p-2 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'repayment':
        return (
          <div className="p-2 rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  // Function to get transaction amount color based on type
  const getAmountColor = (type: string) => {
    switch (type) {
      case 'top-up':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      case 'repayment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Function to get transaction amount prefix based on type
  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'top-up':
        return '+';
      case 'withdrawal':
        return '-';
      case 'repayment':
        return '-';
      default:
        return '';
    }
  };
  
  return (
    <Card 
      title="Recent Transactions"
      footer={
        <div className="flex justify-end">
          <Link to="/transactions">
            <Button variant="outline" size="sm">
              View All Transactions
            </Button>
          </Link>
        </div>
      }
    >
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center">
              <div className="flex items-center">
                {getTransactionIcon(transaction.type)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getAmountColor(transaction.type)}`}>
                {getAmountPrefix(transaction.type)} TZS {transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your recent transactions will appear here.
          </p>
        </div>
      )}
    </Card>
  );
};

export default TransactionList;
