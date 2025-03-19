import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NetworkStatus from '../ui/NetworkStatus';
import { setOfflineStatus } from '../../store/slices/authSlice';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Create a context to track nested MainLayout components
export const MainLayoutContext = React.createContext<boolean>(false);

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isOffline } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Check if this MainLayout is nested inside another MainLayout
  const isNested = React.useContext(MainLayoutContext);
  
  useEffect(() => {
    const handleNetworkChange = () => {
      dispatch(setOfflineStatus(!navigator.onLine));
    };

    // Initial check
    handleNetworkChange();
    
    // Add event listeners
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [dispatch]);
  
  // If this is a nested MainLayout, just render children without headers/footers
  if (isNested) {
    return <>{children}</>;
  }
  
  return (
    // Provide context value to prevent nested MainLayouts
    <MainLayoutContext.Provider value={true}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Always show network status indicator */}
        <NetworkStatus position="floating" />
        
        {/* Only render one header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="flex flex-1">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className={`flex-1 p-4 md:p-6 transition-all duration-300`}>
            {isOffline && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  You are currently in offline mode. Some features may be limited.
                </p>
              </div>
            )}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </MainLayoutContext.Provider>
  );
};

export default MainLayout;
