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
          className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-md flex items-center justify-center overflow-hidden`}
        >
          <div className="flex items-center justify-center relative">
            <span className="text-white font-mono tracking-tighter" style={{ 
              fontSize: size === 'sm' ? '1.1rem' : size === 'md' ? '1.4rem' : size === 'lg' ? '1.7rem' : '2.2rem',
              fontWeight: '800',
              letterSpacing: '-0.05em'
            }}>
              W
            </span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-3/5 h-0.5 bg-white opacity-70 rounded-full"></div>
          </div>
        </motion.div>
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg shadow-md flex items-center justify-center overflow-hidden`}>
          <div className="flex items-center justify-center relative">
            <span className="text-white font-mono tracking-tighter" style={{ 
              fontSize: size === 'sm' ? '1.1rem' : size === 'md' ? '1.4rem' : size === 'lg' ? '1.7rem' : '2.2rem',
              fontWeight: '800',
              letterSpacing: '-0.05em'
            }}>
              W
            </span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-3/5 h-0.5 bg-white opacity-70 rounded-full"></div>
          </div>
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
