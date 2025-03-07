import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Logo from '../common/Logo';
import { FiHome, FiDollarSign, FiCreditCard, FiList, FiUser, FiSettings, FiPlusCircle } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick, badge }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span>{badge}</span>}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { overdraftBalance } = useSelector((state: RootState) => state.overdraft);
  
  // Handle navigation click on mobile - close sidebar after navigation
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          md:w-64 bg-white shadow-md h-screen overflow-y-auto z-30
          transition-all duration-300 ease-in-out
          ${isOpen ? 'fixed inset-y-0 left-0 w-64' : 'fixed inset-y-0 left-[-256px] md:left-0'}
        `}
      >
        {/* Close button - mobile only */}
        <button 
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <Logo size="md" />
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.businessName || 'Business'}</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-4 px-2 space-y-1">
          <NavItem
            to="/dashboard"
            icon={<IconComponent Icon={FiHome} className="h-5 w-5" />}
            label="Dashboard"
            onClick={handleNavClick}
          />
          
          <NavItem
            to="/float"
            icon={<IconComponent Icon={FiDollarSign} className="h-5 w-5" />}
            label="Float Management"
            onClick={handleNavClick}
          />
          
          <NavItem
            to="/float-top-up"
            icon={<IconComponent Icon={FiPlusCircle} className="h-5 w-5" />}
            label="Top Up Float"
            onClick={handleNavClick}
            badge={
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Quick
              </span>
            }
          />
          
          <NavItem
            to="/overdraft"
            icon={<IconComponent Icon={FiCreditCard} className="h-5 w-5" />}
            label="Overdraft"
            onClick={handleNavClick}
            badge={overdraftBalance > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Active
              </span>
            )}
          />
          
          <NavItem
            to="/transactions"
            icon={<IconComponent Icon={FiList} className="h-5 w-5" />}
            label="Transactions"
            onClick={handleNavClick}
          />
          
          <NavItem
            to="/profile"
            icon={<IconComponent Icon={FiUser} className="h-5 w-5" />}
            label="Profile"
            onClick={handleNavClick}
          />
          
          <NavItem
            to="/settings"
            icon={<IconComponent Icon={FiSettings} className="h-5 w-5" />}
            label="Settings"
            onClick={handleNavClick}
          />
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
