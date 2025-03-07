import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  animated?: boolean;
  className?: string;
  linkTo?: string;
  disableLink?: boolean; // New prop to disable link wrapping
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  animated = true,
  className = '',
  linkTo = '/',
  disableLink = false
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  // Animation variants
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      {animated ? (
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-lg flex items-center justify-center overflow-hidden`}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-3/4 h-3/4 text-white"
          >
            {/* New simplified and iconic logo - stylized "W" with float/money element */}
            <path 
              d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" 
              fill="rgba(255,255,255,0.15)"
            />
            <path 
              d="M5 9L8 15L12 7L16 15L19 9" 
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle 
              cx="12" 
              cy="16" 
              r="1.5" 
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-lg flex items-center justify-center overflow-hidden`}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-3/4 h-3/4 text-white"
          >
            {/* New simplified and iconic logo - stylized "W" with float/money element */}
            <path 
              d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" 
              fill="rgba(255,255,255,0.15)"
            />
            <path 
              d="M5 9L8 15L12 7L16 15L19 9" 
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle 
              cx="12" 
              cy="16" 
              r="1.5" 
              fill="currentColor"
            />
          </svg>
        </div>
      )}

      {withText && (
        animated ? (
          <motion.span
            variants={textVariants}
            initial="initial"
            animate="animate"
            className={`ml-2 font-bold ${textSizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600`}
          >
            Smart Wakala
          </motion.span>
        ) : (
          <span className={`ml-2 font-bold ${textSizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600`}>
            Smart Wakala
          </span>
        )
      )}
    </div>
  );

  if (linkTo && !disableLink) {
    return (
      <Link to={linkTo} className="inline-flex focus:outline-none">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
