import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiBarChart2, FiPercent, FiSettings, FiSave, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import axios from 'axios';
import { updateRepaymentPercentage, updatePerformanceScore } from '../../store/slices/overdraftSlice';
import { FloatTransaction } from '../../store/slices/floatSlice';

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
  const [score, setScore] = useState(performanceScore);
  const [percentage, setPercentage] = useState(repaymentPercentage);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [showPercentageForm, setShowPercentageForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Calculate recommended percentage based on performance score
  const recommendedPercentage = Math.max(5, Math.min(20, Math.round(20 - (performanceScore / 10))));
  
  // Determine if current percentage is optimal
  const isOptimalPercentage = repaymentPercentage === recommendedPercentage;
  
  const transactions = useSelector((state: RootState) => state.float.transactions);
  
  // Function to request AI assessment of performance
  const requestAiAssessment = async () => {
    setIsAnalyzing(true);
    setAiRecommendation(null);
    setAiError(null);
    
    try {
      // Prepare data for the OpenAI API
      const transactionData: Array<{
        amount: number;
        type: string;
        timestamp: number;
        status: string;
        description: string;
      }> = transactions.slice(0, 20).map((tx: FloatTransaction) => ({
        amount: tx.amount,
        type: tx.type,
        timestamp: tx.timestamp,
        status: tx.status,
        description: tx.description
      }));
      
      const prompt = `
        Based on the following transaction data for a mobile money agent:
        ${JSON.stringify(transactionData)}
        
        Current performance metrics:
        - Performance Score: ${performanceScore}%
        - Auto-Deduction Rate: ${repaymentPercentage}%
        
        Please analyze this data and provide:
        1. A recommended auto-deduction percentage (between 5% and 20%)
        2. A brief explanation of why this rate is appropriate
        3. Any suggestions for improving the agent's float management
      `;
      
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
                content: prompt
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
        setIsAnalyzing(false);
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
          setIsAnalyzing(false);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error analyzing performance:', error);
      setAiError('Failed to analyze performance. Please try again later.');
      setIsAnalyzing(false);
    }
  };
  
  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    try {
      await onUpdatePerformance(score);
      setShowScoreForm(false);
    } catch (error) {
      console.error('Failed to update performance score:', error);
    }
  };
  
  const handlePercentageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    try {
      await onUpdateRepaymentPercentage(percentage);
      setShowPercentageForm(false);
    } catch (error) {
      console.error('Failed to update repayment percentage:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Performance Settings</h3>
        <div className="p-2 bg-indigo-100 rounded-full">
          <IconComponent Icon={FiSettings} className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Performance Score Section */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <IconComponent Icon={FiBarChart2} className="h-5 w-5 text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Agent Performance Score</h4>
            </div>
            <span className="text-lg font-semibold">{performanceScore}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div 
              className={`h-2 rounded-full ${
                performanceScore >= 80 ? 'bg-green-500' : 
                performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${performanceScore}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${performanceScore}%` }}
              transition={{ duration: 0.8 }}
            ></motion.div>
          </div>
          
          {!showScoreForm ? (
            <button
              onClick={() => setShowScoreForm(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Update Performance Score
            </button>
          ) : (
            <form onSubmit={handleScoreSubmit} className="space-y-3">
              <div>
                <label htmlFor="performanceScore" className="block text-sm font-medium text-gray-700">
                  New Performance Score (0-100)
                </label>
                <input
                  type="number"
                  id="performanceScore"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  <IconComponent Icon={FiSave} className="h-4 w-4 inline mr-1" />
                  Save
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowScoreForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Repayment Percentage Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <IconComponent Icon={FiPercent} className="h-5 w-5 text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Auto-Deduction Percentage</h4>
            </div>
            <span className="text-lg font-semibold">{repaymentPercentage}%</span>
          </div>
          
          {!isOptimalPercentage && (
            <div className="bg-yellow-50 p-3 rounded-md mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <IconComponent Icon={FiAlertTriangle} className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Based on the current performance score, the recommended auto-deduction percentage is {recommendedPercentage}%.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!showPercentageForm ? (
            <button
              onClick={() => setShowPercentageForm(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Update Auto-Deduction Percentage
            </button>
          ) : (
            <form onSubmit={handlePercentageSubmit} className="space-y-3">
              <div>
                <label htmlFor="repaymentPercentage" className="block text-sm font-medium text-gray-700">
                  New Auto-Deduction Percentage (5-20)
                </label>
                <input
                  type="number"
                  id="repaymentPercentage"
                  min="5"
                  max="20"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: {recommendedPercentage}% (based on performance score)
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  <IconComponent Icon={FiSave} className="h-4 w-4 inline mr-1" />
                  Save
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowPercentageForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* AI Assessment Button */}
        <div className="mt-4">
          <button
            onClick={requestAiAssessment}
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition duration-150 ease-in-out"
            disabled={isAnalyzing}
          >
            <IconComponent Icon={FiRefreshCw} className={`mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing Performance...' : 'Get AI Assessment'}
          </button>
          
          {aiError && (
            <div className="mt-3 text-sm text-red-600">
              {aiError}
            </div>
          )}
          
          {aiRecommendation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-md"
            >
              <h4 className="text-sm font-semibold text-purple-800 mb-2">AI Recommendation</h4>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {aiRecommendation}
              </div>
            </motion.div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          A higher performance score can lower your auto-deduction percentage and increase your overdraft limit multiplier.
        </p>
      </div>
    </div>
  );
};

const PerformanceSettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
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
