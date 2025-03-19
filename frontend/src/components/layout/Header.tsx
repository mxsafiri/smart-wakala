import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { IconComponent } from '../../utils/iconUtils';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser() as any);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <IconComponent Icon={FiMenu} className="h-6 w-6" />
              </button>
            )}
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block lg:hidden h-8 w-auto"
                src="/logo-small.svg"
                alt="Smart Wakala"
              />
              <img
                className="hidden lg:block h-8 w-auto"
                src="/logo.svg"
                alt="Smart Wakala"
              />
            </div>
          </div>

          {user && (
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">
                      {user.businessName || user.fullName}
                    </span>
                    <span className="text-xs text-gray-500">
                      Agent ID: {user.agentId}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Sign out</span>
                    <IconComponent Icon={FiLogOut} className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
