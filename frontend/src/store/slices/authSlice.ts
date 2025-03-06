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

export interface UserProfile {
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
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isOffline: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isOffline: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = !action.payload;
      
      // Handle Firestore network status
      if (state.isOffline) {
        disableNetwork(db).catch(err => {
          console.error('Error disabling Firestore network:', err);
        });
      } else {
        enableNetwork(db).catch(err => {
          console.error('Error enabling Firestore network:', err);
        });
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  setUser, 
  setLoading, 
  setError, 
  logout, 
  updateUserProfile,
  setOfflineStatus,
  setNetworkStatus
} = authSlice.actions;

// Check network status
export const checkNetworkStatus = () => {
  return async (dispatch: any) => {
    // Check if browser is online
    const updateNetworkStatus = () => {
      const isOffline = !navigator.onLine;
      dispatch(setOfflineStatus(isOffline));
      
      // Enable/disable Firestore network
      if (isOffline) {
        disableNetwork(db).catch(err => {
          console.error('Error disabling Firestore network:', err);
        });
      } else {
        enableNetwork(db).catch(err => {
          console.error('Error enabling Firestore network:', err);
        });
      }
    };
    
    // Initial check
    updateNetworkStatus();
    
    // Listen for network status changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  };
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
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<UserProfile, 'uid' | 'email'>;
          
          const user: UserProfile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || credentials.email,
            displayName: userCredential.user.displayName || userData.displayName,
            phoneNumber: userCredential.user.phoneNumber || userData.phoneNumber,
            businessName: userData.businessName,
            businessLocation: userData.businessLocation,
            fullName: userData.fullName,
            phone: userData.phone,
            address: userData.address,
            agentId: userData.agentId,
          };
          
          dispatch(setUser(user));
          
          // Set up listener for user profile updates
          const unsubscribe = onSnapshot(
            doc(db, 'users', userCredential.user.uid),
            (doc) => {
              if (doc.exists()) {
                const updatedData = doc.data() as Omit<UserProfile, 'uid' | 'email'>;
                dispatch(updateUserProfile(updatedData));
              }
            },
            (error) => {
              console.error('Error listening to user profile updates:', error);
            }
          );
          
          return user;
        } else {
          // Basic user profile if no Firestore data exists
          const user: UserProfile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || credentials.email,
            displayName: userCredential.user.displayName || '',
            phoneNumber: userCredential.user.phoneNumber || '',
            businessName: '',
            businessLocation: '',
            fullName: '',
            phone: '',
            address: '',
            agentId: '',
          };
          
          // Create user document in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            businessName: user.businessName,
            businessLocation: user.businessLocation,
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
            agentId: userCredential.user.uid.substring(0, 6),
          });
          
          dispatch(setUser(user));
          return user;
        }
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
      dispatch(logout());
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch(setError(error.message || 'Logout failed'));
      throw error;
    }
  };
};

export default authSlice.reducer;
