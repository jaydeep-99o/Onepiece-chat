// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAz--aS_lp97L9ZzOBJe6HqF0XAXyHboJ0",
    authDomain: "anime-chat-a3770.firebaseapp.com",
    projectId: "anime-chat-a3770",
    storageBucket: "anime-chat-a3770.firebasestorage.app",
    messagingSenderId: "630784943705",
    appId: "1:630784943705:web:78f967623caf88a6203348",
    measurementId: "G-S425NVZYJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Add some debugging info
console.log("Firebase initialized successfully");
console.log("Auth domain:", firebaseConfig.authDomain);

export { auth, db };