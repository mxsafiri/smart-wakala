import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';

/**
 * AuthLayout - A dedicated layout for authentication pages
 * This layout provides a clean interface for login/register pages
 * without the main application header to prevent duplication
 */
interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        variants={itemVariants}
      >
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Smart Wakala
        </h2>
      </motion.div>
      
      {children || <Outlet />}
    </motion.div>
  );
};

export default AuthLayout;
