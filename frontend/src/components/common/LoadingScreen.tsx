import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface LoadingScreenProps {
  timeout?: number;
  message?: string;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  timeout = 15000,
  message,
  showRetryButton = false,
  onRetry
}) => {
  const [internalShowRetry, setInternalShowRetry] = useState(showRetryButton);
  const [loadingMessage, setLoadingMessage] = useState(message || 'Please wait while we set things up');
  const [loadingDuration, setLoadingDuration] = useState(0);
  const isOffline = useSelector((state: RootState) => state.auth.isOffline);
  
  // Track loading duration
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setLoadingDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // If no external control is provided, show retry button after timeout
    if (!showRetryButton && !onRetry) {
      const timer = setTimeout(() => {
        setInternalShowRetry(true);
        setLoadingMessage('This is taking longer than expected');
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout, showRetryButton, onRetry]);
  
  // Update when props change
  useEffect(() => {
    if (message) {
      setLoadingMessage(message);
    }
    setInternalShowRetry(showRetryButton);
  }, [message, showRetryButton]);
  
  useEffect(() => {
    // Update message based on network status and loading duration
    if (isOffline && !message) {
      setLoadingMessage('You appear to be offline. Check your connection');
    } else if (loadingDuration > 10 && !message) {
      setLoadingMessage('Still loading... This is taking longer than expected');
    } else if (loadingDuration > 20 && !message) {
      setLoadingMessage('Having trouble connecting to the server. You may want to try again');
    }
  }, [isOffline, message, loadingDuration]);
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-gray-500 text-center">{loadingMessage}</p>
        
        {loadingDuration > 5 && (
          <p className="mt-2 text-xs text-gray-400">Loading for {loadingDuration} seconds</p>
        )}
        
        {isOffline && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm w-full">
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              You are currently offline. Some features may be limited.
            </p>
          </div>
        )}
        
        {(internalShowRetry || showRetryButton) && (
          <button 
            onClick={handleRetry}
            className="mt-6 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
          >
            Retry Connection
          </button>
        )}
        
        <div className="mt-6 text-xs text-gray-400">
          <p>If you continue to experience issues:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Check your internet connection</li>
            <li>Clear your browser cache</li>
            <li>Try using a different browser</li>
            {loadingDuration > 15 && (
              <li>Try logging out and logging back in</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
