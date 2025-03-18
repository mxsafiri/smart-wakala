import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuthState } from './hooks/useAuthState';
import { checkNetworkStatus } from './store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import Dashboard from './pages/Dashboard';
import FloatTopUp from './pages/FloatTopUp';
import FloatManagement from './pages/FloatManagement';
import Overdraft from './pages/Overdraft';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingScreen from './components/common/LoadingScreen';
import TestPage from './pages/TestPage';
import TestFirebase from './pages/TestFirebase';
import OfflineIndicator from './components/common/OfflineIndicator';
import DesignSystem from './components/ui/DesignSystem';
import LanguageWelcomeModal from './components/common/LanguageWelcomeModal';

const App: React.FC = () => {
  const { user, loading, error } = useAuthState();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showLanguageWelcome, setShowLanguageWelcome] = useState(false);

  // Add console logging to help debug
  console.log('App rendering, auth state:', { user, loading, error });

  // Initialize network status monitoring
  useEffect(() => {
    const unsubscribe = dispatch(checkNetworkStatus() as any);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [dispatch]);

  // Check if Firebase is properly initialized
  useEffect(() => {
    const checkFirebaseConfig = () => {
      const requiredEnvVars = [
        'REACT_APP_FIREBASE_API_KEY',
        'REACT_APP_FIREBASE_AUTH_DOMAIN',
        'REACT_APP_FIREBASE_PROJECT_ID'
      ];
      
      const missingVars = requiredEnvVars.filter(
        varName => !process.env[varName]
      );
      
      if (missingVars.length > 0) {
        console.error('Missing required Firebase environment variables:', missingVars);
        return false;
      }
      
      return true;
    };
    
    setFirebaseInitialized(checkFirebaseConfig());
  }, []);

  useEffect(() => {
    // Check if the welcome modal has been shown before
    const hasShownWelcome = localStorage.getItem('languageWelcomeShown') === 'true';
    if (!hasShownWelcome) {
      setShowLanguageWelcome(true);
    }
  }, []);

  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Show error if Firebase is not properly initialized
  if (!firebaseInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">
            Firebase configuration is missing or incomplete. Please check your environment variables.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure you have created a .env file in the frontend directory with all the required Firebase configuration values.
          </p>
        </div>
      </div>
    );
  }

  // Show error if there was a problem with authentication
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <OfflineIndicator />
      {showLanguageWelcome && (
        <LanguageWelcomeModal onClose={() => {
          setShowLanguageWelcome(false);
          localStorage.setItem('languageWelcomeShown', 'true');
        }} />
      )}
      <Routes>
        {/* Public routes */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/test-firebase" element={<TestFirebase />} />
        <Route path="/design-system" element={<DesignSystem />} />
        
        {/* Auth routes - completely separate from any layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - wrapped in Layout component */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/float" element={<FloatManagement />} />
            <Route path="/float-top-up" element={<FloatTopUp />} />
            <Route path="/overdraft" element={<Overdraft />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Default routes */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
