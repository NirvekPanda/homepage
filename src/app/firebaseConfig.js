// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAltRmD4bRKGzPEqANo0kVWdM-Wma3RvVc",
    authDomain: "portfolio-420-69.firebaseapp.com",
    projectId: "portfolio-420-69",
    storageBucket: "portfolio-420-69.firebasestorage.app",
    messagingSenderId: "189526192204",
    appId: "1:189526192204:web:c9e488fe63fc70034604e9",
    measurementId: "G-94ZWGSBCF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
