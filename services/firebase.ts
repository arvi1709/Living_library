
// FIX: Import modular Firebase functions directly instead of as a namespace.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDVFkz2qqQWW4CJdS49TfdOBD1X33aIzY",
  authDomain: "living-library-ae612.firebaseapp.com",
  projectId: "living-library-ae612",
  storageBucket: "living-library-ae612.firebasestorage.app",
  messagingSenderId: "511786729089",
  appId: "1:511786729089:web:a760f35d26130c2e289780",
  measurementId: "G-6NKPP1R4NY"
};

// Initialize Firebase
// FIX: Call initializeApp directly.
const app = initializeApp(firebaseConfig);

// Export auth instance to be used in other parts of the app
// FIX: Call getAuth directly.
export const auth = getAuth(app);