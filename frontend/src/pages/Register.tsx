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
          <Logo size="xl" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={itemVariants}
        initial="initial"
        animate="animate"
      >
        <Card>
          {isOffline && (
            <Alert 
              variant="warning" 
              title="You are offline" 
              message="Registration is not available while offline. Please check your connection."
              className="mb-4"
            />
          )}
          
          <RegisterForm />
          
          <div className="mt-6 text-center text-sm">
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
