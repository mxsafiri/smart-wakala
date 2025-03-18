import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateRepaymentPercentage, updatePerformanceScore } from '../../store/slices/overdraftSlice';
import { FloatTransaction } from '../../store/slices/floatSlice';
import { motion } from 'framer-motion';
import { FiSliders, FiTrendingUp, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiBarChart2, FiPercent } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Define OpenAI API response types
interface OpenAIMessage {
  role: string;
  content: string;
}

interface OpenAIChoice {
  message: OpenAIMessage;
  index: number;
  finish_reason: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface PerformanceSettingsProps {
  performanceScore: number;
  repaymentPercentage: number;
  isProcessing: boolean;
  onUpdatePerformance: (score: number) => Promise<void>;
  onUpdateRepaymentPercentage: (percentage: number) => Promise<void>;
}

const PerformanceSettings: React.FC<PerformanceSettingsProps> = ({
  performanceScore,
  repaymentPercentage,
  isProcessing,
  onUpdatePerformance,
  onUpdateRepaymentPercentage
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  // Cast t to our custom type to avoid TypeScript errors
  const translate = t as { 
    (key: string): string;
    (key: string, options: Record<string, any>): string;
  };
  
  const [localPercentage, setLocalPercentage] = useState(repaymentPercentage);
  const [localScore, setLocalScore] = useState(performanceScore);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Get transactions data from Redux store
  const transactions = useSelector((state: RootState) => state.float.transactions);
  
  // Calculate recommended percentage based on performance score
  const recommendedPercentage = Math.max(5, Math.min(20, Math.round(20 - (performanceScore / 10))));
  
  // Handle slider change
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPercentage(parseInt(e.target.value));
  };
  
  // Handle score change
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalScore(parseInt(e.target.value));
  };
  
