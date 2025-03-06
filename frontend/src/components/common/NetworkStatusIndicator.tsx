import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AnimatePresence, motion } from 'framer-motion';

interface NetworkStatusIndicatorProps {
  className?: string;
}

const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({ className = '' }) => {
  const isOffline = useSelector((state: RootState) => state.auth.isOffline);
  const [showIndicator, setShowIndicator] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    // Show indicator immediately when offline
    if (isOffline) {
      setShowIndicator(true);
      setReconnecting(false);
    } else {
      // When coming back online, show reconnecting message briefly
      if (showIndicator) {
        setReconnecting(true);
        // Hide after 3 seconds when back online
        const timer = setTimeout(() => {
          setReconnecting(false);
          // After showing "reconnected", wait a bit before hiding
          setTimeout(() => {
            setShowIndicator(false);
          }, 1500);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isOffline, showIndicator]);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 flex justify-center ${className}`}
        >
          <div 
            className={`px-4 py-2 rounded-b-lg shadow-md text-sm font-medium flex items-center ${
              reconnecting ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              reconnecting ? 'bg-white animate-pulse' : 'bg-white'
            }`}></span>
            <span>
              {reconnecting ? 'Reconnected to network' : 'You are currently offline'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatusIndicator;
