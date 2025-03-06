import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCalendar, FiClock } from 'react-icons/fi';
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
            <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Debt</p>
            <p className="text-lg font-semibold">{formatCurrency(totalDebt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Repaid</p>
            <p className="text-lg font-semibold">{formatCurrency(totalRepaid)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent Icon={FiCalendar} className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">Next Payment</h4>
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                {formatDate(nextPaymentDue)}
              </span>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                ({daysUntilDue} days)
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold">
              {formatCurrency(nextPaymentAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <IconComponent Icon={FiAlertCircle} className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Auto-Deduction Active</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                {repaymentPercentage}% of each top-up will be automatically deducted for repayment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RepaymentProgressContainer: React.FC = () => {
  const { 
    currentBalance, 
    totalRepaid, 
    repaymentPercentage 
  } = useSelector((state: RootState) => state.overdraft);
  
  // Mock data for next payment - in a real app, this would come from the backend
  const nextPaymentDue = new Date();
  nextPaymentDue.setDate(nextPaymentDue.getDate() + 7); // Due in 7 days
  
  const nextPaymentAmount = Math.round(currentBalance * 0.1); // 10% of current balance
  const daysUntilDue = Math.round((nextPaymentDue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <RepaymentProgress
      totalDebt={currentBalance + totalRepaid}
      totalRepaid={totalRepaid}
      nextPaymentDue={nextPaymentDue.toISOString()}
      nextPaymentAmount={nextPaymentAmount}
      repaymentPercentage={repaymentPercentage}
      daysUntilDue={daysUntilDue}
    />
  );
};

export default RepaymentProgressContainer;
