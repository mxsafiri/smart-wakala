import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { useNavigate } from 'react-router-dom';

const OverdraftSummary: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
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
  
  return (
    <Card>
      <h3 className="card-title font-display">Float Overdraft</h3>
      
      <div className="flex items-start justify-between mt-4">
        <div className="w-1/2">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Used</p>
            <p className="text-xl font-display font-semibold financial-figure text-purple-700">
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
              pathColor: `rgba(126, 34, 206, ${overdraftUsedPercentage / 100})`,
              textColor: '#6b21a8',
              trailColor: '#f3f4f6',
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
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 font-display">Auto-Deduction Details</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Icon name="FiArrowUp" className="h-4 w-4 text-green-500 mr-2" size={16} />
                <span className="text-sm text-gray-600">Last Top-up</span>
              </div>
              <span className="text-sm font-medium financial-figure">{formatCurrency(lastTopUpAmount || 0)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Icon name="FiArrowDown" className="h-4 w-4 text-red-500 mr-2" size={16} />
                <span className="text-sm text-gray-600">Auto-Deduction</span>
              </div>
              <span className="text-sm font-medium financial-figure">{formatCurrency(lastAutoDeduction || 0)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <div className="flex items-center">
                <Icon name="FiAlertCircle" className="h-4 w-4 text-blue-500 mr-2" size={16} />
                <span className="text-sm text-gray-600">Next Deduction (est.)</span>
              </div>
              <span className="text-sm font-medium financial-figure">{formatCurrency(nextAutoDeductionEstimate)}</span>
            </div>
            
            <div className="pt-2 text-xs text-gray-500">
              <p>{repaymentPercentage}% of each top-up amount is automatically deducted for overdraft repayment.</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OverdraftSummary;
