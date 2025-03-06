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
          className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-lg flex items-center justify-center`}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-2/3 h-2/3 text-white"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 10.5C13.38 10.5 14.5 9.38 14.5 8C14.5 6.62 13.38 5.5 12 5.5C10.62 5.5 9.5 6.62 9.5 8C9.5 9.38 10.62 10.5 12 10.5ZM12 12.5C9.67 12.5 5 13.67 5 16V18H19V16C19 13.67 14.33 12.5 12 12.5Z" 
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-lg flex items-center justify-center`}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-2/3 h-2/3 text-white"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 10.5C13.38 10.5 14.5 9.38 14.5 8C14.5 6.62 13.38 5.5 12 5.5C10.62 5.5 9.5 6.62 9.5 8C9.5 9.38 10.62 10.5 12 10.5ZM12 12.5C9.67 12.5 5 13.67 5 16V18H19V16C19 13.67 14.33 12.5 12 12.5Z" 
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
