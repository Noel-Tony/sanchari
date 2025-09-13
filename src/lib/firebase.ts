// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-3316398508-b2fcd",
  "appId": "1:19824187978:web:42dd808527776e6e7364b3",
  "storageBucket": "studio-3316398508-b2fcd.firebasestorage.app",
  "apiKey": "AIzaSyBWg91oUgyRNCVQKa3EwKnuSLtT3Htng4w",
  "authDomain": "studio-3316398508-b2fcd.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "19824187978"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
