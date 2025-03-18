import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, 
  FiTrendingUp, 
  FiDollarSign, 
  FiActivity,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiArrowUp,
  FiArrowDown,
  FiHelpCircle
} from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { useTranslation } from 'react-i18next';

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
  const [expanded, setExpanded] = useState(false);
  const [activeFactorTip, setActiveFactorTip] = useState<string | null>(null);
  const { t } = useTranslation();
  
  // Cast t to our custom type to avoid TypeScript errors
  const translate = t as { (key: string): string };
  
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
    repaymentHistory: translate('overdraft.repaymentHistoryDescription'),
    transactionVolume: translate('overdraft.transactionVolumeDescription'),
    collateralRatio: translate('overdraft.collateralRatioDescription'),
    accountAge: translate('overdraft.accountAgeDescription')
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
  
  const factorImprovementTips = {
    repaymentHistory: [
      'Make all repayments on time or early',
      'Never miss an auto-deduction payment',
      'Consider making additional manual repayments',
      'Set up payment reminders in your calendar'
    ],
    transactionVolume: [
      'Increase your daily transaction count',
      'Process larger transaction amounts',
      'Maintain consistent transaction activity',
      'Avoid long periods of inactivity'
    ],
    collateralRatio: [
      'Increase your deposit/collateral amount',
      'Maintain a healthy ratio between collateral and overdraft',
      'Consider adding additional security deposits',
      'Reduce your outstanding overdraft balance'
    ],
    accountAge: [
      'Continue using the platform regularly',
      'Your score will naturally improve over time',
      'Maintain your account in good standing',
      'Refer other agents to build your network'
    ]
  };
  
  const toggleFactorTip = (factor: string) => {
    if (activeFactorTip === factor) {
      setActiveFactorTip(null);
    } else {
      setActiveFactorTip(factor);
    }
  };
  
  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-yellow-600' };
    if (score >= 40) return { label: 'Fair', color: 'text-orange-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };
  
  const scoreCategory = getScoreCategory(performanceScore);
  
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
              {scoreCategory.label} <span className="text-xs">({performanceScore}/100)</span>
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
            {Object.entries(creditScoreFactors).map(([factor, score]) => (
              <div key={factor} className="rounded-md border border-gray-200 p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${score >= 70 ? 'bg-green-100' : score >= 50 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <IconComponent 
                        Icon={factorIcons[factor as keyof typeof factorIcons]} 
                        className={`h-4 w-4 ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`} 
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-800 capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        <span className="ml-1 text-xs text-gray-500">
                          ({factorWeights[factor as keyof typeof factorWeights]}%)
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        {factorDescriptions[factor as keyof typeof factorDescriptions]}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFactorTip(factor);
                      }} 
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                    >
                      <IconComponent Icon={FiHelpCircle} className="h-3 w-3 mr-1" />
                      Improve
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeFactorTip === factor && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                    >
                      <h5 className="text-xs font-medium text-gray-700 mb-2">How to improve:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {factorImprovementTips[factor as keyof typeof factorImprovementTips].map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <IconComponent Icon={FiArrowUp} className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-blue-50 rounded-md p-3">
            <div className="flex items-start">
              <IconComponent Icon={FiInfo} className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="ml-2">
                <p className="text-xs text-blue-800">
                  <strong>Pro Tip:</strong> Your credit score is recalculated daily. Focusing on improving your repayment history (40%) and transaction volume (30%) will have the biggest impact on your score and overdraft limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Container component to connect to Redux
const CreditScoreFactorsContainer: React.FC = () => {
  const { creditScoreFactors, performanceScore } = useSelector((state: RootState) => state.overdraft);
  
  return (
    <CreditScoreFactors
      creditScoreFactors={creditScoreFactors}
      performanceScore={performanceScore}
    />
  );
};

export default CreditScoreFactorsContainer;
