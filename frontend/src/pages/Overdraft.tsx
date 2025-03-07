import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import OverdraftSummary from '../components/dashboard/OverdraftSummary';
import RepaymentProgress from '../components/dashboard/RepaymentProgress';
import CreditScoreFactors from '../components/dashboard/CreditScoreFactors';
import NetworkStatus from '../components/ui/NetworkStatus';

const Overdraft: React.FC = () => {
  const { 
    overdraftBalance, 
    overdraftLimit, 
    availableOverdraft,
    totalRepaid,
    collateralAmount,
    repaymentPercentage,
    overdraftTransactions,
    performanceScore,
    creditScoreFactors
  } = useSelector((state: RootState) => state.overdraft);
  
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
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <>
      <NetworkStatus position="floating" showAlways={false} />
      
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Overdraft Management</h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Overdraft Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Available Overdraft</p>
                  <p className="text-xl font-semibold text-primary-600">{formatCurrency(availableOverdraft)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Overdraft Limit</p>
                  <p className="text-xl font-semibold text-gray-800">{formatCurrency(overdraftLimit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(overdraftBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Repaid</p>
                  <p className="text-xl font-semibold text-green-600">{formatCurrency(totalRepaid)}</p>
                </div>
              </div>
            </div>
            
            <OverdraftSummary />
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RepaymentProgress />
            <CreditScoreFactors />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Overdraft History</h2>
              
              {overdraftTransactions && overdraftTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {overdraftTransactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(transaction.amount)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No overdraft transactions to display</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Overdraft;
