import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/ui/Card';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Alert from '../components/ui/Alert';
import Logo from '../components/common/Logo';

const Register: React.FC = () => {
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
            Create Account
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Register as a Smart Wakala agent
          </p>
          
          {isOffline && (
            <Alert 
              variant="warning" 
              title="You are offline" 
              message="Registration is not available while offline. Please check your connection."
              className="mb-6"
            />
          )}
          
          <RegisterForm />
          
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
