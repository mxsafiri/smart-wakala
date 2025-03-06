import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import LoadingScreen from './LoadingScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ProtectedRoute: React.FC = () => {
  const { user, loading, error, isOnline } = useAuthState();
  const authState = useSelector((state: RootState) => state.auth);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  
  // Add more detailed console logging to help debug
  useEffect(() => {
    console.log('ProtectedRoute auth state:', { 
      user, 
      loading, 
      error, 
      isOnline,
      reduxUser: authState.user,
      reduxLoading: authState.loading,
      reduxError: authState.error,
      reduxIsOffline: authState.isOffline,
      isAuthenticated: authState.isAuthenticated,
      retryCount
    });
  }, [user, loading, error, isOnline, authState, retryCount]);

  // Check for cached auth state in localStorage
  useEffect(() => {
    if (loading && !user) {
      try {
        const cachedUser = localStorage.getItem('smartWakalaUser');
        if (cachedUser) {
          console.log('Found cached user data in ProtectedRoute');
          // We don't need to set it here as useAuthState will handle it,
          // but we can use this to make routing decisions
        }
      } catch (e) {
        console.warn('Failed to check cached user data', e);
      }
    }
  }, [loading, user]);

  // Add a timeout to prevent getting stuck on loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;
    
    if (loading) {
      // Show retry button after 5 seconds
      retryTimeoutId = setTimeout(() => {
        setShowRetryButton(true);
      }, 5000);
      
      // Set loading timeout after 10 seconds
      timeoutId = setTimeout(() => {
        console.warn('Loading timeout reached - auth state may be stuck');
        setLoadingTimeout(true);
      }, 10000);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(retryTimeoutId);
      };
    } else {
      setLoadingTimeout(false);
      // Only reset retry button if we're not in an error state
      if (!error) {
        setShowRetryButton(false);
      }
    }
  }, [loading, error]);

  // Handle retry attempts
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    // Try different recovery strategies based on retry count
    if (retryCount === 0) {
      // First retry: just refresh the component state
      setLoadingTimeout(false);
      setShowRetryButton(false);
      window.location.reload();
    } else if (retryCount === 1) {
      // Second retry: try to clear any cached auth state and reload
      try {
        localStorage.removeItem('smartWakalaUser');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear cached data during retry', e);
      }
      window.location.reload();
    } else {
      // Last resort: redirect to login and force re-authentication
      navigate('/login', { replace: true });
    }
  };

  // Handle the case where we have Redux auth state but hook is still loading
  const isReduxAuthenticated = authState.isAuthenticated && authState.user !== null;
  
  // If we're in a loading timeout but Redux shows authenticated, use Redux state
  if (loadingTimeout && isReduxAuthenticated) {
    console.log('Using Redux auth state due to loading timeout');
    return <Outlet />;
  }

  // Check if we have a cached user in localStorage when in a loading timeout
  if (loadingTimeout) {
    try {
      const cachedUser = localStorage.getItem('smartWakalaUser');
      if (cachedUser) {
        console.log('Using cached user data due to loading timeout');
        return <Outlet />;
      }
    } catch (e) {
      console.warn('Failed to check cached user during timeout', e);
    }
  }

  if (loading && !loadingTimeout) {
    return (
      <LoadingScreen 
        message={showRetryButton ? "Still loading... Taking longer than expected" : undefined}
        showRetryButton={showRetryButton}
        onRetry={handleRetry}
      />
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prioritize hook state over Redux state for consistency
  if (user) {
    return <Outlet />;
  }
  
  // Fallback to Redux state if hook state is null
  if (isReduxAuthenticated) {
    console.log('Using Redux auth state as fallback');
    return <Outlet />;
  }

  // Final fallback: check localStorage directly
  try {
    const cachedUser = localStorage.getItem('smartWakalaUser');
    if (cachedUser) {
      console.log('Using localStorage cached user as last resort fallback');
      return <Outlet />;
    }
  } catch (e) {
    console.warn('Failed to check localStorage in final fallback', e);
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
