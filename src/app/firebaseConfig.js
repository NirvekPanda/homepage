// Import the necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import Realtime Database
import "dotenv/config";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "portfolio-420-69.firebaseapp.com",
    databaseURL: "https://portfolio-420-69-default-rtdb.firebaseio.com", // Add Realtime Database URL
    projectId: "portfolio-420-69",
    storageBucket: "portfolio-420-69.appspot.com", // Fixed typo in storageBucket
    messagingSenderId: "189526192204",
    appId: "1:189526192204:web:c9e488fe63fc70034604e9",
    measurementId: "G-94ZWGSBCF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Initialize Realtime Database

export { db };
