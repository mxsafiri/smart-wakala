import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import globeIcon from '../../assets/globe-icon.svg';

interface LanguageWelcomeModalProps {
  onClose: () => void;
}

const LanguageWelcomeModal: React.FC<LanguageWelcomeModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  
  // Cast t to our custom type to avoid TypeScript errors
  const translate = t as { 
    (key: string): string;
    (key: string, options: Record<string, any>): string;
  };
  
  useEffect(() => {
    // Show modal after a short delay for animation purposes
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('smartWakalaLanguage', lang);
    localStorage.setItem('languageWelcomeShown', 'true');
    onClose();
  };
  
  const handleClose = () => {
    setShowModal(false);
    // Add a small delay before calling onClose to allow animation to complete
    setTimeout(onClose, 300);
    localStorage.setItem('languageWelcomeShown', 'true');
  };
  
  return (
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <img src={globeIcon} alt="" className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{translate('welcome.selectLanguage')}</h2>
                <p className="text-gray-600 mt-2">{translate('welcome.choosePreferredLanguage')}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="p-2 bg-blue-50 rounded-full">
                    <img src={globeIcon} alt="" className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-medium text-gray-800">{translate('settings.english')}</p>
                    <p className="text-sm text-gray-500">English</p>
                  </div>
                  {i18n.language === 'en' && (
                    <div className="ml-auto w-4 h-4 bg-blue-600 rounded-full"></div>
                  )}
                </button>
                
                <button
                  onClick={() => handleLanguageSelect('sw')}
                  className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <div className="p-2 bg-green-50 rounded-full">
                    <img src={globeIcon} alt="" className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-medium text-gray-800">{translate('settings.swahili')}</p>
                    <p className="text-sm text-gray-500">Kiswahili</p>
                  </div>
                  {i18n.language === 'sw' && (
                    <div className="ml-auto w-4 h-4 bg-green-600 rounded-full"></div>
                  )}
                </button>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {translate('common.close')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LanguageWelcomeModal;
