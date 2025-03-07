import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  animated?: boolean;
  className?: string;
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  variant = 'outlined',
  animated = true,
  className = '',
  prefix,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseClasses = "block w-full sm:text-sm rounded-md transition-all";
  
  const variantClasses = {
    outlined: "border-gray-300 focus:ring-primary-500 focus:border-primary-500 shadow-sm",
    filled: "border-transparent bg-gray-100 focus:bg-white focus:ring-primary-500 focus:border-primary-500",
    underlined: "border-t-0 border-l-0 border-r-0 border-b-2 border-gray-300 focus:ring-0 focus:border-primary-500 rounded-none px-0"
  };
  
  const stateClasses = error 
    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" 
    : variantClasses[variant];
  
  const iconClasses = {
    left: leftIcon ? "pl-10" : "",
    right: rightIcon ? "pr-10" : "",
    prefix: prefix ? "pl-16" : ""
  };
  
  const fullWidthClasses = fullWidth ? "w-full" : "";
  
  const labelClasses = `block text-sm font-medium text-gray-700 mb-2 ${error ? 'text-red-600' : ''}`;
  
  const inputClasses = `
    ${baseClasses}
    ${stateClasses}
    ${iconClasses.left}
    ${iconClasses.right}
    ${iconClasses.prefix}
    py-3
    text-base
    ${className}
  `;
  
  const inputVariants = {
    focus: {
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)"
    },
    error: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4 }
    }
  };
  
  // Determine which component to use based on animation flag
  const renderInput = () => {
    if (animated) {
      return (
        <motion.input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
          variants={inputVariants}
          whileFocus="focus"
          animate={error ? "error" : undefined}
          {...props as any}
        />
      );
    } else {
      return (
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
          {...props}
        />
      );
    }
  };

  return (
    <div className={`${fullWidthClasses} mb-4`}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {prefix}
          </div>
        )}
        
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {renderInput()}
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500" id={`${inputId}-description`}>
          {helperText}
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
