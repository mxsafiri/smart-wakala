import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  Firestore,
  enableIndexedDbPersistence
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

try {
  // Initialize Firebase
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
  
  console.log('Firebase initialized successfully');

  // Try to enable offline persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Firestore persistence enabled successfully');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence is not available in this browser');
      } else {
        console.error('Error enabling persistence:', err);
      }
    });

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Firebase emulators');
    } catch (emulatorError) {
      console.error('Failed to connect to Firebase emulators:', emulatorError);
    }
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Create typed fallback objects to prevent app from crashing
  firebaseApp = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
}

export { firebaseApp, auth, db, storage };
