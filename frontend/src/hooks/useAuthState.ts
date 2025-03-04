import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/auth';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { RootState } from '../store';

export const useAuthState = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    dispatch(setLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userProfile = await getUserProfile(firebaseUser);
          
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            phoneNumber: userProfile?.phoneNumber || null,
            businessName: userProfile?.businessName || null,
            businessLocation: userProfile?.businessLocation || null,
          }));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        dispatch(setError((err as Error).message));
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);
  
  return { user, loading, error };
};
