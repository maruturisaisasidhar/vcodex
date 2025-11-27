// src/firebase/config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Optional: include Analytics if you want to use it
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi7yV-rMIPCbWcCvAmcsc_UAoeMvpQ7Mc",
  authDomain: "v-codex-1234.firebaseapp.com",
  projectId: "v-codex-1234",
  storageBucket: "v-codex-1234.appspot.com", // Corrected storage bucket format
  messagingSenderId: "543285153473",
  appId: "1:543285153473:web:f34ef1d514602fd6b94e40",
  measurementId: "G-TL0TGGBH4T"
};

// Initialize the Firebase app with our configuration
const app = initializeApp(firebaseConfig);

// Initialize the specific Firebase services we will use
const auth = getAuth(app);      // For User Authentication
const db = getFirestore(app);   // For Firestore Database
const storage = getStorage(app); // For Cloud Storage
const analytics = getAnalytics(app); // Optional: For usage analytics

// ✅ FIX: Export the 'app' object along with the other services
export { app, auth, db, storage, analytics };