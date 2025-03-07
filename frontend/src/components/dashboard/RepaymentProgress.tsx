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
    if (daysUntilDue <= 2) return 'text-red-600';
    if (daysUntilDue <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Get progress bar color based on payment status and progress
  const getProgressBarColor = () => {
    if (daysUntilDue <= 0) return 'bg-red-600'; // Overdue
    if (daysUntilDue <= 3) return 'bg-yellow-500'; // Due soon
    if (progressPercentage >= 75) return 'bg-green-600'; // Good progress
    if (progressPercentage >= 50) return 'bg-green-500'; // Decent progress
    if (progressPercentage >= 25) return 'bg-yellow-500'; // Some progress
    return 'bg-red-500'; // Little progress
  };
  
  // Get payment status text and color
  const getPaymentStatus = () => {
    if (daysUntilDue < 0) {
      return {
        text: 'OVERDUE',
        color: 'text-white bg-red-600 px-2 py-1 rounded-md text-xs font-bold',
        icon: FiAlertCircle
      };
    }
    if (daysUntilDue <= 2) {
      return {
        text: 'DUE SOON',
        color: 'text-white bg-yellow-600 px-2 py-1 rounded-md text-xs font-bold',
        icon: FiClock
      };
    }
    return {
      text: 'ON TRACK',
      color: 'text-white bg-green-600 px-2 py-1 rounded-md text-xs font-bold',
      icon: FiCheckCircle
    };
  };
  
  const paymentStatus = getPaymentStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Repayment Progress</h3>
        <div className="p-2 bg-blue-100 rounded-full">
          <IconComponent Icon={FiClock} className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">{progressPercentage}%</span>
              <span className={paymentStatus.color}>
                <div className="flex items-center space-x-1">
                  <IconComponent Icon={paymentStatus.icon} className="h-3 w-3" />
                  <span>{paymentStatus.text}</span>
                </div>
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${getProgressBarColor()} h-2.5 rounded-full`} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <IconComponent Icon={FiInfo} className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs font-medium text-gray-500">Total Debt</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">{formatCurrency(totalDebt)}</span>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <IconComponent Icon={FiInfo} className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs font-medium text-gray-500">Total Repaid</span>
            </div>
            <span className="text-lg font-semibold text-green-600">{formatCurrency(totalRepaid)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center mb-2">
            <IconComponent Icon={FiCalendar} className={`h-4 w-4 mr-2 ${getStatusColor()}`} />
            <span className="text-sm font-medium text-gray-700">Next Payment Due</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {formatDate(nextPaymentDue)}
              {daysUntilDue <= 0 ? 
                <span className="ml-2 text-red-600 font-bold">(Overdue)</span> : 
                daysUntilDue <= 3 ? 
                  <span className="ml-2 text-yellow-600 font-bold">({daysUntilDue} days left)</span> : 
                  <span className="ml-2 text-gray-500">({daysUntilDue} days left)</span>
              }
            </span>
            <span className="text-lg font-semibold text-gray-800 mt-1 sm:mt-0">{formatCurrency(nextPaymentAmount)}</span>
          </div>
          
          <button 
            className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          >
            <IconComponent Icon={FiClock} className="mr-2" />
            Make Payment Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Container component to connect to Redux
const RepaymentProgressContainer: React.FC = () => {
  const { 
    overdraftBalance: totalDebt,
    totalRepaid,
    nextPaymentDue,
    nextPaymentAmount,
    repaymentPercentage,
    repaymentDueDate
  } = useSelector((state: RootState) => state.overdraft);
  
  // Calculate days until due
  const calculateDaysUntilDue = () => {
    const dueDate = new Date(repaymentDueDate);
    const today = new Date();
    
    // Reset time portion for accurate day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <RepaymentProgress
      totalDebt={totalDebt}
      totalRepaid={totalRepaid}
      nextPaymentDue={nextPaymentDue}
      nextPaymentAmount={nextPaymentAmount}
      repaymentPercentage={repaymentPercentage}
      daysUntilDue={calculateDaysUntilDue()}
    />
  );
};

export default RepaymentProgressContainer;
