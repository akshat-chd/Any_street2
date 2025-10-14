// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPmS-_GVssJvO8pHqqFMiX8P5JpoOv6Hw",
  authDomain: "anystreet-38d0c.firebaseapp.com",
  projectId: "anystreet-38d0c",
  storageBucket: "anystreet-38d0c.appspot.com",
  messagingSenderId: "465967007235",
  appId: "1:465967007235:web:a4e663d97708674a6eb036",
  measurementId: "G-1HR5R8NYG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
