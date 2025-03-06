import React from 'react';
import FloatTopUpForm from '../components/float/FloatTopUpForm';
import FloatHistory from '../components/float/FloatHistory';

const FloatTopUp: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Float Top-Up</h1>
        <p className="text-gray-600">Manage your float balance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Up Your Float</h2>
            <FloatTopUpForm />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Float Transaction History</h2>
            <FloatHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatTopUp;
