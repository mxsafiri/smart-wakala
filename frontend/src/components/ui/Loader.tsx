import React from 'react';
import { motion } from 'framer-motion';

type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'progress' | 'primary';
type LoaderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'white';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  color?: LoaderColor;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  className = '',
}) => {
  // Size classes
  const sizeMap = {
    xs: { size: 16, thickness: 2 },
    sm: { size: 24, thickness: 2 },
    md: { size: 32, thickness: 3 },
    lg: { size: 48, thickness: 4 },
    xl: { size: 64, thickness: 5 },
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
    neutral: 'text-gray-600',
    white: 'text-white',
  };
  
  // Full screen classes
  const fullScreenClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'
    : '';
  
  // Spinner animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };
  
  // Dots animation variants
  const dotsVariants = {
    animate: {
      y: ["0%", "-50%", "0%"],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };
  
  // Pulse animation variants
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };
  
  // Progress animation variants
  const progressVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };
  
  // Render the appropriate loader based on variant
  const renderLoader = () => {
    const { size: sizeValue, thickness } = sizeMap[size];
    
    // If variant is 'primary', use the spinner variant with primary color
    if (variant === 'primary') {
      return (
        <motion.div
          className={`${colorClasses.primary}`}
          variants={spinnerVariants}
          animate="animate"
        >
          <svg
            width={sizeValue}
            height={sizeValue}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth={thickness}
            />
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19"
              stroke="currentColor"
              strokeWidth={thickness}
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      );
    }
    
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={`${colorClasses[color]}`}
            variants={spinnerVariants}
            animate="animate"
          >
            <svg
              width={sizeValue}
              height={sizeValue}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth={thickness}
              />
              <path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19"
                stroke="currentColor"
                strokeWidth={thickness}
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        );
        
      case 'dots':
        return (
          <div className={`flex space-x-1 ${colorClasses[color]}`}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full bg-current"
                style={{
                  width: sizeValue / 4,
                  height: sizeValue / 4
                }}
                variants={dotsVariants}
                animate="animate"
                custom={i * 0.2}
                transition={{
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <motion.div
            className={`rounded-full bg-current ${colorClasses[color]}`}
            style={{
              width: sizeValue,
              height: sizeValue
            }}
            variants={pulseVariants}
            animate="animate"
          />
        );
        
      case 'progress':
        return (
          <div 
            className="bg-gray-200 rounded-full overflow-hidden"
            style={{
              width: sizeValue * 3,
              height: thickness * 2
            }}
          >
            <motion.div
              className={`h-full ${colorClasses[color]} bg-current`}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreenClasses} ${className}`}>
      {renderLoader()}
      
      {text && (
        <p className={`mt-2 text-sm font-medium ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
