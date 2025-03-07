import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FloatTransaction } from '../../store/slices/floatSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiDownload, FiCalendar, FiArrowUp, FiArrowDown, FiClock, FiRefreshCw, FiDollarSign, FiSearch } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

const FloatHistory: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.float);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter transactions based on selected filter and search term
  const filteredTransactions = transactions.filter((transaction: FloatTransaction) => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Limit displayed transactions
  const displayedTransactions = sortedTransactions.slice(0, displayCount);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Function to get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-600"></span>
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <IconComponent Icon={FiClock} className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 mr-1 rounded-full bg-red-600"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  // Function to get transaction type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'top-up':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <IconComponent Icon={FiArrowUp} className="w-3 h-3 mr-1" />
            Top-up
          </span>
        );
      case 'withdrawal':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <IconComponent Icon={FiArrowDown} className="w-3 h-3 mr-1" />
            Withdrawal
          </span>
        );
      case 'repayment':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <IconComponent Icon={FiRefreshCw} className="w-3 h-3 mr-1" />
            Repayment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {type}
          </span>
        );
    }
  };
  
  // Animation variants
  const listVariants = {
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
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Simulate loading more transactions
  const loadMoreTransactions = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setDisplayCount(prevCount => prevCount + 5);
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <IconComponent Icon={FiFilter} className="h-4 w-4 mr-1.5" />
            Filter
            {filter !== 'all' && (
              <span className="ml-1 bg-primary-100 text-primary-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                1
              </span>
            )}
          </button>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconComponent Icon={FiSearch} className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
            />
          </div>
        </div>
        
        <button
          className="flex items-center justify-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <IconComponent Icon={FiDownload} className="h-4 w-4 mr-1.5" />
          Export
        </button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All Transactions
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'top-up'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => setFilter('top-up')}
              >
                <IconComponent Icon={FiArrowUp} className="inline-block w-3 h-3 mr-1" />
                Top-ups
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'withdrawal'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => setFilter('withdrawal')}
              >
                <IconComponent Icon={FiArrowDown} className="inline-block w-3 h-3 mr-1" />
                Withdrawals
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'repayment'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => setFilter('repayment')}
              >
                <IconComponent Icon={FiRefreshCw} className="inline-block w-3 h-3 mr-1" />
                Repayments
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredTransactions.length > 0 ? (
        <>
          {/* Desktop view */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
            <motion.table 
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedTransactions.map((transaction: FloatTransaction) => (
                  <motion.tr key={transaction.id} variants={itemVariants}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <IconComponent Icon={FiCalendar} className="mr-1.5 h-4 w-4 text-gray-400" />
                        {formatDate(transaction.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(transaction.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={
                        transaction.type === 'top-up'
                          ? 'text-green-600'
                          : transaction.type === 'withdrawal' || transaction.type === 'repayment'
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }>
                        {transaction.type === 'top-up' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
          
          {/* Mobile view */}
          <div className="md:hidden">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {displayedTransactions.map((transaction: FloatTransaction) => (
                <motion.div 
                  key={transaction.id} 
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <IconComponent Icon={FiCalendar} className="mr-1 h-3 w-3" />
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                    <div className={`flex items-center ${
                      transaction.type === 'top-up'
                        ? 'text-green-600'
                        : transaction.type === 'withdrawal' || transaction.type === 'repayment'
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}>
                      <IconComponent 
                        Icon={transaction.type === 'top-up' ? FiArrowUp : FiArrowDown} 
                        className="mr-1 h-4 w-4" 
                      />
                      <div className="text-sm font-semibold">
                        {transaction.type === 'top-up' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                      {getTypeBadge(transaction.type)}
                    </div>
                    <div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* View more button */}
          {filteredTransactions.length > displayCount && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMoreTransactions}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    View More ({filteredTransactions.length - displayCount} remaining)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
            <IconComponent Icon={FiDollarSign} className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' && !searchTerm
              ? 'You have no float transactions yet.'
              : searchTerm
              ? `No results found for "${searchTerm}"`
              : `You have no ${filter} transactions.`}
          </p>
          <div className="mt-4">
            {(filter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FloatHistory;
