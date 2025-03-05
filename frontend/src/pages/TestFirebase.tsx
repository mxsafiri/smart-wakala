import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const TestFirebase: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing Firebase connection...');
  const [error, setError] = useState<string | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState<boolean>(false);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Check if Firebase Auth is initialized
        if (!auth) {
          setError('Firebase Auth is not properly initialized');
          return;
        }

        // Check if Firestore is initialized
        if (!db) {
          setError('Firestore is not properly initialized');
          return;
        }

        setFirebaseInitialized(true);
        setStatus('Firebase is properly initialized');

        // Try to fetch some data from Firestore
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          setStatus(`Firebase is working! Found ${usersSnapshot.size} users.`);
        } catch (firestoreError: any) {
          setStatus('Firebase is initialized but encountered an error when fetching data');
          setError(firestoreError.message || 'Unknown Firestore error');
        }
      } catch (e: any) {
        setError(e.message || 'Unknown error testing Firebase');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Firebase Test</h1>
        
        <div className="mb-4">
          <p className="font-medium">Status:</p>
          <p className={`${firebaseInitialized ? 'text-green-600' : 'text-yellow-600'}`}>
            {status}
          </p>
        </div>
        
        {error && (
          <div className="mb-4">
            <p className="font-medium text-red-600">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Firebase Configuration:</h2>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
            {JSON.stringify({
              apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✓ Set' : '✗ Not set',
              authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Not set',
              projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Not set',
              storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Not set',
              messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Not set',
              appId: process.env.REACT_APP_FIREBASE_APP_ID ? '✓ Set' : '✗ Not set',
            }, null, 2)}
          </pre>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry Test
        </button>
      </div>
    </div>
  );
};

export default TestFirebase;
