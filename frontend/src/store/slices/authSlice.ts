import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  enableNetwork,
  disableNetwork,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

interface AuthState {
  user: UserProfile | null;
  isOffline: boolean;
  lastSyncTime: number | null;
  error: string | null;
  isLoading: boolean;
  retryTimeout: number;
  maxRetries: number;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  businessName: string;
  businessLocation: string;
  fullName: string;
  phone: string;
  address: string;
  agentId: string;
  nationalId: string;
}

const initialState: AuthState = {
  user: null,
  isOffline: false,
  lastSyncTime: null,
  error: null,
  isLoading: false,
  retryTimeout: 5000, // Start with 5 seconds
  maxRetries: 5
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.error = null;
      state.isLoading = false;
      if (action.payload) {
        state.lastSyncTime = Date.now();
      }
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
      if (!action.payload) { // When coming back online
        state.retryTimeout = initialState.retryTimeout; // Reset retry timeout
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    incrementRetryTimeout: (state) => {
      state.retryTimeout = Math.min(state.retryTimeout * 2, 60000); // Max 1 minute
    }
  }
});

export const { 
  setUser, 
  setOfflineStatus, 
  setError, 
  setLoading, 
  incrementRetryTimeout
} = authSlice.actions;

// Thunk for fetching user data with improved offline handling
export const fetchUserData = (uid: string, retryCount: number = 0) => async (dispatch: any, getState: any) => {
  const state = getState().auth;
  
  // If we're offline and have cached user data that's less than 1 hour old, don't retry
  if (state.isOffline && state.user && state.lastSyncTime && 
      (Date.now() - state.lastSyncTime < 3600000) && retryCount > 0) {
    return;
  }

  // If we've exceeded max retries, stop
  if (retryCount >= state.maxRetries) {
    return;
  }

  try {
    dispatch(setLoading(true));
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<UserProfile, 'uid' | 'email'>;
      dispatch(setUser({
        uid,
        email: '',
        ...userData
      }));
    } else {
      dispatch(setError('User not found'));
    }
  } catch (error: any) {
    if (error?.code === 'unavailable') {
      dispatch(setOfflineStatus(true));
      
      // Only log the first retry attempt
      if (retryCount === 0) {
        console.warn('Device is offline. Using cached data if available.');
      }
      
      // Schedule retry with exponential backoff
      if (retryCount < state.maxRetries) {
        setTimeout(() => {
          dispatch(fetchUserData(uid, retryCount + 1));
          dispatch(incrementRetryTimeout());
        }, state.retryTimeout);
      }
    } else {
      dispatch(setError(error.message));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk action for user login
export const loginUser = (credentials: { email: string; password: string }) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    
    // Check network status first
    if (!navigator.onLine) {
      dispatch(setError('You are offline. Please check your internet connection and try again.'));
      return Promise.reject(new Error('You are offline. Please check your internet connection and try again.'));
    }
    
    try {
      // Use Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      try {
        // Get user data from Firestore
        await dispatch(fetchUserData(userCredential.user.uid));
      } catch (firestoreError: any) {
        console.error('Firestore error during login:', firestoreError);
        
        // If Firestore fails but authentication succeeded, still log the user in
        // with basic profile from auth
        const basicUser: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || credentials.email,
          displayName: userCredential.user.displayName || '',
          phoneNumber: userCredential.user.phoneNumber || '',
          businessName: '',
          businessLocation: '',
          fullName: userCredential.user.displayName || '',
          phone: userCredential.user.phoneNumber || '',
          address: '',
          agentId: userCredential.user.uid.substring(0, 6),
          nationalId: '',
        };
        
        dispatch(setUser(basicUser));
        return basicUser;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
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
  nationalId: string;
}) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    
    // Check network status first
    if (!navigator.onLine) {
      dispatch(setError('You are offline. Please check your internet connection and try again.'));
      return Promise.reject(new Error('You are offline. Please check your internet connection and try again.'));
    }
    
    try {
      // Use Firebase authentication to create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: userData.fullName
      });
      
      try {
        // Create user document in Firestore
        const userProfile = {
          displayName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          businessName: userData.businessName,
          businessLocation: 'Not specified',
          fullName: userData.fullName,
          phone: userData.phoneNumber,
          address: 'Not specified',
          agentId: userCredential.user.uid.substring(0, 6),
          nationalId: userData.nationalId,
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
        
        // Create complete user profile
        const user: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || userData.email,
          ...userProfile
        };
        
        dispatch(setUser(user));
        return user;
      } catch (firestoreError: any) {
        console.error('Firestore error during registration:', firestoreError);
        
        // If Firestore fails but user was created, still log them in
        const basicUser: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || userData.email,
          displayName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          businessName: userData.businessName,
          businessLocation: 'Not specified',
          fullName: userData.fullName,
          phone: userData.phoneNumber,
          address: 'Not specified',
          agentId: userCredential.user.uid.substring(0, 6),
          nationalId: userData.nationalId,
        };
        
        dispatch(setUser(basicUser));
        return basicUser;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
      throw error;
    }
  };
};

// Thunk action for user logout
export const logoutUser = () => {
  return async (dispatch: any) => {
    try {
      // Use Firebase signOut
      await signOut(auth);
      dispatch(setUser(null));
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch(setError(error.message || 'Logout failed'));
      throw error;
    }
  };
};

export default authSlice.reducer;
