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
import { useTranslation } from 'react-i18next';

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
  
  const { t } = useTranslation();
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
          title: t('notifications.upcomingPaymentDue'),
          message: t('notifications.paymentDueMessage', { amount: formatCurrency(currentBalance), days: diffDays }),
          date: new Date().toISOString(),
          read: false,
          priority: diffDays <= 2 ? 'high' : 'medium',
          actionable: true,
          action: {
            label: t('common.viewDetails'),
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
          title: t('notifications.overdraftLimitAlert'),
          message: t('notifications.overdraftLimitMessage', { percentage: usedPercentage }),
          date: new Date().toISOString(),
          read: false,
          priority: usedPercentage >= 90 ? 'high' : 'medium',
          actionable: true,
          action: {
            label: t('notifications.addCollateral'),
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
        title: 'Performance Score Alert',
        message: `Your performance score is ${performanceScore}. This may affect your overdraft limit.`,
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
    
    // Collateral update notification
    if (collateralAmount < overdraftUsed * 0.5) {
      newNotifications.push({
        id: 'collateral_update',
        type: 'collateral_update',
        title: 'Collateral Warning',
        message: `Your collateral is below the recommended amount. Current ratio: ${Math.round((collateralAmount / overdraftUsed) * 100)}%.`,
        date: new Date().toISOString(),
        read: false,
        priority: 'high',
        actionable: true,
        action: {
          label: 'Update Collateral',
          onClick: () => console.log('Navigate to collateral management')
        }
      });
    }
    
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  }, [overdraftLimit, overdraftUsed, currentBalance, repaymentDueDate, performanceScore, collateralAmount, repaymentPercentage]);
  
  // Mark a notification as read
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
  
  // Dismiss a notification
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_due':
        return <IconComponent Icon={FiCalendar} className="text-primary-500" />;
      case 'overdraft_limit':
        return <IconComponent Icon={FiCreditCard} className="text-warning-500" />;
      case 'collateral_update':
        return <IconComponent Icon={FiDollarSign} className="text-danger-500" />;
      case 'performance_update':
        return <IconComponent Icon={FiAlertCircle} className="text-accent-500" />;
      default:
        return <IconComponent Icon={FiBell} className="text-gray-500" />;
    }
  };
  
  // Get background color based on priority
  const getBackgroundColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-50 border-l-4 border-danger-500';
      case 'medium':
        return 'bg-warning-50 border-l-4 border-warning-500';
      case 'low':
        return 'bg-gray-50 border-l-4 border-gray-300';
      default:
        return 'bg-gray-50 border-l-4 border-gray-300';
    }
  };
  
  // If no notifications, return minimal UI
  if (notifications.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconComponent Icon={FiBell} className="text-gray-400 mr-2" />
            <h3 className="card-title">Notifications</h3>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 py-6">
          <p>No new notifications</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <IconComponent Icon={FiBell} className="text-primary-500 mr-2" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="card-title">Notifications</h3>
        </div>
        <button 
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {expanded ? (
            <IconComponent Icon={FiChevronUp} />
          ) : (
            <IconComponent Icon={FiChevronDown} />
          )}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3 overflow-hidden"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 rounded-md ${getBackgroundColor(notification.priority)} relative`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <button 
                        onClick={() => dismissNotification(notification.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <IconComponent Icon={FiX} className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                      
                      {notification.actionable && notification.action && (
                        <button
                          onClick={() => {
                            markAsRead(notification.id);
                            notification.action?.onClick();
                          }}
                          className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {!expanded && notifications.length > 0 && (
        <div className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-md ${getBackgroundColor(notifications[0].priority)} relative`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-3">
                {getNotificationIcon(notifications[0].type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{notifications[0].title}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notifications[0].message}</p>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(notifications[0].date).toLocaleDateString()}
                  </span>
                  
                  {notifications[0].actionable && notifications[0].action && (
                    <button
                      onClick={() => {
                        markAsRead(notifications[0].id);
                        notifications[0].action?.onClick();
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      {notifications[0].action.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {notifications.length > 1 && (
            <div className="mt-2 text-center">
              <button 
                onClick={toggleExpanded}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                View {notifications.length - 1} more notification{notifications.length > 2 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
