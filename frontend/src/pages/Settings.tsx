import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateRepaymentPercentage, updatePerformanceScore } from '../store/slices/overdraftSlice';
import PerformanceSettings from '../components/dashboard/PerformanceSettings';
import NetworkStatus from '../components/ui/NetworkStatus';
import { useTranslation, Trans } from 'react-i18next';
import globeIcon from '../assets/globe-icon.svg';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { performanceScore, repaymentPercentage, isProcessing } = useSelector((state: RootState) => state.overdraft);
  const { user, isOffline } = useSelector((state: RootState) => state.auth);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Handle performance score update
  const handleUpdatePerformance = async (score: number) => {
    try {
      await dispatch(updatePerformanceScore(score));
    } catch (error) {
      console.error('Error updating performance score:', error);
    }
  };

  // Handle repayment percentage update
  const handleUpdateRepaymentPercentage = async (percentage: number) => {
    try {
      await dispatch(updateRepaymentPercentage(percentage));
    } catch (error) {
      console.error('Error updating repayment percentage:', error);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    void i18n.changeLanguage(lang);
    localStorage.setItem('smartWakalaLanguage', lang);
  };

  return (
    <>
      <NetworkStatus position="floating" showAlways={false} />
      
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          <Trans i18nKey="common.settings.settings">Settings</Trans>
        </h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <PerformanceSettings 
              performanceScore={performanceScore}
              repaymentPercentage={repaymentPercentage}
              isProcessing={isProcessing}
              displayName={user?.displayName}
              onUpdatePerformance={handleUpdatePerformance}
              onUpdateRepaymentPercentage={handleUpdateRepaymentPercentage}
              isOnline={!isOffline}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                <Trans i18nKey="common.settings.language">Language</Trans>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                     onClick={() => handleLanguageChange('en')}>
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <img src={globeIcon} alt="" className="text-blue-600 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        <Trans i18nKey="common.settings.english">English</Trans>
                      </p>
                      <p className="text-sm text-gray-500">English</p>
                    </div>
                  </div>
                  {i18n.language === 'en' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                     onClick={() => handleLanguageChange('sw')}>
                  <div className="flex items-center">
                    <div className="p-2 bg-green-50 rounded-full">
                      <img src={globeIcon} alt="" className="text-green-600 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        <Trans i18nKey="common.settings.swahili">Swahili</Trans>
                      </p>
                      <p className="text-sm text-gray-500">Kiswahili</p>
                    </div>
                  </div>
                  {i18n.language === 'sw' && <div className="w-3 h-3 bg-green-600 rounded-full"></div>}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                <Trans i18nKey="common.settings.notifications">Notifications</Trans>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      <Trans i18nKey="common.settings.transactionAlerts">Transaction Alerts</Trans>
                    </h3>
                    <p className="text-xs text-gray-500">
                      <Trans i18nKey="common.settings.receiveNotificationsForAllTransactions">
                        Receive notifications for all transactions
                      </Trans>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      <Trans i18nKey="common.settings.overdraftAlerts">Overdraft Alerts</Trans>
                    </h3>
                    <p className="text-xs text-gray-500">
                      <Trans i18nKey="common.settings.receiveNotificationsAboutYourOverdraftStatus">
                        Receive notifications about your overdraft status
                      </Trans>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      <Trans i18nKey="common.settings.repaymentReminders">Repayment Reminders</Trans>
                    </h3>
                    <p className="text-xs text-gray-500">
                      <Trans i18nKey="common.settings.receiveRemindersForUpcomingRepayments">
                        Receive reminders for upcoming repayments
                      </Trans>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      <Trans i18nKey="common.settings.performanceUpdates">Performance Updates</Trans>
                    </h3>
                    <p className="text-xs text-gray-500">
                      <Trans i18nKey="common.settings.receiveUpdatesAboutYourPerformanceScore">
                        Receive updates about your performance score
                      </Trans>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                <Trans i18nKey="common.settings.appSettings">App Settings</Trans>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      <Trans i18nKey="common.settings.offlineMode">Offline Mode</Trans>
                    </h3>
                    <p className="text-xs text-gray-500">
                      <Trans i18nKey="common.settings.enableOfflineFunctionalityWhenInternetIsUnavailable">
                        Enable offline functionality when internet is unavailable
                      </Trans>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      <Trans i18nKey="common.settings.darkMode">Dark Mode</Trans>
                    </h3>
                    <p className="text-xs text-gray-500">
                      <Trans i18nKey="common.settings.switchBetweenLightAndDarkTheme">
                        Switch between light and dark theme
                      </Trans>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Settings;
