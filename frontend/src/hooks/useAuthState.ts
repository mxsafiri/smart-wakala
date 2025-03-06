import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { UserProfile } from '../store/slices/authSlice';

export const useAuthState = () => {
  const [user, setLocalUser] = useState<UserProfile | null>(null);
  const [loading, setLocalLoading] = useState<boolean>(true);
  const [error, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Setting up auth state listener');
    setLocalLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('Firebase user authenticated:', firebaseUser.uid);
          
          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data() as Omit<UserProfile, 'uid' | 'email'>;
              
              const userProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || userData.displayName,
                phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber,
                businessName: userData.businessName,
                businessLocation: userData.businessLocation,
                fullName: userData.fullName,
                phone: userData.phone,
                address: userData.address,
                agentId: userData.agentId,
              };
              
              setLocalUser(userProfile);
              dispatch(setUser(userProfile));
            } else {
              // Basic user profile if no Firestore data exists
              const userProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                phoneNumber: firebaseUser.phoneNumber || '',
                businessName: '',
                businessLocation: '',
                fullName: '',
                phone: '',
                address: '',
                agentId: firebaseUser.uid.substring(0, 6),
              };
              
              setLocalUser(userProfile);
              dispatch(setUser(userProfile));
            }
          } catch (firestoreError) {
            console.error('Error fetching user data from Firestore:', firestoreError);
            
            // If Firestore fails, still authenticate with basic profile
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
            };
            
            setLocalUser(basicUser);
            dispatch(setUser(basicUser));
          }
        } else {
          console.log('No user authenticated');
          setLocalUser(null);
          dispatch(setUser(null));
        }
        
        setLocalLoading(false);
        dispatch(setLoading(false));
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
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);
  
  return { user, loading, error };
};
