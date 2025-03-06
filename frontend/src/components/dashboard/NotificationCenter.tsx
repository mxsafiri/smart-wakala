import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiAlertCircle, 
  FiCalendar, 
  FiDollarSign, 
  FiCreditCard, 
  FiX,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';
import { formatCurrency } from '../../utils/formatters';

interface Notification {
  id: string;
  type: 'payment_due' | 'overdraft_limit' | 'collateral_update' | 'performance_update';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationCenter: React.FC = () => {
  const { 
    overdraftLimit, 
    overdraftUsed, 
    currentBalance, 
    repaymentDueDate,
    performanceScore,
    collateralAmount,
    repaymentPercentage,
    isOffline
  } = useSelector((state: RootState) => state.overdraft);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Generate notifications based on current state
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // Payment due notification
    if (repaymentDueDate && currentBalance > 0) {
      const dueDate = new Date(repaymentDueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        newNotifications.push({
          id: 'payment_due',
          type: 'payment_due',
          title: 'Upcoming Payment Due',
          message: `You have a payment of ${formatCurrency(currentBalance)} due in ${diffDays} days.`,
          date: new Date().toISOString(),
          read: false,
          priority: diffDays <= 2 ? 'high' : 'medium',
          actionable: true,
          action: {
            label: 'View Details',
            onClick: () => console.log('Navigate to payment details')
          }
        });
      }
    }
    
    // Overdraft limit notification
    if (overdraftLimit > 0 && overdraftUsed > 0) {
      const usedPercentage = Math.round((overdraftUsed / overdraftLimit) * 100);
      
      if (usedPercentage >= 80) {
        newNotifications.push({
          id: 'overdraft_limit',
          type: 'overdraft_limit',
          title: 'Overdraft Limit Alert',
          message: `You've used ${usedPercentage}% of your overdraft limit. Consider adding more collateral.`,
          date: new Date().toISOString(),
          read: false,
          priority: usedPercentage >= 90 ? 'high' : 'medium',
          actionable: true,
          action: {
            label: 'Add Collateral',
            onClick: () => console.log('Navigate to add collateral')
          }
        });
      }
    }
    
    // Performance score notification
    if (performanceScore < 60) {
      newNotifications.push({
        id: 'performance_update',
        type: 'performance_update',
        title: 'Low Performance Score',
        message: `Your current performance score is ${performanceScore}%. Improving this can increase your overdraft limit.`,
        date: new Date().toISOString(),
        read: false,
        priority: performanceScore < 40 ? 'high' : 'medium',
        actionable: true,
        action: {
          label: 'View Performance',
          onClick: () => console.log('Navigate to performance settings')
        }
      });
    }
    
    // Collateral notification
    if (collateralAmount === 0) {
      newNotifications.push({
        id: 'collateral_update',
        type: 'collateral_update',
        title: 'No Collateral Added',
        message: 'You haven\'t added any collateral yet. Add collateral to increase your overdraft limit.',
        date: new Date().toISOString(),
        read: false,
        priority: 'medium',
        actionable: true,
        action: {
          label: 'Add Collateral',
          onClick: () => console.log('Navigate to add collateral')
        }
      });
    }
    
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  }, [
    overdraftLimit, 
    overdraftUsed, 
    currentBalance, 
    repaymentDueDate,
    performanceScore,
    collateralAmount,
    repaymentPercentage
  ]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'payment_due':
        return FiCalendar;
      case 'overdraft_limit':
        return FiCreditCard;
      case 'collateral_update':
        return FiDollarSign;
      case 'performance_update':
        return FiAlertCircle;
      default:
        return FiBell;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-100';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100';
      case 'low':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="relative">
            <IconComponent Icon={FiBell} className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="ml-2 text-lg font-semibold text-gray-800">Notifications</h3>
        </div>
        <IconComponent 
          Icon={expanded ? FiChevronUp : FiChevronDown} 
          className="h-5 w-5 text-gray-600" 
        />
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No notifications at this time</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border-b border-gray-200 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                          <IconComponent Icon={getIconForType(notification.type)} className="h-5 w-5" />
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <IconComponent Icon={FiX} className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          
                          {notification.actionable && notification.action && (
                            <button
                              onClick={() => {
                                notification.action?.onClick();
                                markAsRead(notification.id);
                              }}
                              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                              disabled={isOffline}
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
