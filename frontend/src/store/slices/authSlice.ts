import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  businessName: string | null;
  businessLocation: string | null;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearError, logout } = authSlice.actions;

// Thunk action for user login
export const loginUser = (credentials: { email: string; password: string }) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const user: User = {
        uid: '123456',
        email: credentials.email,
        displayName: 'John Doe',
        phoneNumber: '+255123456789',
        businessName: 'John\'s Mobile Money',
        businessLocation: 'Dar es Salaam',
        fullName: 'John Doe',
      };
      
      dispatch(setUser(user));
      return user;
    } catch (error: any) {
      dispatch(setError(error.message || 'Login failed'));
      throw error;
    }
  };
};

// Thunk action for user registration
export const registerUser = (userData: {
  fullName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  password: string;
}) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const user: User = {
        uid: '123456',
        email: userData.email,
        displayName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        businessName: userData.businessName,
        businessLocation: 'Not specified',
        fullName: userData.fullName,
      };
      
      dispatch(setUser(user));
      return user;
    } catch (error: any) {
      dispatch(setError(error.message || 'Registration failed'));
      throw error;
    }
  };
};

// Thunk action for user logout
export const logoutUser = () => {
  return async (dispatch: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(logout());
    } catch (error: any) {
      dispatch(setError(error.message || 'Logout failed'));
      throw error;
    }
  };
};

export default authSlice.reducer;
