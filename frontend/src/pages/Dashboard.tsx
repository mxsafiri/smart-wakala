import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import { TransactionList, Transaction } from '../components/dashboard/TransactionList';
import FloatSummary from '../components/dashboard/FloatSummary';
import OverdraftSummary from '../components/dashboard/OverdraftSummary';
import RepaymentProgress from '../components/dashboard/RepaymentProgress';
import CollateralSummary from '../components/dashboard/CollateralSummary';
import FloatManagement from '../components/dashboard/FloatManagement';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import PerformanceSettings from '../components/dashboard/PerformanceSettings';
import CreditScoreFactors from '../components/dashboard/CreditScoreFactors';
import NetworkStatus from '../components/ui/NetworkStatus';
import Badge from '../components/ui/Badge';
import { FiDollarSign, FiCreditCard, FiShield, FiArrowUp, FiArrowDown, FiCheckCircle, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { IconComponent } from '../utils/iconUtils';

// Update the Transaction interface to match our needs
interface DashboardTransaction extends Omit<Transaction, 'date' | 'customer'> {
  date: Date;
  customer: {
    name: string;
    phone: string;
  };
}

const Dashboard: React.FC = () => {
  const { user, isOffline } = useSelector((state: RootState) => state.auth);
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
    weeklyFloatData: [1800000, 2200000, 1950000, 2100000, 2300000, 2450000, 2500000],
    recentTransactions: [] as DashboardTransaction[]
  });
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Mock transactions data
      const mockTransactions: DashboardTransaction[] = [
        {
          id: 'tx1',
          type: 'deposit',
          amount: 250000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          customer: {
            name: 'John Doe',
            phone: '+255 765 432 100'
          },
          description: 'Cash deposit'
        },
        {
          id: 'tx2',
          type: 'withdrawal',
          amount: 100000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          customer: {
            name: 'Sarah Johnson',
            phone: '+255 789 123 456'
          },
          description: 'Cash withdrawal'
        },
        {
          id: 'tx3',
          type: 'overdraft',
          amount: 75000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          customer: {
            name: 'Agent Account',
            phone: '+255 744 555 123'
          },
          description: 'Float liquidity overdraft'
        },
        {
          id: 'tx4',
          type: 'auto_deduction',
          amount: 50000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          customer: {
            name: 'System',
            phone: '-'
          },
          description: 'Auto-deduction from top-up'
        },
        {
          id: 'tx5',
          type: 'collateral',
          amount: 300000,
          status: 'completed',
          date: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
          customer: {
            name: 'Agent Account',
            phone: '+255 755 987 321'
          },
          description: 'Collateral deposit'
        }
      ];
      
      setDashboardData(prev => ({
        ...prev,
        recentTransactions: mockTransactions
      }));
      
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
  
  // Convert our DashboardTransaction to the format expected by TransactionList
  const adaptTransactions = (transactions: DashboardTransaction[]): Transaction[] => {
    return transactions.map(tx => ({
      ...tx,
      date: tx.date.toISOString(),
      customer: tx.customer.name
    }));
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
          className="space-y-6"
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
                      You are currently in offline mode. Some features may be limited.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Notification Center */}
          <motion.div variants={itemVariants}>
            <NotificationCenter />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Float Balance"
                value={formatCurrency(dashboardData.floatBalance)}
                change={5.2}
                icon={<IconComponent Icon={FiDollarSign} className="text-primary-600" />}
                className="bg-primary-50"
              />
              
              <StatCard
                title="Available Overdraft"
                value={formatCurrency(availableOverdraft)}
                change={-2.4}
                icon={<IconComponent Icon={FiCreditCard} className="text-purple-600" />}
                className="bg-purple-50"
              />
              
              <StatCard
                title="Collateral Balance"
                value={formatCurrency(collateralAmount)}
                change={12.5}
                icon={<IconComponent Icon={FiShield} className="text-blue-600" />}
                className="bg-blue-50"
              />
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column - 8/12 width on large screens */}
            <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
              {/* First row - Float Management and Overdraft Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatManagement />
                <OverdraftSummary />
              </div>
              
              {/* Credit Score Factors */}
              <CreditScoreFactors />
              
              {/* Transactions */}
              <TransactionList 
                transactions={adaptTransactions(dashboardData.recentTransactions)}
                getStatusBadge={renderStatusBadge}
                getTransactionIcon={renderTransactionIcon}
                formatCurrency={formatCurrency}
              />
            </motion.div>
            
            {/* Right column - 4/12 width on large screens */}
            <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
              {/* Performance Settings */}
              <PerformanceSettings />
              
              <CollateralSummary />
              <RepaymentProgress />
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
