import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { TransactionList, Transaction } from '../components/dashboard/TransactionList';
import NetworkStatus from '../components/ui/NetworkStatus';
import Badge from '../components/ui/Badge';
import { FiDollarSign, FiCreditCard, FiShield, FiArrowUp, FiArrowDown, FiCheckCircle, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { IconComponent } from '../utils/iconUtils';

const Transactions: React.FC = () => {
  const { isOffline } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Mock transactions data
      const mockTransactions: Transaction[] = [
        {
          id: 'tx1',
          type: 'deposit',
          amount: 250000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          customer: 'John Doe',
          description: 'Cash deposit'
        },
        {
          id: 'tx2',
          type: 'withdrawal',
          amount: 100000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          customer: 'Sarah Johnson',
          description: 'Cash withdrawal'
        },
        {
          id: 'tx3',
          type: 'overdraft',
          amount: 75000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          customer: 'Agent Account',
          description: 'Float liquidity overdraft'
        },
        {
          id: 'tx4',
          type: 'auto_deduction',
          amount: 50000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          customer: 'System',
          description: 'Auto-deduction from top-up'
        },
        {
          id: 'tx5',
          type: 'collateral',
          amount: 300000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
          customer: 'Agent Account',
          description: 'Collateral deposit'
        },
        {
          id: 'tx6',
          type: 'deposit',
          amount: 150000,
          status: 'pending',
          date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
          customer: 'Michael Brown',
          description: 'Cash deposit'
        },
        {
          id: 'tx7',
          type: 'withdrawal',
          amount: 80000,
          status: 'failed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          customer: 'Emma Wilson',
          description: 'Cash withdrawal - insufficient funds'
        }
      ];
      
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    if (status === 'completed') {
        return <Badge variant="success" label="Completed" icon={<IconComponent Icon={FiCheckCircle} />} />;
    } else if (status === 'pending') {
        return <Badge variant="warning" label="Pending" icon={<IconComponent Icon={FiActivity} />} />;
    } else {
        return <Badge variant="error" label="Failed" icon={<IconComponent Icon={FiAlertCircle} />} />;
    }
  };
  
  // Helper function to render transaction icon
  const renderTransactionIcon = (type: string) => {
    if (type === 'deposit') {
        return <div className="p-2 bg-green-100 rounded-full"><IconComponent Icon={FiArrowDown} className="text-green-600" /></div>;
    } else if (type === 'withdrawal') {
        return <div className="p-2 bg-red-100 rounded-full"><IconComponent Icon={FiArrowUp} className="text-red-600" /></div>;
    } else if (type === 'overdraft') {
        return <div className="p-2 bg-blue-100 rounded-full"><IconComponent Icon={FiCreditCard} className="text-blue-600" /></div>;
    } else if (type === 'auto_deduction') {
        return <div className="p-2 bg-yellow-100 rounded-full"><IconComponent Icon={FiArrowUp} className="text-yellow-600" /></div>;
    } else if (type === 'collateral') {
        return <div className="p-2 bg-purple-100 rounded-full"><IconComponent Icon={FiShield} className="text-purple-600" /></div>;
    } else {
        return <div className="p-2 bg-gray-100 rounded-full"><IconComponent Icon={FiDollarSign} className="text-gray-600" /></div>;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <>
      <NetworkStatus position="floating" showAlways={false} />
      
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">All Transactions</h2>
                  <p className="text-sm text-gray-500 mt-1">View and manage your transaction history</p>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      All
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                      Deposits
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                      Withdrawals
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                      Overdrafts
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                      Collateral
                    </button>
                  </div>
                  
                  <TransactionList 
                    transactions={transactions}
                    getStatusBadge={renderStatusBadge}
                    getTransactionIcon={renderTransactionIcon}
                    formatCurrency={formatCurrency}
                    maxItems={10}
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Transaction Summary</h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Transactions</p>
                      <p className="text-xl font-semibold text-gray-800">{transactions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Deposits</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(
                          transactions
                            .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
                            .reduce((sum, tx) => sum + tx.amount, 0)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Withdrawals</p>
                      <p className="text-xl font-semibold text-red-600">
                        {formatCurrency(
                          transactions
                            .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
                            .reduce((sum, tx) => sum + tx.amount, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Pending Transactions</h3>
                  {transactions.filter(tx => tx.status === 'pending').length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {transactions
                        .filter(tx => tx.status === 'pending')
                        .map(tx => (
                          <div key={tx.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {renderTransactionIcon(tx.type)}
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{formatCurrency(tx.amount)}</p>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-4">No pending transactions</p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Failed Transactions</h3>
                  {transactions.filter(tx => tx.status === 'failed').length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {transactions
                        .filter(tx => tx.status === 'failed')
                        .map(tx => (
                          <div key={tx.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {renderTransactionIcon(tx.type)}
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{formatCurrency(tx.amount)}</p>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-4">No failed transactions</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Transactions;
