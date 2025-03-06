import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  header,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  elevation = 'md',
  animated = false,
  hoverEffect = false,
  onClick,
}) => {
  // Shadow classes based on elevation
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Base classes
  const baseClasses = `
    bg-white rounded-lg overflow-hidden
    ${shadowClasses[elevation]}
    ${hoverEffect ? 'transition-all duration-300 hover:shadow-lg' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  const CardComponent = () => (
    <div className={baseClasses} onClick={onClick}>
      {/* Custom Header or Title Header */}
      {(title || subtitle || header) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          {header ? (
            header
          ) : (
            <>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      
      {/* Card Body */}
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`px-6 py-4 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
  
  return animated ? (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
    >
      <CardComponent />
    </motion.div>
  ) : (
    <CardComponent />
  );
};

export default Card;
