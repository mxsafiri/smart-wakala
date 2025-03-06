import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiPhone } from 'react-icons/fi';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { registerUser } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { IconComponent } from '../../utils/iconUtils';

// Form validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  businessName: yup.string().required('Business name is required'),
  phone: yup
    .string()
    .matches(/^[0-9+\s-]+$/, 'Invalid phone number')
    .required('Phone number is required'),
});

// Form data interface
interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  phone: string;
}

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isOffline } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  
  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(
        registerUser({
          fullName: data.fullName,
          businessName: data.businessName,
          phoneNumber: data.phone,
          email: data.email,
          password: data.password,
        })
      );
      reset();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-gray-600 mt-2">
          Register as a Smart Wakala agent
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {isOffline && (
        <div className="mb-6 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
          You are currently offline. Registration requires an internet connection.
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div variants={itemVariants}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.fullName?.message}
            {...register('fullName')}
            leftIcon={<IconComponent Icon={FiUser} />}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
            leftIcon={<IconComponent Icon={FiMail} />}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            {...register('password')}
            leftIcon={<IconComponent Icon={FiLock} />}
            rightIcon={
              <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                <IconComponent Icon={showPassword ? FiEyeOff : FiEye} />
              </button>
            }
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            type={showConfirmPassword ? 'text' : 'password'}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            leftIcon={<IconComponent Icon={FiLock} />}
            rightIcon={
              <button type="button" onClick={toggleConfirmPasswordVisibility} className="focus:outline-none">
                <IconComponent Icon={showConfirmPassword ? FiEyeOff : FiEye} />
              </button>
            }
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Business Name"
            placeholder="Enter your business name"
            error={errors.businessName?.message}
            {...register('businessName')}
            leftIcon={<IconComponent Icon={FiBriefcase} />}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            error={errors.phone?.message}
            {...register('phone')}
            leftIcon={<IconComponent Icon={FiPhone} />}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading || isOffline}
          >
            Register
          </Button>
        </motion.div>
      </form>
      
      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign In
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
