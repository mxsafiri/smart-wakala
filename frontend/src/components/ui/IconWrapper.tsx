import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * IconWrapper component to handle React Icons properly with TypeScript
 * This solves the "cannot be used as a JSX component" error by wrapping the icon
 * 
 * Usage:
 * <IconWrapper><Icon /></IconWrapper>
 * or
 * <IconWrapper className="text-red-500"><Icon /></IconWrapper>
 */
const IconWrapper: React.FC<IconWrapperProps> = ({ children, className = '' }) => {
  // For TypeScript to properly handle React Icons, we need to ensure
  // that we're rendering the icon as an element, not as a component
  return (
    <span className={className}>
      {children}
    </span>
  );
};

// Create a helper function to render icons safely
export const renderIcon = (Icon: IconType, props = {}) => {
  // @ts-ignore - Ignoring type error for backward compatibility
  return React.createElement(Icon, props);
};

export default IconWrapper;
