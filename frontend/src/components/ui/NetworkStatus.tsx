import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import Badge from './Badge';
import { IconComponent } from '../../utils/iconUtils';

interface NetworkStatusProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'floating';
  showAlways?: boolean;
  className?: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  position = 'top-right',
  showAlways = false,
  className = '',
}) => {
  const { isOffline } = useSelector((state: RootState) => state.auth);
  const [visible, setVisible] = useState(false);
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'floating': 'fixed top-4 right-4 z-50',
  };
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };
  
  useEffect(() => {
    // Always show if showAlways is true
    if (showAlways) {
      setVisible(true);
      return;
    }
    
    // Show when offline
    if (isOffline) {
      setVisible(true);
    } else {
      // When coming back online, show for 3 seconds then hide
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOffline, showAlways]);
  
  // If not visible and not showAlways, don't render
  if (!visible && !showAlways) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`${position === 'floating' ? 'fixed' : 'absolute'} ${positionClasses[position]} ${className}`}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Badge
            variant={isOffline ? 'error' : 'success'}
            icon={
              <IconComponent Icon={isOffline ? FiWifiOff : FiWifi} />
            }
            label={isOffline ? 'Offline' : 'Online'}
            size="md"
            rounded
            outlined
            animated={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
