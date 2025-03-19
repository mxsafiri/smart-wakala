import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateRepaymentPercentage, updatePerformanceScore } from '../../store/slices/overdraftSlice';
import { motion } from 'framer-motion';
import { 
  FiSliders, 
  FiTrendingUp, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiBarChart2, 
  FiPercent, 
  FiArrowUp, 
  FiLock, 
  FiArrowUpRight, 
  FiZap, 
  FiSend, 
  FiPlusCircle, 
  FiCalendar, 
  FiHelpCircle, 
  FiPlus, 
  FiArrowDown 
} from 'react-icons/fi';
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
  displayName?: string;
  onUpdatePerformance: (score: number) => Promise<void>;
  onUpdateRepaymentPercentage: (percentage: number) => Promise<void>;
  isOnline: boolean;
}

const PerformanceSettings: React.FC<PerformanceSettingsProps> = ({
  performanceScore,
  repaymentPercentage,
  isProcessing,
  displayName,
  onUpdatePerformance,
  onUpdateRepaymentPercentage,
  isOnline
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

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'increase':
        const increasedScore = Math.min(100, performanceScore + 5);
        setLocalScore(increasedScore);
        onUpdatePerformance(increasedScore);
        break;
      case 'decrease':
        const decreasedScore = Math.max(0, performanceScore - 5);
        setLocalScore(decreasedScore);
        onUpdatePerformance(decreasedScore);
        break;
      case 'optimize':
        setLocalPercentage(recommendedPercentage);
        onUpdateRepaymentPercentage(recommendedPercentage);
        break;
      default:
        break;
    }
  };

  // Request AI assessment with better error handling
  const requestAiAssessment = async () => {
    if (!isOnline) {
      setAiError(translate('errors.offlineMode'));
      return;
    }

    setIsAssessing(true);
    setAiError(null);
    
    try {
      // Get API key from environment or configuration
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

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
                ${JSON.stringify(transactions.slice(0, 20).map((tx: any) => ({
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
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setAiRecommendation(response.data.choices[0].message.content);
    } catch (error: unknown) {
      console.error('Error calling OpenAI API:', error);
      
      // Check if error is an object with response property
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response.status === 401) {
          setAiError(translate('errors.invalidApiKey'));
        } else if (axiosError.response.status === 429) {
          setAiError(translate('errors.tooManyRequests'));
        } else {
          setAiError(translate('errors.aiRequestFailed'));
        }
      } else {
        setAiError(translate('errors.unexpectedError'));
      }

      // Fall back to simulated response in development
      if (process.env.NODE_ENV === 'development') {
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
        }, 2000);
      }
    } finally {
      setIsAssessing(false);
    }
  };

  // Render quick action buttons
  const renderQuickActions = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={() => handleQuickAction('increase')}
        disabled={!isOnline || performanceScore >= 100}
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150
          ${isOnline && performanceScore < 100 
            ? 'bg-success-100 text-success-700 hover:bg-success-200' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        <IconComponent Icon={FiArrowUp} className="w-4 h-4 mr-1" />
        {translate('actions.increaseScore')}
      </button>
      
      <button
        onClick={() => handleQuickAction('decrease')}
        disabled={!isOnline || performanceScore <= 0}
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150
          ${isOnline && performanceScore > 0
            ? 'bg-warning-100 text-warning-700 hover:bg-warning-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        <IconComponent Icon={FiArrowDown} className="w-4 h-4 mr-1" />
        {translate('actions.decreaseScore')}
      </button>
      
      <button
        onClick={() => handleQuickAction('optimize')}
        disabled={!isOnline}
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150
          ${isOnline 
            ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        <IconComponent Icon={FiZap} className="w-4 h-4 mr-1" />
        {translate('actions.optimizeRate')}
      </button>
    </div>
  );

  // Render AI recommendation section
  const renderAiSection = () => (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          {translate('ai.recommendation')}
        </h3>
        <button
          onClick={requestAiAssessment}
          disabled={!isOnline || isAssessing}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150
            ${isOnline && !isAssessing
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {isAssessing ? (
            <>
              <IconComponent Icon={FiRefreshCw} className="w-4 h-4 mr-1 animate-spin" />
              {translate('ai.analyzing')}
            </>
          ) : (
            <>
              <IconComponent Icon={FiHelpCircle} className="w-4 h-4 mr-1" />
              {translate('ai.getAdvice')}
            </>
          )}
        </button>
      </div>

      {aiError && (
        <div className="bg-danger-50 border-l-4 border-danger-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <IconComponent Icon={FiAlertCircle} className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-danger-700">{aiError}</p>
            </div>
          </div>
        </div>
      )}

      {aiRecommendation && !aiError && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="prose prose-sm max-w-none text-blue-900">
            {aiRecommendation}
          </div>
        </div>
      )}
    </div>
  );

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <IconComponent Icon={FiSliders} className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Performance Settings</h2>
        </div>
        <div className={`px-4 py-2 rounded-full ${
          performanceScore >= 80 ? 'bg-green-100 text-green-700' :
          performanceScore >= 60 ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          <div className="font-medium">Score: {performanceScore}</div>
          <div className="text-sm">
            {performanceScore >= 80 ? 'Excellent' :
             performanceScore >= 60 ? 'Good' :
             'Needs Improvement'}
          </div>
        </div>
      </div>

      {/* Welcome & AI Assistant Section */}
      <div className="bg-blue-50/30 rounded-xl p-4 mb-4">
        {/* Header & AI Input */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Hi {displayName || 'Agent'}
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything about your account..."
              className="w-full p-3 pr-12 bg-white rounded-lg border border-gray-100 focus:border-blue-200 focus:ring-1 focus:ring-blue-200 transition-all text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700">
              <IconComponent Icon={FiSend} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all text-sm">
            <IconComponent Icon={FiPlusCircle} className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Top-up</span>
          </button>
          <button className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all text-sm">
            <IconComponent Icon={FiCalendar} className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Payments</span>
          </button>
          <button className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all text-sm">
            <IconComponent Icon={FiTrendingUp} className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Limits</span>
          </button>
          <button className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all text-sm">
            <IconComponent Icon={FiHelpCircle} className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Help</span>
          </button>
        </div>
      </div>

      {/* Performance Card */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600">Performance Score</h4>
            <p className="text-2xl font-semibold text-gray-900">{performanceScore}%</p>
          </div>
          <div className="text-right">
            <h4 className="text-sm font-medium text-gray-600">Auto-deduction</h4>
            <p className="text-base font-medium text-gray-900">{repaymentPercentage}%</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Credit Score</span>
              <span className="text-gray-900 font-medium">Good</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500" 
                style={{ width: `${performanceScore}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Repayment Rate</span>
              <span className="text-gray-900 font-medium">{repaymentPercentage}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${repaymentPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Collateral Power Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-xl font-semibold mb-1">Unlock Smart Wakala's Full Potential</h3>
            <div className="flex items-center gap-1 text-blue-100">
              <IconComponent Icon={FiLock} className="w-4 h-4" />
              <p className="text-sm">Unlock 3X overdraft with an initial deposit of 100K</p>
            </div>
          </div>

          {/* Stats with Visual Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <p className="text-sm text-blue-100">Current</p>
              </div>
              <p className="font-semibold">TZS 100,000</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <p className="text-sm text-blue-100">Available</p>
              </div>
              <p className="font-semibold">TZS 300,000</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 relative overflow-hidden">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <p className="text-sm text-blue-100">Potential</p>
              </div>
              <p className="font-semibold">TZS 1,000,000</p>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-blue-500/20 rounded-full"></div>
            </div>
          </div>

          {/* Benefits with Enhanced Visual Style */}
          <div className="space-y-2 bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <IconComponent Icon={FiArrowUpRight} className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-sm">Higher Credit Limits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <IconComponent Icon={FiPercent} className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-sm">Lower Auto-deduction Rates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <IconComponent Icon={FiZap} className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-sm">Priority Float Access</span>
            </div>
          </div>
        </div>
      </div>

      {renderQuickActions()}
      {renderAiSection()}

      {/* Last Assessment Info */}
      <div className="text-sm text-gray-500 flex items-center justify-between border-t pt-4">
        <span>Last assessment: {new Date().toLocaleDateString()}</span>
        <span className="text-blue-600">
          {isProcessing ? 'Processing...' : 'Up to date'}
        </span>
      </div>
    </motion.div>
  );
};

const PerformanceSettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { performanceScore, repaymentPercentage, isProcessing } = useSelector((state: RootState) => state.overdraft);
  const { user, isOffline } = useSelector((state: RootState) => state.auth);

  const handleUpdatePerformance = async (score: number) => {
    dispatch(updatePerformanceScore(score));
  };

  const handleUpdateRepaymentPercentage = async (percentage: number) => {
    dispatch(updateRepaymentPercentage(percentage));
  };

  return (
    <PerformanceSettings
      performanceScore={performanceScore}
      repaymentPercentage={repaymentPercentage}
      isProcessing={isProcessing}
      displayName={user?.displayName}
      onUpdatePerformance={handleUpdatePerformance}
      onUpdateRepaymentPercentage={handleUpdateRepaymentPercentage}
      isOnline={!isOffline}
    />
  );
};

export default PerformanceSettings;
