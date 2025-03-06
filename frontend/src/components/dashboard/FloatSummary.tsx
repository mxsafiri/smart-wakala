import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

interface FloatProvider {
  id: string;
  name: string;
  logo: string;
}

interface FloatSummaryProps {
  floatBalance: number;
  weeklyData?: number[];
  providers?: FloatProvider[];
  weeklyChange?: number;
  onRequestFloat?: () => void;
}

const FloatSummary: React.FC<FloatSummaryProps> = ({
  floatBalance,
  weeklyData = [],
  providers = [],
  weeklyChange = 0,
  onRequestFloat
}) => {
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
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-medium text-gray-900">Float Balance</h3>
        
        <div className="flex space-x-2">
          <Button
            variant="text"
            size="sm"
            leftIcon={<IconComponent Icon={FiActivity} />}
          >
            History
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-display font-semibold financial-figure">
            {formatCurrency(floatBalance)}
          </p>
          <p className="text-sm text-gray-500">Available balance</p>
        </div>
        
        {weeklyChange !== undefined && (
          <div className={`flex items-center px-2.5 py-0.5 rounded-full text-sm ${weeklyChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {weeklyChange >= 0 ? (
              <React.Fragment>
                <IconComponent Icon={FiTrendingUp} className="mr-1" />
                +{weeklyChange.toFixed(1)}%
              </React.Fragment>
            ) : (
              <React.Fragment>
                <IconComponent Icon={FiTrendingDown} className="mr-1" />
                {weeklyChange.toFixed(1)}%
              </React.Fragment>
            )}
          </div>
        )}
      </div>
      
      {weeklyData && weeklyData.length > 0 && (
        <div className="mb-6">
          <div className="flex items-end space-x-1 h-24">
            {weeklyData.map((value, index) => {
              const maxValue = Math.max(...weeklyData);
              const percentage = (value / maxValue) * 100;
              
              return (
                <div 
                  key={index}
                  className="flex-1 bg-primary-100 rounded-t"
                  style={{ height: `${percentage}%` }}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      )}
      
      {providers && providers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Float Providers</h4>
          <div className="space-y-2">
            {providers.map(provider => (
              <div key={provider.id} className="flex items-center">
                <img src={provider.logo} alt={provider.name} className="w-6 h-6 rounded-full mr-2" />
                <span className="text-sm text-gray-600">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {onRequestFloat && (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="md"
            leftIcon={<IconComponent Icon={FiDollarSign} />}
            className="flex-1"
          >
            Request Float
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FloatSummary;
