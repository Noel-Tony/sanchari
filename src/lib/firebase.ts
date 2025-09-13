// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "TODO: Add your API key",
  authDomain: "TODO: Add your auth domain",
  projectId: "TODO: Add your project ID",
  storageBucket: "TODO: Add your storage bucket",
  messagingSenderId: "TODO: Add your messaging sender ID",
  appId: "TODO: Add your app ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
