import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-gray-500">Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
