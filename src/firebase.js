import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAPmS-_GVssJvO8pHqqFMiX8P5JpoOv6Hw',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'anystreet-38d0c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anystreet-38d0c',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'anystreet-38d0c.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '465967007235',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:465967007235:web:a4e663d97708674a6eb036',
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-1HR5R8NYG7',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
