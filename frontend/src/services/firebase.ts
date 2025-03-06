import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  Firestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  disableNetwork,
  enableNetwork
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// Log Firebase configuration for debugging
console.log('Firebase environment variables:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✓ Set' : '✗ Not set',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Not set',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Not set',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Not set',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Not set',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ? '✓ Set' : '✗ Not set',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ? '✓ Set' : '✗ Not set',
});

// Check for required Firebase configuration
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID'
];

const missingVars = requiredEnvVars.filter(
  varName => !process.env[varName]
);

if (missingVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingVars);
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Check if IndexedDB is available
const isIndexedDBAvailable = () => {
  try {
    // Feature detection for IndexedDB
    if (!window.indexedDB) {
      console.warn('IndexedDB is not available in this browser');
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Error checking IndexedDB availability:', e);
    return false;
  }
};

// Check if we're in a browser environment
const isBrowserEnvironment = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

// Initialize Firebase app first to ensure it exists for all services
try {
  console.log('Initializing Firebase app...');
  firebaseApp = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  // Create a fallback app instance
  firebaseApp = {} as FirebaseApp;
}

// Initialize Firebase services
try {
  console.log('Initializing Firebase Auth...');
  auth = getAuth(firebaseApp);
  
  // Set auth persistence to local
  if (isBrowserEnvironment()) {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase Auth persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
  }
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  // Create a fallback auth instance
  auth = {} as Auth;
}

// Initialize Firestore
try {
  // Initialize Firestore with the appropriate settings
  if (isBrowserEnvironment() && isIndexedDBAvailable()) {
    console.log('Initializing Firestore with persistence...');
    try {
      // Try to initialize with multi-tab persistence first
      db = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
          cacheSizeBytes: CACHE_SIZE_UNLIMITED
        })
      });
      console.log('Firestore initialized with multi-tab persistence');
    } catch (err) {
      console.warn('Failed to initialize with multi-tab persistence, falling back to standard initialization:', err);
      // Fall back to standard initialization
      db = getFirestore(firebaseApp);
      
      // Try to enable persistence separately
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log('Firestore persistence enabled successfully');
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence failed: Multiple tabs open. This is not critical.');
          } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence is not available in this browser. Using online-only mode.');
          } else {
            console.error('Error enabling persistence:', err);
          }
        });
    }
  } else {
    console.warn('IndexedDB not available or not in browser environment, using standard Firestore without persistence');
    db = getFirestore(firebaseApp);
  }
} catch (error) {
  console.error('Error initializing Firestore:', error);
  // Create a fallback db instance
  db = {} as Firestore;
}

// Initialize Storage
try {
  console.log('Initializing Firebase Storage...');
  storage = getStorage(firebaseApp);
} catch (error) {
  console.error('Error initializing Firebase Storage:', error);
  // Create a fallback storage instance
  storage = {} as FirebaseStorage;
}

// Set up network status listeners for Firestore
if (isBrowserEnvironment() && db) {
  window.addEventListener('online', () => {
    console.log('Device is online, enabling Firestore network');
    enableNetwork(db).catch(err => {
      console.error('Error enabling Firestore network:', err);
    });
  });
  
  window.addEventListener('offline', () => {
    console.log('Device is offline, disabling Firestore network to save battery/resources');
    disableNetwork(db).catch(err => {
      console.error('Error disabling Firestore network:', err);
    });
  });
  
  // Initial network state
  if (!navigator.onLine) {
    console.log('Device is starting offline, disabling Firestore network');
    disableNetwork(db).catch(err => {
      console.error('Error disabling Firestore network:', err);
    });
  }
}

console.log('Firebase initialization complete');

// Connect to emulators if in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  try {
    console.log('Connecting to Firebase emulators...');
    if (auth) connectAuthEmulator(auth, 'http://localhost:9099');
    if (db) connectFirestoreEmulator(db, 'localhost', 8080);
    if (storage) connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
}

export { firebaseApp, auth, db, storage };