  // Handle save
  const handleSave = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch(updateRepaymentPercentage(localPercentage));
      dispatch(updatePerformanceScore(localScore));
      setIsUpdating(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  // Request AI assessment
  const requestAiAssessment = async () => {
    setIsAssessing(true);
    
    // Simulate API call to get AI assessment
    try {
      const response = await axios.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor specializing in mobile money agent operations and float liquidity management.'
            },
            {
              role: 'user',
              content: `
                Based on the following transaction data for a mobile money agent:
                ${JSON.stringify(transactions.slice(0, 20).map((tx: FloatTransaction) => ({
                  amount: tx.amount,
                  type: tx.type,
                  timestamp: tx.timestamp,
                  status: tx.status,
                  description: tx.description
                })))}
                
                Current performance metrics:
                - Performance Score: ${performanceScore}%
                - Auto-Deduction Rate: ${repaymentPercentage}%
                
                Please analyze this data and provide:
                1. A recommended auto-deduction percentage (between 5% and 20%)
                2. A brief explanation of why this rate is appropriate
                3. Any suggestions for improving the agent's float management
              `
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setAiRecommendation(response.data.choices[0].message.content);
      setIsAssessing(false);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Fall back to simulated response if API call fails
      setTimeout(() => {
        const mockRecommendation = `
          Based on your transaction history and current performance metrics, I recommend:
          
          **Recommended Auto-Deduction Rate: ${Math.max(5, Math.min(20, Math.round(repaymentPercentage * 0.9)))}%**
          
          This slightly lower rate is appropriate because:
          - Your transaction volume is consistent and predictable
          - You have a perfect repayment history
          - Your collateral ratio is strong at 2:1
          
          To further improve your float management:
          - Consider increasing your collateral deposit to qualify for an even lower rate
          - Maintain your consistent repayment schedule
          - Continue your current transaction volume to build a stronger history
        `;
        
        setAiRecommendation(mockRecommendation);
        setIsAssessing(false);
      }, 2000);
    }
  };
  
  // Get color based on performance score
  const getScoreColor = () => {
    if (performanceScore >= 80) return 'text-success-600';
    if (performanceScore >= 60) return 'text-primary-600';
    if (performanceScore >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };
  
  // Get background color based on performance score
  const getScoreBackground = () => {
    if (performanceScore >= 80) return 'bg-success-100';
    if (performanceScore >= 60) return 'bg-primary-100';
    if (performanceScore >= 40) return 'bg-warning-100';
    return 'bg-danger-100';
  };
  
  // Get message based on performance score
  const getScoreMessage = () => {
    if (performanceScore >= 80) return translate('performance.excellent');
    if (performanceScore >= 60) return translate('performance.good');
    if (performanceScore >= 40) return translate('performance.fair');
    return translate('performance.poor');
  };
  
  return (
    <div className="card shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <IconComponent Icon={FiSliders} className="text-primary-500 mr-2" />
          <h3 className="card-title">{translate('performance.performanceSettings')}</h3>
        </div>
        
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-full ${getScoreBackground()}`}>
            <span className={`text-sm font-medium ${getScoreColor()}`}>
              Score: {performanceScore} - {getScoreMessage()}
            </span>
          </div>
        </div>
      </div>
      
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 bg-success-50 border border-success-200 rounded-md flex items-center"
        >
          <IconComponent Icon={FiCheckCircle} className="text-success-500 mr-2" />
          <span className="text-sm text-success-800">{translate('performance.settingsUpdatedSuccessfully')}</span>
        </motion.div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="repaymentPercentage" className="text-sm font-medium text-gray-700">
            {translate('performance.autoDeductionPercentage')}
          </label>
          <span className="text-sm text-primary-600 font-medium">
            {localPercentage}%
          </span>
        </div>
        
        <div className="relative mt-2">
          <input
            type="range"
            id="repaymentPercentage"
            min="5"
            max="20"
            step="1"
            value={localPercentage}
            onChange={handlePercentageChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
            <span>20%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2 mt-4">
          <label htmlFor="performanceScore" className="text-sm font-medium text-gray-700">
            {translate('performance.performanceScore')}
          </label>
          <span className="text-sm text-primary-600 font-medium">
            {localScore}%
          </span>
        </div>
        
        <div className="relative mt-2">
          <input
            type="range"
            id="performanceScore"
            min="0"
            max="100"
            step="1"
            value={localScore}
            onChange={handleScoreChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        {localPercentage !== repaymentPercentage || localScore !== performanceScore && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="btn btn-sm btn-primary"
            >
              {isUpdating ? (
                <>
                  <span className="animate-spin mr-2">
                    <IconComponent Icon={FiRefreshCw} className="h-4 w-4" />
                  </span>
                  {translate('common.updating')}
                </>
              ) : (
                translate('common.saveChanges')
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center mb-3">
          <IconComponent Icon={FiTrendingUp} className="text-primary-500 mr-2" />
          <h4 className="text-sm font-medium text-gray-800">{translate('performance.aiRecommendations')}</h4>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md mb-3">
          <p className="text-sm text-gray-600 mb-2">
            {translate('performance.recommendationText', { percentage: recommendedPercentage })}
          </p>
          
          {recommendedPercentage !== localPercentage && (
            <button
              onClick={() => setLocalPercentage(recommendedPercentage)}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              {translate('performance.applyRecommendation')}
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {translate('performance.lastAssessment')}: {new Date().toLocaleDateString()}
          </div>
          
          <button
            onClick={requestAiAssessment}
            disabled={isAssessing}
            className="btn btn-sm btn-outline"
          >
            {isAssessing ? (
              <>
                <span className="animate-spin mr-2">
                  <IconComponent Icon={FiRefreshCw} className="h-4 w-4" />
                </span>
                {translate('performance.assessing')}
              </>
            ) : (
              <>
                <IconComponent Icon={FiRefreshCw} className="mr-1" />
                {translate('performance.reassessNow')}
              </>
            )}
          </button>
        </div>
        
        {aiRecommendation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-md"
          >
            <h4 className="text-sm font-semibold text-purple-800 mb-2">{translate('performance.aiRecommendation')}</h4>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {aiRecommendation}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const PerformanceSettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    performanceScore, 
    repaymentPercentage,
    isProcessing 
  } = useSelector((state: RootState) => state.overdraft);
  
  const handleUpdatePerformance = async (score: number) => {
    await dispatch(updatePerformanceScore(score));
  };
  
  const handleUpdateRepaymentPercentage = async (percentage: number) => {
    await dispatch(updateRepaymentPercentage(percentage));
  };
  
  return (
    <PerformanceSettings
      performanceScore={performanceScore}
      repaymentPercentage={repaymentPercentage}
      isProcessing={isProcessing}
      onUpdatePerformance={handleUpdatePerformance}
      onUpdateRepaymentPercentage={handleUpdateRepaymentPercentage}
    />
  );
};

export default PerformanceSettingsContainer;
