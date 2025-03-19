import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { setOfflineStatus } from '../../store/slices/authSlice';

interface NetworkStatusProps {
  position?: 'floating' | 'inline';
  showAlways?: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  position = 'floating',
  showAlways = false 
}) => {
  const dispatch = useDispatch();
  const { isOffline } = useSelector((state: RootState) => state.auth);
  const [showStatus, setShowStatus] = useState(false);
  
  useEffect(() => {
    const updateNetworkStatus = () => {
      const offline = !navigator.onLine;
      dispatch(setOfflineStatus(offline));
      
      if (offline || showAlways) {
        setShowStatus(true);
        // Hide after 5 seconds if we're back online
        if (!offline && !showAlways) {
          setTimeout(() => setShowStatus(false), 5000);
        }
      }
    };
    
    // Initial check
    updateNetworkStatus();
    
    // Listen for network status changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [dispatch, showAlways]);
  
  if (!showStatus) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'floating' ? 20 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'floating' ? 20 : 0 }}
        className={`
          ${position === 'floating' ? 'fixed bottom-4 right-4 z-50' : 'relative'}
          ${isOffline ? 'bg-yellow-50' : 'bg-green-50'}
          rounded-lg shadow-sm border
          ${isOffline ? 'border-yellow-200' : 'border-green-200'}
          p-3
        `}
      >
        <div className="flex items-center gap-2">
          <IconComponent 
            Icon={isOffline ? FiWifiOff : FiWifi}
            className={`w-4 h-4 ${isOffline ? 'text-yellow-500' : 'text-green-500'}`}
          />
          <span className={`text-sm font-medium ${isOffline ? 'text-yellow-700' : 'text-green-700'}`}>
            {isOffline ? 'Offline Mode' : 'Back Online'}
          </span>
        </div>
        {isOffline && (
          <p className="text-xs text-yellow-600 mt-1">
            Some features may be limited. Changes will sync when you're back online.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NetworkStatus;
