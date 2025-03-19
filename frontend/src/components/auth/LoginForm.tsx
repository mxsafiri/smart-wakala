import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, isOffline, user } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('agent@smartwakala.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [directLoginAttempt, setDirectLoginAttempt] = useState(false);
  
  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validateForm()) return;
    
    // Don't attempt login if offline
    if (isOffline) {
      setLoginError('You are currently offline. Please check your connection and try again.');
      return;
    }
    
    try {
      console.log('Attempting login with:', email);
      setDirectLoginAttempt(true);
      
      // Try direct Firebase authentication first to avoid potential Redux issues
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        console.log('Direct Firebase login successful, now syncing with Redux');
        
        // Then sync with Redux store
        dispatch(loginUser({ email, password }) as any)
          .then(() => {
            console.log('Redux sync successful, navigating to dashboard');
            navigate('/dashboard', { replace: true });
          })
          .catch((error: any) => {
            console.warn('Redux sync had issues, but Firebase auth succeeded. Proceeding anyway.');
            // Even if Redux sync fails, we can still navigate since Firebase auth succeeded
            navigate('/dashboard', { replace: true });
          });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      handleLoginError(error);
      setDirectLoginAttempt(false);
    }
  };

  const handleLoginError = (error: any) => {
    // Handle specific Firebase auth errors
    if (error.code === 'auth/user-not-found') {
      setLoginError('No account found with this email address');
    } else if (error.code === 'auth/wrong-password') {
      setLoginError('Incorrect password');
    } else if (error.code === 'auth/too-many-requests') {
      setLoginError('Too many failed login attempts. Please try again later');
    } else if (error.code === 'auth/network-request-failed') {
      setLoginError('Network error. Please check your connection');
    } else if (error.code === 'auth/invalid-credential') {
      setLoginError('Invalid login credentials. Please check your email and password');
    } else {
      setLoginError(error.message || 'Failed to sign in. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || loginError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{loginError || error}</p>
        </div>
      )}
      
      {isOffline && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="flex items-center text-sm text-yellow-700">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            You are currently offline. Login is disabled until your connection is restored.
          </p>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            placeholder="you@example.com"
            disabled={isLoading || isOffline}
          />
        </div>
        {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`block w-full pl-10 pr-10 py-2 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            placeholder="••••••••"
            disabled={isLoading || isOffline}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              disabled={isLoading || isOffline}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <button 
            type="button"
            className="font-medium text-primary-600 hover:text-primary-500"
            onClick={() => alert('Password reset functionality will be implemented soon!')}
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || isOffline || directLoginAttempt}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            (isLoading || isOffline || directLoginAttempt) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isLoading || directLoginAttempt ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
