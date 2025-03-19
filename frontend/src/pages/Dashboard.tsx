import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { motion } from 'framer-motion';
import FloatSummary from '../components/dashboard/FloatSummary';
import RepaymentProgress from '../components/dashboard/RepaymentProgress';
import CollateralSummary from '../components/dashboard/CollateralSummary';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import PerformanceSettings from '../components/dashboard/PerformanceSettings';
import CreditScoreFactors from '../components/dashboard/CreditScoreFactors';
import NetworkStatus from '../components/ui/NetworkStatus';
import Badge from '../components/ui/Badge';
import { FiDollarSign, FiCreditCard, FiShield, FiArrowUp, FiArrowDown, FiCheckCircle, FiActivity, FiAlertCircle, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { IconComponent } from '../utils/iconUtils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isOffline } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  
  // Cast t to our custom type to avoid TypeScript errors
  const translate = t as { 
    (key: string): string;
    (key: string, options: Record<string, any>): string;
  };
  
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
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for the dashboard
  const [dashboardData, setDashboardData] = useState({
    floatBalance: 2500000,
    totalTransactions: 1567,
    weeklyFloatData: [1800000, 2200000, 1950000, 2100000, 2300000, 2450000, 2500000]
  });
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Animation variants for staggered children
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

  // Handler for navigating to float management page
  const handleFloatManagementClick = () => {
    navigate('/float');
  };
  
  // Handler for navigating to float top-up page
  const handleFloatTopUpClick = () => {
    navigate('/float-top-up');
  };

  const handleUpdatePerformance = async (score: number) => {
    // TODO: Implement performance update logic
    console.log('Updating performance score:', score);
  };

  const handleUpdateRepaymentPercentage = async (percentage: number) => {
    // TODO: Implement repayment percentage update logic
    console.log('Updating repayment percentage:', percentage);
  };

  return (
    <>
      {/* Network status indicator */}
      <NetworkStatus position="floating" showAlways={false} />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 px-2 sm:px-0"
        >
          {isOffline && (
            <motion.div variants={itemVariants} className="mb-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <IconComponent Icon={FiAlertCircle} className="text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {translate('common.offline')}. {translate('dashboard.offlineModeLimited')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notification Center - Moved to the very top for highest visibility */}
          <motion.div variants={itemVariants}>
            <NotificationCenter />
          </motion.div>

          {/* Value Proposition Banner */}
          <motion.div variants={itemVariants} className="mb-2">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg border border-primary-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="p-3 bg-primary-100 rounded-full mr-4">
                    <IconComponent Icon={FiTrendingUp} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-primary-800">{translate('dashboard.welcomeToSmartWakala')}</h2>
                    <p className="text-sm text-gray-600">{translate('dashboard.neverRunOutOfFloat')}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button 
                    onClick={handleFloatTopUpClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    <IconComponent Icon={FiPlus} className="mr-2" />
                    {translate('dashboard.topUpFloat')}
                  </button>
                  <button 
                    onClick={handleFloatManagementClick}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    <IconComponent Icon={FiDollarSign} className="mr-2" />
                    {translate('dashboard.manageFloat')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Settings */}
          <motion.div variants={itemVariants}>
            <PerformanceSettings 
              performanceScore={performanceScore || 0}
              repaymentPercentage={repaymentPercentage || 10}
              isProcessing={false}
              displayName={user?.displayName}
              onUpdatePerformance={handleUpdatePerformance}
              onUpdateRepaymentPercentage={handleUpdateRepaymentPercentage}
              isOnline={!isOffline}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left column - 8/12 width on large screens */}
            <motion.div variants={itemVariants} className="lg:col-span-8 space-y-4 md:space-y-6">
              {/* Collateral Summary - Moved to top of left column */}
              <CollateralSummary />
              
              {/* Credit Score Factors */}
              <CreditScoreFactors />
              
              {/* Repayment Progress */}
              <RepaymentProgress />
            </motion.div>
            
            {/* Right column - 4/12 width on large screens */}
            <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4 md:space-y-6">
              {/* Float Summary */}
              <FloatSummary
                floatBalance={dashboardData.floatBalance}
                weeklyData={dashboardData.weeklyFloatData}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Dashboard;
