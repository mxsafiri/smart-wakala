import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiTrendingUp, 
  FiDollarSign, 
  FiActivity,
  FiInfo,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

interface CreditScoreFactorsProps {
  creditScoreFactors: {
    repaymentHistory: number;
    transactionVolume: number;
    collateralRatio: number;
    accountAge: number;
  };
  performanceScore: number;
}

const CreditScoreFactors: React.FC<CreditScoreFactorsProps> = ({
  creditScoreFactors,
  performanceScore
}) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const factorDescriptions = {
    repaymentHistory: 'Based on your history of on-time repayments and auto-deductions',
    transactionVolume: 'Based on your transaction frequency and volume over time',
    collateralRatio: 'Based on your collateral amount relative to your overdraft limit',
    accountAge: 'Based on how long you have been using the Smart Wakala platform'
  };
  
  const factorWeights = {
    repaymentHistory: 40,
    transactionVolume: 30,
    collateralRatio: 20,
    accountAge: 10
  };
  
  const factorIcons = {
    repaymentHistory: FiClock,
    transactionVolume: FiActivity,
    collateralRatio: FiDollarSign,
    accountAge: FiTrendingUp
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
            {performanceScore}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-800">Credit Score</h3>
            <p className="text-sm text-gray-500">
              {performanceScore >= 80 ? 'Excellent' : 
               performanceScore >= 60 ? 'Good' : 
               performanceScore >= 40 ? 'Fair' : 'Poor'}
            </p>
          </div>
        </div>
        <IconComponent 
          Icon={expanded ? FiChevronUp : FiChevronDown} 
          className="h-5 w-5 text-gray-600" 
        />
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Your credit score determines your overdraft limit and auto-deduction percentage.
              Improve these factors to increase your score.
            </p>
          </div>
          
          <div className="space-y-4">
            {Object.entries(creditScoreFactors).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <IconComponent 
                      Icon={factorIcons[key as keyof typeof factorIcons]} 
                      className={`h-4 w-4 mr-2 ${getScoreColor(value)}`} 
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                      {value}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({factorWeights[key as keyof typeof factorWeights]}%)
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 rounded-full ${getProgressColor(value)}`}
                    style={{ width: `${value}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
                
                <p className="text-xs text-gray-500">
                  {factorDescriptions[key as keyof typeof factorDescriptions]}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <IconComponent Icon={FiInfo} className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Increasing your performance score by 10 points can raise your overdraft limit by up to 10%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CreditScoreFactorsContainer: React.FC = () => {
  const { 
    creditScoreFactors,
    performanceScore
  } = useSelector((state: RootState) => state.overdraft);
  
  return (
    <CreditScoreFactors
      creditScoreFactors={creditScoreFactors}
      performanceScore={performanceScore}
    />
  );
};

export default CreditScoreFactorsContainer;
