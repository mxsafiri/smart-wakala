import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps, MotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'text' | 'outlined' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Create a type that combines HTML button attributes and our custom props,
// but excludes any motion-specific props that might conflict
type ButtonBaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
};

// For the motion button, we need to use HTMLMotionProps
interface ButtonProps extends ButtonBaseProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  animated = true,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  // Use either isLoading or loading prop
  const isButtonLoading = isLoading || loading;
  
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3',
  };
  
  // Handle 'outline' variant for backward compatibility
  const normalizedVariant = variant === 'outline' ? 'outlined' : variant;
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-sm',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-sm',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-sm',
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 shadow-sm',
    light: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 shadow-sm',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700 shadow-sm',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline',
    text: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200 shadow-none',
    outlined: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  
  // Loading animation
  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };
  
  // Button animation
  const buttonVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };
  
  // Combine all classes
  const allClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[normalizedVariant]}
    ${fullWidth ? 'w-full' : ''}
    ${(disabled || isButtonLoading) ? disabledClasses : ''}
    ${className}
  `;
  
  const ButtonContent = () => (
    <>
      {isButtonLoading && (
        <motion.span 
          className="mr-2"
          variants={loadingVariants}
          animate="animate"
        >
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.span>
      )}
      
      {leftIcon && !isButtonLoading && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      <span>{children}</span>
      
      {rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </>
  );
  
  if (animated) {
    // For animated buttons, we need to filter out any HTML button props that might conflict with motion props
    const { 
      onClick, 
      onAnimationStart,
      onDragStart,
      onDragEnd,
      onDrag,
      ...restProps 
    } = props;
    
    // Type assertion to help TypeScript understand we're handling the props correctly
    const motionProps: MotionProps = {
      variants: buttonVariants,
      initial: "initial",
      animate: "animate",
      whileTap: "tap"
    };
    
    // Create a properly typed object for the motion button
    const safeMotionProps: HTMLMotionProps<"button"> = {
      className: allClasses,
      disabled: disabled || isButtonLoading,
      style,
      onClick,
      ...motionProps,
      ...restProps
    };
    
    return (
      <motion.button {...safeMotionProps}>
        <ButtonContent />
      </motion.button>
    );
  }
  
  return (
    <button
      className={allClasses}
      disabled={disabled || isButtonLoading}
      style={style}
      {...props}
    >
      <ButtonContent />
    </button>
  );
};

export default Button;
