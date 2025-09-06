// Import the necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, getDocs, addDoc, collection } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://portfolio-420-69-default-rtdb.firebaseio.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: "G-94ZWGSBCF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

// Configure Google Provider with explicit scopes and better error handling
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account',
    access_type: 'offline'
});
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');

// Simple IndexedDB clearing function
const clearIndexedDB = async () => {
  try {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          const deleteReq = indexedDB.deleteDatabase(db.name);
          await new Promise((resolve, reject) => {
            deleteReq.onsuccess = () => resolve();
            deleteReq.onerror = () => reject(deleteReq.error);
          });
        }
      }
    }
  } catch (error) {
    console.warn('Could not clear IndexedDB:', error);
  }
};

export { db, ref, get, firestore, collection, addDoc, getDocs, auth, googleProvider, clearIndexedDB };