// Simple script to test if environment variables are being loaded correctly
console.log('Testing environment variables:');
console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Not set');
console.log('REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set');
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Set' : 'Not set');
console.log('REACT_APP_FIREBASE_STORAGE_BUCKET:', process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not set');
console.log('REACT_APP_FIREBASE_MESSAGING_SENDER_ID:', process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not set');
console.log('REACT_APP_FIREBASE_APP_ID:', process.env.REACT_APP_FIREBASE_APP_ID ? 'Set' : 'Not set');
console.log('REACT_APP_FIREBASE_MEASUREMENT_ID:', process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ? 'Set' : 'Not set');
