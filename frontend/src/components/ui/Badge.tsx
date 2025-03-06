import React from 'react';
import { motion } from 'framer-motion';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  outlined?: boolean;
  icon?: React.ReactNode;
  label?: string;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'sm',
  rounded = false,
  outlined = false,
  icon,
  label,
  animated = true,
  className = '',
  children,
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };
  
  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // Variant classes (solid and outlined)
  const variantClasses = {
    primary: outlined 
      ? 'bg-primary-50 text-primary-700 border border-primary-300' 
      : 'bg-primary-100 text-primary-800',
    secondary: outlined 
      ? 'bg-secondary-50 text-secondary-700 border border-secondary-300' 
      : 'bg-secondary-100 text-secondary-800',
    success: outlined 
      ? 'bg-success-50 text-success-700 border border-success-300' 
      : 'bg-success-100 text-success-800',
    warning: outlined 
      ? 'bg-warning-50 text-warning-700 border border-warning-300' 
      : 'bg-warning-100 text-warning-800',
    error: outlined 
      ? 'bg-error-50 text-error-700 border border-error-300' 
      : 'bg-error-100 text-error-800',
    info: outlined 
      ? 'bg-blue-50 text-blue-700 border border-blue-300' 
      : 'bg-blue-100 text-blue-800',
    neutral: outlined 
      ? 'bg-gray-50 text-gray-700 border border-gray-300' 
      : 'bg-gray-100 text-gray-800',
  };
  
  // Combine all classes
  const allClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${roundedClasses}
    ${variantClasses[variant]}
    ${className}
  `;
  
  // Animation variants
  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };
  
  const content = (
    <>
      {icon && <span className="mr-1">{icon}</span>}
      {label || children}
    </>
  );
  
  return animated ? (
    <motion.span
      className={allClasses}
      variants={badgeVariants}
      initial="initial"
      animate="animate"
    >
      {content}
    </motion.span>
  ) : (
    <span className={allClasses}>
      {content}
    </span>
  );
};

export default Badge;
