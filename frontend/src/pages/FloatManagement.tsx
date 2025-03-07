import React from 'react';
import { motion } from 'framer-motion';
import FloatManagementComponent from '../components/dashboard/FloatManagement';
import FloatSummary from '../components/dashboard/FloatSummary';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import NetworkStatus from '../components/ui/NetworkStatus';

const FloatManagement: React.FC = () => {
  // Mock data
  const weeklyFloatData = [1800000, 2200000, 1950000, 2100000, 2300000, 2450000, 2500000];
  const floatBalance = 2500000;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <>
      <NetworkStatus position="floating" showAlways={false} />
      
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Float Management</h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FloatManagementComponent />
            <FloatSummary
              floatBalance={floatBalance}
              weeklyData={weeklyFloatData}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Float Top-Up History</h2>
              <p className="text-gray-500">Your recent float top-up transactions will appear here.</p>
              
              {/* Placeholder for float top-up history */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500">No recent top-ups to display</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default FloatManagement;
