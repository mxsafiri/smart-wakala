import { ComponentType } from 'react';

// Define the base props for all icons
interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  size?: string | number;
  color?: string;
  title?: string;
}

// Define the IconType as a React component type
type IconType = ComponentType<IconBaseProps>;

// Declare modules for all icon libraries used in the project
declare module 'react-icons' {
  export { IconType, IconBaseProps };
}

declare module 'react-icons/fi' {
  export const FiActivity: IconType;
  export const FiAirplay: IconType;
  export const FiAlertCircle: IconType;
  export const FiAlertOctagon: IconType;
  export const FiAlertTriangle: IconType;
  export const FiArrowDown: IconType;
  export const FiArrowLeft: IconType;
  export const FiArrowRight: IconType;
  export const FiArrowUp: IconType;
  export const FiBell: IconType;
  export const FiBriefcase: IconType;
  export const FiCheckCircle: IconType;
  export const FiChevronDown: IconType;
  export const FiChevronUp: IconType;
  export const FiCreditCard: IconType;
  export const FiDollarSign: IconType;
  export const FiEye: IconType;
  export const FiEyeOff: IconType;
  export const FiLock: IconType;
  export const FiMail: IconType;
  export const FiMenu: IconType;
  export const FiPhone: IconType;
  export const FiUser: IconType;
  export const FiUsers: IconType;
  export const FiWifi: IconType;
  export const FiWifiOff: IconType;
  export const FiX: IconType;
  // Add any other Feather icons used in the project
}

declare module 'react-icons/md' {
  // Material Design icons
  export const MdCheck: IconType;
  export const MdClose: IconType;
  // Add any other Material Design icons used in the project
}

declare module 'react-icons/bs' {
  // Bootstrap icons
  export const BsCheck: IconType;
  export const BsX: IconType;
  // Add any other Bootstrap icons used in the project
}
