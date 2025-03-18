import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PerformanceSettings from '../components/dashboard/PerformanceSettings';
import NetworkStatus from '../components/ui/NetworkStatus';
import { useTranslation } from 'react-i18next';
import globeIcon from '../assets/globe-icon.svg';

const Settings: React.FC = () => {
  const { user, isOffline } = useSelector((state: RootState) => state.auth);
  const { t, i18n } = useTranslation();
  
  // Cast t to our custom type to avoid TypeScript errors
  const translate = t as { 
    (key: string): string;
    (key: string, options: Record<string, any>): string;
  };
  
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">{translate('settings.settings')}</h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <PerformanceSettings />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">{translate('settings.language')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                     onClick={() => i18n.changeLanguage('en')}>
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <img src={globeIcon} alt="" className="text-blue-600 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{translate('settings.english')}</p>
                      <p className="text-sm text-gray-500">English</p>
                    </div>
                  </div>
                  {i18n.language === 'en' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                     onClick={() => i18n.changeLanguage('sw')}>
                  <div className="flex items-center">
                    <div className="p-2 bg-green-50 rounded-full">
                      <img src={globeIcon} alt="" className="text-green-600 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{translate('settings.swahili')}</p>
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
              <h2 className="text-lg font-medium text-gray-800 mb-4">{translate('settings.notifications')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.transactionAlerts')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.receiveNotificationsForAllTransactions')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.overdraftAlerts')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.receiveNotificationsAboutYourOverdraftStatus')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.repaymentReminders')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.receiveRemindersForUpcomingRepayments')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.performanceUpdates')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.receiveUpdatesAboutYourPerformanceScore')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">{translate('settings.appSettings')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.offlineMode')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.enableOfflineFunctionalityWhenInternetIsUnavailable')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.darkMode')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.switchBetweenLightAndDarkTheme')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{translate('settings.language')}</h3>
                    <p className="text-xs text-gray-500">{translate('settings.chooseYourPreferredLanguage')}</p>
                  </div>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5">
                    <option value="en">{translate('settings.english')}</option>
                    <option value="sw">{translate('settings.swahili')}</option>
                  </select>
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
