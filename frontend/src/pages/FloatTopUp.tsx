import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import FloatTopUpForm from '../components/float/FloatTopUpForm';
import FloatHistory from '../components/float/FloatHistory';
import { FiDollarSign, FiClock, FiTrendingUp } from 'react-icons/fi';
import { IconComponent } from '../utils/iconUtils';

const FloatTopUp: React.FC = () => {
  const { balance, currentFloat } = useSelector((state: RootState) => state.float);
  const { repaymentPercentage } = useSelector((state: RootState) => state.overdraft);
  
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Float Top-Up</h1>
        <p className="text-gray-600">Manage your float balance and ensure uninterrupted service</p>
      </motion.div>

      {/* Value Proposition Banner */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg border border-primary-100 shadow-sm">
          <div className="flex items-start">
            <div className="p-3 bg-primary-100 rounded-full mr-4 flex-shrink-0">
              <IconComponent Icon={FiTrendingUp} className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-800 mb-1">Never Run Out of Float</h2>
              <p className="text-sm text-gray-600">
                Top up your float balance to ensure you can always serve your customers. 
                {repaymentPercentage > 0 && ` ${repaymentPercentage}% will be automatically deducted for any outstanding overdraft.`}
              </p>
              <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Float Balance:</span>
                  <span className="text-lg font-semibold text-primary-700">{formatCurrency(currentFloat)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Top Up Your Float</h2>
              <div className="p-2 bg-primary-100 rounded-full">
                <IconComponent Icon={FiDollarSign} className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <FloatTopUpForm />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Float Transaction History</h2>
              <div className="p-2 bg-blue-100 rounded-full">
                <IconComponent Icon={FiClock} className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <FloatHistory />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FloatTopUp;
