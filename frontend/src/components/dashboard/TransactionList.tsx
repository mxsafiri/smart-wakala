import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FloatTransaction } from '../../store/slices/floatSlice';
import { FiPlus, FiMinus, FiRefreshCw, FiClock } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

// Interface for a transaction
interface TransactionType {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  customer: string;
  description?: string;
}

// Props for the TransactionList component
interface TransactionListComponentProps {
  transactions: TransactionType[];
  getStatusBadge?: (status: string) => React.ReactNode;
  getTransactionIcon?: (type: string) => React.ReactNode;
  formatCurrency?: (amount: number) => string;
  maxItems?: number;
}

const TransactionList: React.FC<TransactionListComponentProps> = ({
  transactions,
  getStatusBadge,
  getTransactionIcon,
  formatCurrency = (amount) => 
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount),
  maxItems = 5
}) => {
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer':
        return 'Transfer';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Default status badge if not provided
  const defaultStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
    };
    
    const statusClass = statusClasses[status.toLowerCase() as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Default transaction icon if not provided
  const defaultTransactionIcon = (type: string) => {
    const iconTypes = {
      deposit: FiPlus,
      withdrawal: FiMinus,
      transfer: FiRefreshCw,
      pending: FiClock
    };
    
    const IconToUse = iconTypes[type.toLowerCase() as keyof typeof iconTypes] || FiRefreshCw;
    
    const bgColors = {
      deposit: 'bg-green-100 text-green-600',
      withdrawal: 'bg-red-100 text-red-600',
      transfer: 'bg-blue-100 text-blue-600',
      pending: 'bg-yellow-100 text-yellow-600'
    };
    
    const bgColor = bgColors[type.toLowerCase() as keyof typeof bgColors] || 'bg-gray-100 text-gray-600';
    
    return (
      <div className={`p-2 rounded-full ${bgColor}`}>
        <IconComponent Icon={IconToUse} />
      </div>
    );
  };
  
  // Limit the number of transactions to display
  const displayTransactions = transactions.slice(0, maxItems);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      
      {displayTransactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No transactions found
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-gray-200"
        >
          {displayTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              variants={itemVariants}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  {getTransactionIcon 
                    ? getTransactionIcon(transaction.type)
                    : defaultTransactionIcon(transaction.type)
                  }
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {getTransactionTypeLabel(transaction.type)}
                    </h4>
                    <div className="ml-2">
                      {getStatusBadge 
                        ? getStatusBadge(transaction.status)
                        : defaultStatusBadge(transaction.status)
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 truncate">
                        {transaction.customer}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    
                    <div className="text-sm font-semibold">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {transactions.length > maxItems && (
        <div className="p-4 border-t border-gray-200">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all transactions
          </button>
        </div>
      )}
    </div>
  );
};

// Adapter function to convert FloatTransaction to Transaction
export const adaptFloatTransaction = (floatTransaction: FloatTransaction): TransactionType => {
  return {
    id: floatTransaction.id,
    type: floatTransaction.type,
    amount: floatTransaction.amount,
    date: floatTransaction.date,
    status: floatTransaction.status,
    customer: floatTransaction.provider || 'Unknown',
    description: floatTransaction.description
  };
};

const DefaultTransactionList = () => {
  const { transactions } = useSelector((state: RootState) => state.float);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Function to get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };
  
  // Function to get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
      case 'top-up':
        return (
          <div className="p-2 rounded-full bg-green-100">
            <IconComponent Icon={FiPlus} className="h-4 w-4 text-green-600" />
          </div>
        );
      case 'withdrawal':
        return (
          <div className="p-2 rounded-full bg-red-100">
            <IconComponent Icon={FiMinus} className="h-4 w-4 text-red-600" />
          </div>
        );
      case 'transfer':
        return (
          <div className="p-2 rounded-full bg-blue-100">
            <IconComponent Icon={FiRefreshCw} className="h-4 w-4 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100">
            <IconComponent Icon={FiRefreshCw} className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };
  
  // Convert FloatTransaction to Transaction
  const adaptedTransactions = transactions.map(adaptFloatTransaction);
  
  return (
    <TransactionList
      transactions={adaptedTransactions}
      getStatusBadge={getStatusBadge}
      getTransactionIcon={getTransactionIcon}
      formatCurrency={formatCurrency}
    />
  );
};

// Export the component
export { TransactionList };

// Export the types with new names to avoid conflicts
export type { TransactionType as Transaction, TransactionListComponentProps as TransactionListProps };

// Default export is the container component
export default DefaultTransactionList;
