import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import globeIcon from '../../assets/globe-icon.svg';

interface LanguageSwitcherProps {
  className?: string;
}

// Define a type for the t function to avoid TypeScript errors
type TranslationFunction = {
  (key: string): string;
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('smartWakalaLanguage', lng);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language;
  
  // Cast t to our custom type
  const translate = t as TranslationFunction;
  
  const languages = [
    { code: 'en', name: translate('settings.english') },
    { code: 'sw', name: translate('settings.swahili') }
  ];

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={translate('settings.language')}
      >
        <img src={globeIcon} alt="" className="w-5 h-5" />
        <span className="ml-2 text-sm hidden sm:inline">
          {currentLanguage === 'en' ? translate('settings.english') : translate('settings.swahili')}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === language.code
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => changeLanguage(language.code)}
              >
                {language.name}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
