import React from 'react';
import { IconType } from 'react-icons';

/**
 * Safely render a React Icon as a JSX element
 * This solves the TypeScript error: "cannot be used as a JSX component"
 * 
 * @param Icon The icon component from react-icons
 * @param props Optional props to pass to the icon
 * @returns JSX element with the icon
 * 
 * Usage:
 * import { FiUser } from 'react-icons/fi';
 * import { renderIcon } from '../utils/iconUtils';
 * 
 * // In your component:
 * {renderIcon(FiUser)}
 * {renderIcon(FiUser, { size: 24, color: 'red' })}
 */
export const renderIcon = (Icon: IconType, props: React.SVGAttributes<SVGElement> = {}) => {
  // @ts-ignore - Ignoring type error for backward compatibility
  return React.createElement(Icon, props);
};

/**
 * A wrapper component for React Icons
 * This provides an alternative way to render icons when you need a wrapper element
 * 
 * @param props Component props including the Icon and any icon props
 * @returns JSX element with the wrapped icon
 * 
 * Usage:
 * import { FiUser } from 'react-icons/fi';
 * import { IconComponent } from '../utils/iconUtils';
 * 
 * // In your component:
 * <IconComponent Icon={FiUser} />
 * <IconComponent Icon={FiUser} size={24} color="red" className="my-custom-class" />
 */
interface IconComponentProps extends React.SVGAttributes<SVGElement> {
  Icon: IconType;
  className?: string;
}

export const IconComponent: React.FC<IconComponentProps> = ({ Icon, className = '', ...props }) => {
  return (
    <span className={className}>
      {/* @ts-ignore - Ignoring type error for backward compatibility */}
      {React.createElement(Icon, props)}
    </span>
  );
};
