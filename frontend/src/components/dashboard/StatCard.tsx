import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  className = '',
  trend,
  isLoading = false,
  onClick,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="mt-1 text-2xl font-display font-semibold text-gray-900 financial-figure">{value}</p>
          )}
        </div>
        
        {icon && (
          <div className="rounded-full p-2 bg-opacity-10">
            {icon}
          </div>
        )}
      </div>
      
      {change !== undefined && !isLoading && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${
            isPositive ? 'financial-status-positive' : isNegative ? 'financial-status-negative' : 'text-gray-600'
          }`}>
            {isPositive ? (
              <Icon 
                name="FiArrowUp" 
                className="mr-1 h-4 w-4 flex-shrink-0" 
                size={16} 
              />
            ) : isNegative ? (
              <Icon 
                name="FiArrowDown" 
                className="mr-1 h-4 w-4 flex-shrink-0" 
                size={16} 
              />
            ) : null}
            <span className="font-medium">
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="ml-1 text-gray-500">from last period</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
