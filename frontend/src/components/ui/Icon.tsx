import React from 'react';
import * as FiIcons from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';

// Type for all available icon names
type IconName = keyof typeof FiIcons;

interface IconProps extends Omit<IconBaseProps, 'ref'> {
  name: IconName;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = '', ...props }) => {
  // Get the icon component from react-icons
  const IconComponent = FiIcons[name] as React.FC<IconBaseProps>;
  
  // Return the icon with the provided props
  return (
    <span className={className}>
      {IconComponent && React.createElement(IconComponent, { ...props })}
    </span>
  );
};

export default Icon;
