import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError, setNetworkStatus } from '../store/slices/authSlice';
import { UserProfile } from '../store/slices/authSlice';

// Maximum number of retries for Firestore operations
const MAX_RETRIES = 5;
// Base delay between retries in milliseconds (will be used for exponential backoff)
const BASE_RETRY_DELAY = 1000;
// Timeout for auth state resolution (ms)
const AUTH_TIMEOUT = 15000;
// Firestore operation timeout (ms)
const FIRESTORE_TIMEOUT = 10000;

export const useAuthState = () => {
  const [user, setLocalUser] = useState<UserProfile | null>(null);
  const [loading, setLocalLoading] = useState<boolean>(true);
  const [error, setLocalError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const dispatch = useDispatch();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log('Device is now online');
      setIsOnline(true);
      dispatch(setNetworkStatus(true));
    };

    const handleOffline = () => {
      console.log('Device is now offline');
      setIsOnline(false);
      dispatch(setNetworkStatus(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial network status
    dispatch(setNetworkStatus(navigator.onLine));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  // Helper function to get user data from Firestore with retries and timeout
  const getUserDataFromFirestore = async (uid: string, retryCount = 0): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      // Set a timeout for the Firestore operation
      const timeoutId = setTimeout(() => {
        console.warn(`Firestore operation timed out after ${FIRESTORE_TIMEOUT}ms`);
        reject(new Error('Firestore operation timed out'));
      }, FIRESTORE_TIMEOUT);

      try {
        console.log(`Attempting to fetch user data for UID: ${uid} (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
        
        // Check if Firestore is initialized properly
        if (!db || typeof db.type === 'undefined') {
          console.error('Firestore not properly initialized');
          clearTimeout(timeoutId);
          reject(new Error('Firestore not properly initialized'));
          return;
        }
        
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        clearTimeout(timeoutId);
        console.log(`Successfully fetched user data for UID: ${uid}`);
        resolve(userDoc);
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        // Log detailed error information
        console.error(`Error fetching user data from Firestore:`, {
          error: error,
          code: error.code,
          message: error.message,
          stack: error.stack,
          uid: uid,
          retryCount: retryCount
        });
        
        if (retryCount < MAX_RETRIES && navigator.onLine) {
          // Calculate exponential backoff delay
          const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount);
          
          // Only retry if we're online and haven't exceeded max retries
          console.log(`Retrying Firestore fetch in ${delay}ms (${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          try {
            const result = await getUserDataFromFirestore(uid, retryCount + 1);
            resolve(result);
          } catch (retryError) {
            reject(retryError);
          }
        } else {
          // If we're offline or have exceeded retries, reject with the error
          console.warn('Max retries exceeded or device offline, giving up on Firestore fetch');
          reject(error);
        }
      }
    });
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    setLocalLoading(true);
    
    // Attempt to get cached auth state first
    try {
      const cachedUser = localStorage.getItem('smartWakalaUser');
      if (cachedUser) {
        const parsedUser = JSON.parse(cachedUser);
        console.log('Using cached user data while authenticating');
        // Don't set loading to false yet, but provide immediate feedback
        setLocalUser(parsedUser);
        dispatch(setUser(parsedUser));
      }
    } catch (e) {
      console.warn('Failed to parse cached user data', e);
    }
    
    // Set a timeout to prevent getting stuck in loading state
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth state resolution timeout reached');
        setLocalLoading(false);
        dispatch(setLoading(false));
        setLocalError('Authentication timed out. Please refresh the page.');
        dispatch(setError('Authentication timed out. Please refresh the page.'));
        
        // Try to recover by checking auth directly
        try {
          const directAuth = getAuth();
          const currentUser = directAuth.currentUser;
          if (currentUser) {
            console.log('Recovered auth state from direct auth check');
            // Create a basic profile
            const recoveredUser: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              phoneNumber: currentUser.phoneNumber || '',
              businessName: '',
              businessLocation: '',
              fullName: currentUser.displayName || '',
              phone: currentUser.phoneNumber || '',
              address: '',
              agentId: currentUser.uid.substring(0, 6),
              nationalId: '',
            };
            setLocalUser(recoveredUser);
            dispatch(setUser(recoveredUser));
            setLocalError(null);
            dispatch(setError(null));
          }
        } catch (e) {
          console.error('Failed to recover auth state', e);
        }
      }
    }, AUTH_TIMEOUT);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('Firebase user authenticated:', firebaseUser.uid);
          
          // Create a basic user profile that will be used if Firestore fails
          const basicUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            phoneNumber: firebaseUser.phoneNumber || '',
            businessName: '',
            businessLocation: '',
            fullName: firebaseUser.displayName || '',
            phone: firebaseUser.phoneNumber || '',
            address: '',
            agentId: firebaseUser.uid.substring(0, 6),
            nationalId: '',
          };
          
          // First, update the local and Redux state with the basic user info
          // This ensures we don't get stuck if Firestore operations fail
          setLocalUser(basicUser);
          dispatch(setUser(basicUser));
          setLocalLoading(false);
          dispatch(setLoading(false));
          
          // Cache the basic user data for faster recovery
          try {
            localStorage.setItem('smartWakalaUser', JSON.stringify(basicUser));
          } catch (e) {
            console.warn('Failed to cache user data', e);
          }
          
          // Then try to enhance with Firestore data if online
          if (navigator.onLine) {
            try {
              // Get user data from Firestore with retries and timeout
              const userDoc = await getUserDataFromFirestore(firebaseUser.uid);
              
              if (userDoc.exists()) {
                const userData = userDoc.data() as Omit<UserProfile, 'uid' | 'email'>;
                
                const userProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || userData.displayName,
                  phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber,
                  businessName: userData.businessName || '',
                  businessLocation: userData.businessLocation || '',
                  fullName: userData.fullName || firebaseUser.displayName || '',
                  phone: userData.phone || firebaseUser.phoneNumber || '',
                  address: userData.address || '',
                  agentId: userData.agentId || firebaseUser.uid.substring(0, 6),
                  nationalId: userData.nationalId || '',
                };
                
                // Update with enhanced profile
                setLocalUser(userProfile);
                dispatch(setUser(userProfile));
                
                // Cache the enhanced user data
                try {
                  localStorage.setItem('smartWakalaUser', JSON.stringify(userProfile));
                } catch (e) {
                  console.warn('Failed to cache enhanced user data', e);
                }
              } else {
                // No Firestore data exists, create a basic profile document
                console.log('No Firestore profile found, creating one');
                try {
                  await setDoc(doc(db, 'users', firebaseUser.uid), {
                    displayName: basicUser.displayName,
                    phoneNumber: basicUser.phoneNumber,
                    businessName: '',
                    businessLocation: '',
                    fullName: basicUser.displayName,
                    phone: basicUser.phoneNumber,
                    address: '',
                    agentId: basicUser.agentId,
                    nationalId: '',
                    createdAt: new Date().toISOString(),
                  });
                  console.log('Created basic Firestore profile');
                } catch (createError) {
                  console.warn('Failed to create Firestore profile:', createError);
                  // Continue with basic profile even if creation fails
                }
              }
            } catch (firestoreError: any) {
              // Handle specific Firestore errors
              if (firestoreError.code === 'unavailable') {
                console.warn('Firestore unavailable, possibly offline. Using basic profile.');
              } else {
                console.error('Error fetching user data from Firestore:', firestoreError);
              }
              // We already set the basic profile above, so no need to do it again
            }
          } else {
            console.log('Offline mode: Using basic user profile');
          }
        } else {
          console.log('No user authenticated');
          setLocalUser(null);
          dispatch(setUser(null));
          setLocalLoading(false);
          dispatch(setLoading(false));
          
          // Clear cached user data
          try {
            localStorage.removeItem('smartWakalaUser');
          } catch (e) {
            console.warn('Failed to clear cached user data', e);
          }
        }
        
        setLocalError(null);
        dispatch(setError(null));
      } catch (error: any) {
        console.error('Auth state error:', error);
        setLocalError(error.message || 'Authentication error');
        dispatch(setError(error.message || 'Authentication error'));
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    }, (error: Error) => {
      console.error('Auth state change error:', error);
      setLocalError(error.message);
      dispatch(setError(error.message));
      setLocalLoading(false);
      dispatch(setLoading(false));
    });
    
    // Cleanup subscription and timeout
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [dispatch, loading]);
  
  return { user, loading, error, isOnline };
};
