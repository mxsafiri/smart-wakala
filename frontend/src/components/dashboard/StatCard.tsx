import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
      
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        
        {change && (
          <div className="flex items-center mt-2">
            <span
              className={`text-sm font-medium ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.isPositive ? '+' : ''}
              {change.value}%
            </span>
            
            <svg
              className={`h-4 w-4 ml-1 ${
                change.isPositive ? 'text-green-500' : 'text-red-500'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {change.isPositive ? (
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L13 9.414l-3.586 3.586H12z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            
            <span className="text-xs text-gray-500 ml-1">from last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
