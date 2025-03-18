import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCalendar, FiClock, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

interface RepaymentProgressProps {
  totalDebt: number;
  totalRepaid: number;
  nextPaymentDue: string;
  nextPaymentAmount: number;
  repaymentPercentage: number;
  daysUntilDue: number;
}

const RepaymentProgress: React.FC<RepaymentProgressProps> = ({
  totalDebt,
  totalRepaid,
  nextPaymentDue,
  nextPaymentAmount,
  repaymentPercentage,
  daysUntilDue
}) => {
  // Calculate progress percentage
  const progressPercentage = totalDebt > 0
    ? Math.min(100, Math.round((totalRepaid / totalDebt) * 100))
    : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine status color based on days until due
  const getStatusColor = () => {
    if (daysUntilDue <= 2) return 'text-danger-600';
    if (daysUntilDue <= 5) return 'text-warning-600';
    return 'text-success-600';
  };
  
  // Get progress bar color based on payment status and progress
  const getProgressBarColor = () => {
    if (daysUntilDue <= 0) return 'bg-danger-600'; // Overdue
    if (daysUntilDue <= 3) return 'bg-warning-500'; // Due soon
    if (progressPercentage >= 75) return 'bg-success-600'; // Good progress
    if (progressPercentage >= 50) return 'bg-success-500'; // Decent progress
    if (progressPercentage >= 25) return 'bg-warning-500'; // Some progress
    return 'bg-danger-500'; // Little progress
  };
  
  // Get payment status text and color
  const getPaymentStatus = () => {
    if (daysUntilDue < 0) {
      return {
        text: 'OVERDUE',
        color: 'badge badge-danger',
        icon: FiAlertCircle
      };
    }
    if (daysUntilDue <= 2) {
      return {
        text: 'DUE SOON',
        color: 'badge badge-warning',
        icon: FiClock
      };
    }
    return {
      text: 'ON TRACK',
      color: 'badge badge-success',
      icon: FiCheckCircle
    };
  };
  
  const paymentStatus = getPaymentStatus();

  return (
    <motion.div 
      className="card card-hover"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="card-title text-gray-800">Repayment Progress</h3>
        <div className="icon-container bg-primary-100 text-primary-600">
          <IconComponent Icon={FiClock} className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Repayment Progress</span>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getProgressBarColor()}`} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Total Debt</div>
            <div className="text-lg font-semibold font-mono">{formatCurrency(totalDebt)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Total Repaid</div>
            <div className="text-lg font-semibold font-mono">{formatCurrency(totalRepaid)}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Next Payment</div>
              <div className="text-lg font-semibold font-mono">{formatCurrency(nextPaymentAmount)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Due Date</div>
              <div className="flex items-center">
                <IconComponent Icon={FiCalendar} className="h-4 w-4 mr-1 text-gray-400" />
                <span className={`text-sm font-medium ${getStatusColor()}`}>{formatDate(nextPaymentDue)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Auto-Deduction</div>
            <div className="text-lg font-semibold">{repaymentPercentage}%</div>
          </div>
          <div className={paymentStatus.color}>
            <div className="flex items-center">
              <IconComponent Icon={paymentStatus.icon} className="h-3.5 w-3.5 mr-1" />
              <span>{paymentStatus.text}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Container component to connect to Redux
const RepaymentProgressContainer = () => {
  const { 
    currentBalance, 
    totalRepaid, 
    repaymentDueDate, 
    nextPaymentAmount,
    repaymentPercentage
  } = useSelector((state: RootState) => state.overdraft);
  
  // Calculate days until due
  const calculateDaysUntilDue = () => {
    if (!repaymentDueDate) return 30; // Default to 30 days if no due date
    
    const dueDate = new Date(repaymentDueDate);
    const today = new Date();
    
    // Reset time components for accurate day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilDue = calculateDaysUntilDue();
  
  return (
    <RepaymentProgress
      totalDebt={currentBalance}
      totalRepaid={totalRepaid}
      nextPaymentDue={repaymentDueDate || new Date().toISOString()}
      nextPaymentAmount={nextPaymentAmount}
      repaymentPercentage={repaymentPercentage}
      daysUntilDue={daysUntilDue}
    />
  );
};

export default RepaymentProgressContainer;
