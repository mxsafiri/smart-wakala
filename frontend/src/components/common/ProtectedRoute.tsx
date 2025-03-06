import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute: React.FC = () => {
  const { user, loading, error } = useAuthState();
  
  // Add console logging to help debug
  console.log('ProtectedRoute rendering, auth state:', { user, loading, error });

  // Remove demo mode bypass
  const isDemoMode = false;

  if (loading) {
    return <LoadingScreen />;
  }
  
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

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
