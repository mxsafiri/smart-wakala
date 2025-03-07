import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/ui/Card';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Alert from '../components/ui/Alert';
import Logo from '../components/common/Logo';

const Login: React.FC = () => {
  const { isOffline } = useSelector((state: RootState) => state.auth);

  // Animation variants
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="xl" withText={true} />
        </div>
        <p className="mt-4 text-center text-md text-gray-600">
          Mobile Money Agent Management Platform
        </p>
      </div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={itemVariants}
        initial="initial"
        animate="animate"
      >
        <Card className="p-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Sign In
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Access your Smart Wakala dashboard
          </p>
          
          {isOffline && (
            <Alert 
              variant="warning" 
              title="You are offline" 
              message="Login is not available while offline. Please check your connection."
              className="mb-6"
            />
          )}
          
          <LoginForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={isOffline}
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032 1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.514 0-9.98 4.466-9.98 9.98s4.466 9.98 9.98 9.98c4.977 0 9.43-3.603 9.43-9.98 0-0.661-0.084-1.302-0.236-1.912l-9.194 0.266z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={isOffline}
              >
                <span className="sr-only">Sign in with Phone</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.5 2.5h-11c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-15c0-1.1-.9-2-2-2zm-5.5 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5.5-4h-11v-11h11v11z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Register
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
