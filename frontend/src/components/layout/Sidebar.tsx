import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHome, FiDollarSign, FiCreditCard, FiSettings, FiUser } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  Icon: typeof FiHome | typeof FiDollarSign | typeof FiCreditCard | typeof FiSettings | typeof FiUser | typeof FiX;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', Icon: FiHome },
    { path: '/float-topup', label: 'Float Top-up', Icon: FiDollarSign },
    { path: '/overdraft', label: 'Overdraft', Icon: FiCreditCard },
    { path: '/profile', label: 'Profile', Icon: FiUser },
    { path: '/settings', label: 'Settings', Icon: FiSettings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform md:relative md:translate-x-0"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="Smart Wakala"
                />
                <button
                  onClick={onClose}
                  className="md:hidden rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Close sidebar</span>
                  <IconComponent Icon={FiX} className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {menuItems.map(({ path, label, Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={onClose}
                      className={`
                        flex items-center px-2 py-2 text-sm font-medium rounded-md
                        ${isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <IconComponent
                        Icon={Icon}
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
