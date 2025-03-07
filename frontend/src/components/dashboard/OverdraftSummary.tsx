import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const OverdraftSummary: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const { 
    overdraftBalance, 
    overdraftLimit, 
    availableOverdraft,
    totalRepaid,
    repaymentPercentage,
    lastTopUpAmount,
    lastAutoDeduction
  } = useSelector((state: RootState) => state.overdraft);
  
  // Calculate values for display
  const overdraftUsed = overdraftBalance || 0;
  const nextAutoDeductionEstimate = Math.round((lastTopUpAmount || 0) * (repaymentPercentage / 100));
  
  // Calculate percentage of overdraft used
  const overdraftUsedPercentage = overdraftLimit > 0 
    ? Math.min(100, Math.round((overdraftUsed / overdraftLimit) * 100))
    : 0;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle navigation to top-up page
  const handleTopUpClick = () => {
    navigate('/float-top-up');
  };
  
  // Show notification when overdraft is near limit
  useEffect(() => {
    if (overdraftUsedPercentage >= 80) {
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [overdraftUsedPercentage]);
  
  // Get color based on overdraft usage
  const getOverdraftColor = () => {
    if (overdraftUsedPercentage >= 90) return 'text-red-700';
    if (overdraftUsedPercentage >= 75) return 'text-yellow-700';
    return 'text-purple-700';
  };
  
  // Get progress color based on overdraft usage
  const getProgressColor = () => {
    if (overdraftUsedPercentage >= 90) return 'rgba(220, 38, 38, 1)';
    if (overdraftUsedPercentage >= 75) return 'rgba(245, 158, 11, 1)';
    return 'rgba(126, 34, 206, 1)';
  };
  
  // Get progress trail color based on overdraft usage
  const getProgressTrailColor = () => {
    if (overdraftUsedPercentage >= 90) return 'rgba(254, 226, 226, 1)';
    if (overdraftUsedPercentage >= 75) return 'rgba(254, 243, 199, 1)';
    return 'rgba(243, 244, 246, 1)';
  };
  
  return (
    <Card>
      <h3 className="card-title font-display">Float Overdraft</h3>
      
      {/* Notification for high overdraft usage */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className={`mb-4 p-3 rounded-md ${overdraftUsedPercentage >= 90 ? 'bg-red-100' : 'bg-yellow-100'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <Icon name="FiAlertCircle" className={`mr-2 ${overdraftUsedPercentage >= 90 ? 'text-red-600' : 'text-yellow-600'}`} size={18} />
              <div>
                <p className={`text-sm font-medium ${overdraftUsedPercentage >= 90 ? 'text-red-800' : 'text-yellow-800'}`}>
                  {overdraftUsedPercentage >= 90 
                    ? 'Critical: Your overdraft is almost depleted!' 
                    : 'Warning: You are approaching your overdraft limit'}
                </p>
                <p className="text-xs mt-1">
                  {overdraftUsedPercentage >= 90 
                    ? 'Top up your float soon to avoid service disruption.' 
                    : 'Consider topping up your float to maintain liquidity.'}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <button 
                onClick={handleTopUpClick}
                className={`text-xs px-3 py-1 rounded-md ${
                  overdraftUsedPercentage >= 90 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                Top Up Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-start justify-between mt-4">
        <div className="w-1/2">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Used</p>
            <p className={`text-xl font-display font-semibold financial-figure ${getOverdraftColor()}`}>
              {formatCurrency(overdraftUsed)}
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Total Limit</p>
            <p className="text-xl font-display font-semibold financial-figure">
              {formatCurrency(overdraftLimit)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Available Float</p>
            <p className="text-xl font-display font-semibold financial-figure text-green-600">
              {formatCurrency(availableOverdraft)}
            </p>
          </div>
        </div>
        
        <div className="w-32">
          <CircularProgressbar
            value={overdraftUsedPercentage}
            text={`${overdraftUsedPercentage}%`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: getProgressColor(),
              textColor: overdraftUsedPercentage >= 90 ? '#b91c1c' : 
                         overdraftUsedPercentage >= 75 ? '#b45309' : '#6b21a8',
              trailColor: getProgressTrailColor(),
              backgroundColor: '#3e1f47',
            })}
          />
          <p className="text-xs text-center mt-2 text-gray-600">Used Percentage</p>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {expanded ? 'Show Less' : 'Show Details'} 
          <Icon name="FiArrowRight" className="ml-2" size={16} />
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm text-gray-600">Auto-Deduction Rate</p>
            <p className="text-lg font-semibold">{repaymentPercentage}%</p>
            <p className="text-xs text-gray-500">
              This percentage is automatically deducted from each top-up to repay your overdraft
            </p>
          </div>
          
          {lastTopUpAmount > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Last Top-Up</p>
                <p className="text-lg font-semibold">{formatCurrency(lastTopUpAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto-Deducted</p>
                <p className="text-lg font-semibold">{formatCurrency(lastAutoDeduction)}</p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-start">
              <Icon name="FiInfo" className="text-gray-500 mt-0.5 flex-shrink-0" size={16} />
              <div className="ml-2">
                <p className="text-xs text-gray-700">
                  Your overdraft limit is determined by your performance score. Maintain timely repayments to increase your limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OverdraftSummary;
