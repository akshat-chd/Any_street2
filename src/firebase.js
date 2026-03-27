import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA8eeG1Fxg6olIhnJc9ox8k1W-vuDpA5k8',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'anystreet-bf010.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anystreet-bf010',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'anystreet-bf010.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '567260150764',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:567260150764:web:158d9799a3884b55f6dec9',
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-5YEJ4CL36Y',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
