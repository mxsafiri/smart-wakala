import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Logo from '../common/Logo';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  
  // Cast t to our custom type to avoid TypeScript errors
  const translate = t as { 
    (key: string): string;
    (key: string, options: Record<string, any>): string;
  };

  const handleLogout = async () => {
    await dispatch(logoutUser() as any);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 mr-2"
              onClick={toggleSidebar}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo size="lg" disableLink={true} />
            </Link>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <LanguageSwitcher className="mr-2" />
                <div className="text-sm hidden sm:block">
                  <span className="text-gray-500">{translate('dashboard.welcomeBack', { name: '' })}</span>
                  <span className="ml-1 font-medium text-gray-900">{user?.fullName}</span>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none">
                    <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      {user?.fullName?.charAt(0) || 'U'}
                    </span>
                    <svg className="ml-1 h-5 w-5 hidden sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {translate('settings.profile')}
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {translate('settings.settings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {translate('auth.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <LanguageSwitcher className="mr-2" />
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    {translate('auth.login')}
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button variant="primary" size="sm">
                    {translate('auth.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
